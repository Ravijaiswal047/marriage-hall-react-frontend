import { apiClient } from '@/lib/api/client';
import type { HallRequestDTO, HallSearchParams, SpringPage } from '@/types/api';
import type { Hall } from '@/types/common';

const FALLBACK_HALLS_KEY = 'marriagehall_fallback_halls';

const DEFAULT_SEED_HALLS: Hall[] = [
  {
    id: 'hall-1',
    name: 'Grand Crystal Palace & Ballroom',
    location: 'Bandra West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Hill Road, Bandra West, Mumbai, Maharashtra 400050',
    price: 150000,
    vegPricePerPlate: 1200,
    nonVegPricePerPlate: 1600,
    capacity: 800,
    floatingCapacity: 1200,
    description: 'Luxury air-conditioned banquet hall with crystal chandeliers, executive bride room, and stage decor.',
    coverImageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1545232979-fbfd42e000b9?auto=format&fit=crop&q=80&w=1200',
    ],
    hasAc: true,
    hasParking: true,
    parkingCapacity: 200,
    roomsCount: 4,
    outsideCateringAllowed: true,
    djAllowed: true,
    alcoholAllowed: true,
    powerBackup: true,
    vendorId: 'vendor-1',
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'hall-2',
    name: 'Royal Heritage Lawns & Convention',
    location: 'Aerocity, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    address: 'Hospitality District, Aerocity, New Delhi 110037',
    price: 220000,
    vegPricePerPlate: 1500,
    nonVegPricePerPlate: 2000,
    capacity: 1200,
    floatingCapacity: 2000,
    description: 'Sprawling open-air lush green wedding lawn equipped with state-of-the-art stage lighting and dining setups.',
    coverImageUrl: 'https://images.unsplash.com/photo-1545232979-fbfd42e000b9?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1545232979-fbfd42e000b9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    ],
    hasAc: true,
    hasParking: true,
    parkingCapacity: 350,
    roomsCount: 6,
    outsideCateringAllowed: true,
    djAllowed: true,
    alcoholAllowed: true,
    powerBackup: true,
    vendorId: 'vendor-1',
    status: 'ACTIVE',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z',
  },
  {
    id: 'hall-3',
    name: 'Emerald Palms Banquet & Stage',
    location: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    address: '100 Feet Road, Indiranagar, Bangalore 560038',
    price: 95000,
    vegPricePerPlate: 900,
    nonVegPricePerPlate: 1200,
    capacity: 450,
    floatingCapacity: 700,
    description: 'Modern elegant banquet venue ideal for weddings, sangeet ceremonies, and grand anniversary celebrations.',
    coverImageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
    ],
    hasAc: true,
    hasParking: true,
    parkingCapacity: 100,
    roomsCount: 3,
    outsideCateringAllowed: false,
    djAllowed: true,
    alcoholAllowed: false,
    powerBackup: true,
    vendorId: 'vendor-2',
    status: 'ACTIVE',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'hall-4',
    name: 'Jaipur Royal Palace Banquet',
    location: 'C Scheme, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Ashok Marg, C Scheme, Jaipur, Rajasthan 302001',
    price: 180000,
    vegPricePerPlate: 1400,
    nonVegPricePerPlate: 1800,
    capacity: 900,
    floatingCapacity: 1400,
    description: 'Royal Rajasthani heritage architecture venue featuring intricate arches, courtyard dining, and luxury guest suites.',
    coverImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1545232979-fbfd42e000b9?auto=format&fit=crop&q=80&w=1200',
    ],
    hasAc: true,
    hasParking: true,
    parkingCapacity: 250,
    roomsCount: 8,
    outsideCateringAllowed: true,
    djAllowed: true,
    alcoholAllowed: true,
    powerBackup: true,
    vendorId: 'vendor-2',
    status: 'ACTIVE',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'hall-5',
    name: 'Beachside Serenity Garden & Resort',
    location: 'Calangute, Goa',
    city: 'Goa',
    state: 'Goa',
    address: 'Calangute Beach Road, Goa 403516',
    price: 250000,
    vegPricePerPlate: 1600,
    nonVegPricePerPlate: 2200,
    capacity: 600,
    floatingCapacity: 1000,
    description: 'Breathtaking beachside destination wedding venue offering sunset view lawns, pool deck, and sea breeze dining.',
    coverImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    ],
    hasAc: false,
    hasParking: true,
    parkingCapacity: 150,
    roomsCount: 10,
    outsideCateringAllowed: true,
    djAllowed: true,
    alcoholAllowed: true,
    powerBackup: true,
    vendorId: 'vendor-3',
    status: 'ACTIVE',
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'hall-6',
    name: 'Nizam Premier Banquet & Convention',
    location: 'Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No 12, Banjara Hills, Hyderabad 500034',
    price: 130000,
    vegPricePerPlate: 1100,
    nonVegPricePerPlate: 1500,
    capacity: 700,
    floatingCapacity: 1100,
    description: 'Opulent hall with royal interior aesthetics, modular dining setups, and full power backup.',
    coverImageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
    ],
    hasAc: true,
    hasParking: true,
    parkingCapacity: 180,
    roomsCount: 5,
    outsideCateringAllowed: true,
    djAllowed: true,
    alcoholAllowed: false,
    powerBackup: true,
    vendorId: 'vendor-3',
    status: 'ACTIVE',
    createdAt: '2026-02-20T10:00:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z',
  },
];

const getFallbackHalls = (): Hall[] => {
  try {
    const raw = localStorage.getItem(FALLBACK_HALLS_KEY);
    if (!raw) {
      localStorage.setItem(FALLBACK_HALLS_KEY, JSON.stringify(DEFAULT_SEED_HALLS));
      return DEFAULT_SEED_HALLS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SEED_HALLS;
  } catch {
    return DEFAULT_SEED_HALLS;
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

const filterAndSortFallbackHalls = (
  halls: Hall[],
  params: HallSearchParams
): Hall[] => {
  let list = [...halls];

  if (params.city && params.city.trim()) {
    const q = params.city.toLowerCase().trim();
    list = list.filter(
      (h) =>
        (h.city && h.city.toLowerCase().includes(q)) ||
        (h.location && h.location.toLowerCase().includes(q)) ||
        (h.name && h.name.toLowerCase().includes(q)) ||
        (h.address && h.address.toLowerCase().includes(q))
    );
  }

  if (params.minPrice !== undefined && params.minPrice > 0) {
    list = list.filter((h) => h.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined && params.maxPrice > 0) {
    list = list.filter((h) => h.price <= params.maxPrice!);
  }

  if (params.minCapacity !== undefined && params.minCapacity > 0) {
    list = list.filter((h) => h.capacity >= params.minCapacity!);
  }

  if (params.hasAc !== undefined) {
    list = list.filter((h) => Boolean(h.hasAc) === Boolean(params.hasAc));
  }

  if (params.hasParking !== undefined) {
    list = list.filter((h) => Boolean(h.hasParking) === Boolean(params.hasParking));
  }

  const sortBy = params.sortBy || 'createdAt';
  const direction = params.direction || 'desc';

  list.sort((a, b) => {
    let comp = 0;
    if (sortBy === 'price') {
      comp = a.price - b.price;
    } else if (sortBy === 'capacity') {
      comp = a.capacity - b.capacity;
    } else if (sortBy === 'name') {
      comp = a.name.localeCompare(b.name);
    } else {
      comp = (a.createdAt || '').localeCompare(b.createdAt || '');
    }
    return direction === 'asc' ? comp : -comp;
  });

  return list;
};

export const hallsApi = {
  getHalls: async (params: HallSearchParams): Promise<SpringPage<Hall>> => {
    const rawFallbackList = getFallbackHalls();
    const filteredFallbackList = filterAndSortFallbackHalls(rawFallbackList, params);
    const pageNumber = params.page || 0;
    const pageSize = params.size || 12;

    try {
      const res = await apiClient.get<SpringPage<Hall>>('/halls', { params, timeout: 5000 });
      if (res.data && Array.isArray(res.data.content)) {
        return res.data;
      }
    } catch {
      // Fall through to offline fallback
    }

    const start = pageNumber * pageSize;
    const paginated = filteredFallbackList.slice(start, start + pageSize);
    const totalPages = Math.ceil(filteredFallbackList.length / pageSize) || 1;

    return {
      content: paginated,
      pageable: {
        pageNumber,
        pageSize,
        sort: { sorted: true, unsorted: false, empty: false },
      },
      totalElements: filteredFallbackList.length,
      totalPages,
      last: pageNumber >= totalPages - 1,
      first: pageNumber === 0,
      size: pageSize,
      number: pageNumber,
      numberOfElements: paginated.length,
      empty: paginated.length === 0,
    };
  },

  getCities: async (): Promise<string[]> => {
    try {
      const res = await apiClient.get<string[]>('/halls/cities', { timeout: 4000 });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fall through
    }
    const fallbackList = getFallbackHalls();
    const citiesSet = new Set(fallbackList.map((h) => h.city).filter(Boolean));
    ['Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Hyderabad', 'Udaipur', 'Goa', 'Chennai'].forEach((c) =>
      citiesSet.add(c)
    );
    return Array.from(citiesSet).filter((c): c is string => Boolean(c));
  },

  createHall: async (data: HallRequestDTO): Promise<Hall> => {
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
        timeout: 6000,
      });
      if (res.data) {
        saveFallbackHall(res.data);
        return res.data;
      }
    } catch {
      // Fall through to fallback creation
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
      hasAc: Boolean(data.hasAc),
      hasParking: Boolean(data.hasParking),
      parkingCapacity: data.parkingCapacity,
      roomsCount: data.roomsCount,
      outsideCateringAllowed: data.outsideCateringAllowed,
      djAllowed: data.djAllowed,
      alcoholAllowed: data.alcoholAllowed,
      powerBackup: data.powerBackup,
      vendorId: 'vendor-1',
      status: 'ACTIVE',
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
      if (res.data) return res.data;
    } catch {
      // Fall through
    }

    if (localMatch) return localMatch;
    throw new Error('Venue not found');
  },

  getVendorHalls: async (vendorId: string): Promise<Hall[]> => {
    const fallbackList = getFallbackHalls();
    try {
      const res = await apiClient.get<Hall[]>(`/halls/vendor/${vendorId}`, { timeout: 5000 });
      if (res.data) {
        const serverHalls = res.data;
        const serverIds = new Set(serverHalls.map((h) => h.id));
        const extraFallbacks = fallbackList.filter((h) => !serverIds.has(h.id));
        return [...extraFallbacks, ...serverHalls];
      }
    } catch {
      // Fall through
    }
    return fallbackList;
  },

  updateHall: async (hallId: string, data: HallRequestDTO): Promise<Hall> => {
    try {
      const res = await apiClient.put<Hall>(`/halls/${hallId}`, data, { timeout: 6000 });
      if (res.data) {
        saveFallbackHall(res.data);
        return res.data;
      }
    } catch {
      // Fall through
    }

    const fallbackList = getFallbackHalls();
    const existing = fallbackList.find((h) => h.id === hallId);

    const updatedHall: Hall = {
      ...(existing || {
        id: hallId,
        vendorId: 'vendor-1',
        status: 'ACTIVE',
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
      hasAc: Boolean(data.hasAc ?? existing?.hasAc),
      hasParking: Boolean(data.hasParking ?? existing?.hasParking),
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
      // Fall through
    }

    const fallbackList = getFallbackHalls();
    const updated = fallbackList.filter((h) => h.id !== hallId);
    localStorage.setItem(FALLBACK_HALLS_KEY, JSON.stringify(updated));
  },
};
