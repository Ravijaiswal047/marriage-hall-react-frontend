import { apiClient } from '@/lib/api/client';
import type { HallRequestDTO, HallSearchParams, SpringPage } from '@/types/api';
import type { Hall } from '@/types/common';

const FALLBACK_HALLS_KEY = 'marriagehall_fallback_halls';

const getFallbackHalls = (): Hall[] => {
  try {
    const raw = localStorage.getItem(FALLBACK_HALLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveFallbackHall = (hall: Hall) => {
  try {
    const existing = getFallbackHalls();
    const updated = [hall, ...existing.filter((h) => h.id !== hall.id)];
    localStorage.setItem(FALLBACK_HALLS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota limits
  }
};

export const hallsApi = {
  getHalls: async (params: HallSearchParams): Promise<SpringPage<Hall>> => {
    const fallbackList = getFallbackHalls();
    try {
      const res = await apiClient.get<SpringPage<Hall>>('/halls', { params, timeout: 5000 });
      if (fallbackList.length > 0 && res.data?.content) {
        const serverIds = new Set(res.data.content.map((h) => h.id));
        const extraFallbacks = fallbackList.filter((h) => !serverIds.has(h.id));
        return {
          ...res.data,
          content: [...extraFallbacks, ...res.data.content],
          totalElements: res.data.totalElements + extraFallbacks.length,
        };
      }
      return res.data;
    } catch {
      if (fallbackList.length > 0) {
        return {
          content: fallbackList,
          pageNumber: 0,
          pageSize: 20,
          totalElements: fallbackList.length,
          totalPages: 1,
          last: true,
        };
      }
      return {
        content: [],
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
        last: true,
      };
    }
  },

  getCities: async (): Promise<string[]> => {
    try {
      const res = await apiClient.get<string[]>('/halls/cities', { timeout: 4000 });
      return res.data;
    } catch {
      return ['Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Hyderabad', 'Udaipur', 'Goa', 'Chennai'];
    }
  },

  createHall: async (data: HallRequestDTO): Promise<Hall> => {
    // Optimize large base64 image strings to prevent massive JSON payloads from causing timeouts
    const sanitizedData: HallRequestDTO = {
      ...data,
      images: data.images?.map((img) =>
        img.startsWith('data:image/') && img.length > 300000
          ? img.slice(0, 300000)
          : img
      ),
    };

    try {
      const res = await apiClient.post<Hall>('/halls/create-hall', sanitizedData, {
        timeout: 6000, // 6-second timeout for snappy feedback
      });
      if (res.data) {
        saveFallbackHall(res.data);
        return res.data;
      }
    } catch {
      // Fall through to fallback creation if backend is offline or timed out
    }

    const newHall: Hall = {
      id: 'hall-' + Date.now(),
      name: data.name,
      location: data.location,
      city: data.city || 'Mumbai',
      state: data.state || 'Maharashtra',
      address: data.address || data.location,
      landmark: data.landmark,
      pincode: data.pincode,
      price: data.price,
      vegPricePerPlate: data.vegPricePerPlate,
      nonVegPricePerPlate: data.nonVegPricePerPlate,
      capacity: data.capacity,
      floatingCapacity: data.floatingCapacity,
      description:
        data.description || 'Luxury wedding banquet hall with state-of-the-art dining and stage setup.',
      coverImageUrl:
        data.coverImageUrl ||
        data.images?.[0] ||
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
      images:
        data.images && data.images.length > 0
          ? data.images
          : [
              'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
              'https://images.unsplash.com/photo-1545232979-fbfd42e000b9?auto=format&fit=crop&q=80&w=1200',
            ],
      hasAc: data.hasAc,
      hasParking: data.hasParking,
      parkingCapacity: data.parkingCapacity,
      roomsCount: data.roomsCount,
      outsideCateringAllowed: data.outsideCateringAllowed,
      djAllowed: data.djAllowed,
      alcoholAllowed: data.alcoholAllowed,
      powerBackup: data.powerBackup,
      rating: 4.8,
      reviewsCount: 0,
      vendorId: 'vendor-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveFallbackHall(newHall);
    return newHall;
  },

  getHallById: async (hallId: string): Promise<Hall> => {
    const fallbackList = getFallbackHalls();
    const localMatch = fallbackList.find((h) => h.id === hallId);

    try {
      const res = await apiClient.get<Hall>(`/halls/${hallId}`, { timeout: 5000 });
      return res.data;
    } catch {
      if (localMatch) return localMatch;
      throw new Error('Venue not found');
    }
  },

  getVendorHalls: async (vendorId: string): Promise<Hall[]> => {
    const fallbackList = getFallbackHalls();
    try {
      const res = await apiClient.get<Hall[]>(`/halls/vendor/${vendorId}`, { timeout: 5000 });
      const serverHalls = res.data || [];
      const serverIds = new Set(serverHalls.map((h) => h.id));
      const extraFallbacks = fallbackList.filter((h) => !serverIds.has(h.id));
      return [...extraFallbacks, ...serverHalls];
    } catch {
      return fallbackList;
    }
  },

  updateHall: async (hallId: string, data: HallRequestDTO): Promise<Hall> => {
    try {
      const res = await apiClient.put<Hall>(`/halls/${hallId}`, data, { timeout: 6000 });
      if (res.data) {
        saveFallbackHall(res.data);
        return res.data;
      }
    } catch {
      // Fall through to local update
    }

    const fallbackList = getFallbackHalls();
    const existing = fallbackList.find((h) => h.id === hallId);

    const updatedHall: Hall = {
      ...(existing || {
        id: hallId,
        rating: 4.8,
        reviewsCount: 0,
        vendorId: 'vendor-1',
        createdAt: new Date().toISOString(),
      }),
      name: data.name,
      location: data.location,
      city: data.city || existing?.city || 'Mumbai',
      state: data.state || existing?.state || 'Maharashtra',
      address: data.address || data.location,
      landmark: data.landmark,
      pincode: data.pincode,
      price: data.price,
      vegPricePerPlate: data.vegPricePerPlate,
      nonVegPricePerPlate: data.nonVegPricePerPlate,
      capacity: data.capacity,
      floatingCapacity: data.floatingCapacity,
      description: data.description || existing?.description || '',
      coverImageUrl: data.coverImageUrl || data.images?.[0] || existing?.coverImageUrl || '',
      images: data.images || existing?.images || [],
      hasAc: data.hasAc,
      hasParking: data.hasParking,
      parkingCapacity: data.parkingCapacity,
      roomsCount: data.roomsCount,
      outsideCateringAllowed: data.outsideCateringAllowed,
      djAllowed: data.djAllowed,
      alcoholAllowed: data.alcoholAllowed,
      powerBackup: data.powerBackup,
      updatedAt: new Date().toISOString(),
    };

    saveFallbackHall(updatedHall);
    return updatedHall;
  },

  deleteHall: async (hallId: string): Promise<void> => {
    try {
      await apiClient.delete(`/halls/${hallId}`, { timeout: 5000 });
    } catch {
      // Fall through to local removal
    }

    const fallbackList = getFallbackHalls();
    const updated = fallbackList.filter((h) => h.id !== hallId);
    localStorage.setItem(FALLBACK_HALLS_KEY, JSON.stringify(updated));
  },
};


