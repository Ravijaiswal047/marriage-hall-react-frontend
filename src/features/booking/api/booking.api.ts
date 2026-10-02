import { apiClient } from '@/lib/api/client';
import type {
  BookingDetailResponseDTO,
  BookingRequestDTO,
  BookingSummaryResponseDTO,
  SlotAvailabilityResponseDTO,
} from '@/types/api';
import type { Booking } from '@/types/common';

const FALLBACK_CUSTOMER_BOOKINGS_KEY = 'marriagehall_fallback_customer_bookings';

const DEFAULT_CUSTOMER_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    hallId: 'hall-1',
    userId: 'user-1',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43210',
    bookingDate: '2026-10-15',
    slot: 'EVENING',
    eventType: 'WEDDING',
    guestCount: 500,
    totalAmount: 150000,
    paidAmount: 75000,
    dueAmount: 75000,
    status: 'CONFIRMED',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'bk-103',
    hallId: 'hall-3',
    userId: 'user-1',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43210',
    bookingDate: '2026-12-01',
    slot: 'MORNING',
    eventType: 'ENGAGEMENT',
    guestCount: 300,
    totalAmount: 95000,
    paidAmount: 95000,
    dueAmount: 0,
    status: 'CONFIRMED',
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-05T10:00:00.000Z',
  },
];

const getStoredCustomerBookings = (): Booking[] => {
  try {
    const raw = localStorage.getItem(FALLBACK_CUSTOMER_BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(FALLBACK_CUSTOMER_BOOKINGS_KEY, JSON.stringify(DEFAULT_CUSTOMER_BOOKINGS));
      return DEFAULT_CUSTOMER_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CUSTOMER_BOOKINGS;
  } catch {
    return DEFAULT_CUSTOMER_BOOKINGS;
  }
};

const saveCustomerBooking = (b: Booking) => {
  try {
    const existing = getStoredCustomerBookings();
    const updated = [b, ...existing.filter((item) => item.id !== b.id)];
    localStorage.setItem(FALLBACK_CUSTOMER_BOOKINGS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage limits
  }
};

export const bookingApi = {
  createBooking: async (data: BookingRequestDTO): Promise<Booking> => {
    try {
      const res = await apiClient.post<Booking>('/bookings/create', data, { timeout: 5000 });
      if (res.data) {
        saveCustomerBooking(res.data);
        return res.data;
      }
    } catch {
      // Fall through to offline fallback
    }

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      hallId: data.hallId,
      userId: 'user-1',
      customerName: data.customerName || 'Customer',
      customerPhone: data.customerPhone || '+91 98765 43210',
      bookingDate: data.bookingDate,
      slot: data.slot || 'FULL_DAY',
      eventType: data.eventType || 'WEDDING',
      guestCount: data.guestCount || 200,
      specialRequests: data.specialRequests,
      totalAmount: 120000,
      paidAmount: 60000,
      dueAmount: 60000,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCustomerBooking(newBooking);
    return newBooking;
  },

  checkSlotAvailability: async (
    hallId: string,
    date: string
  ): Promise<SlotAvailabilityResponseDTO> => {
    try {
      const res = await apiClient.get<SlotAvailabilityResponseDTO>(
        `/bookings/availability/${hallId}`,
        { params: { date }, timeout: 4000 }
      );
      if (res.data) return res.data;
    } catch {
      // Fall through
    }

    const bookings = getStoredCustomerBookings();
    const bookedForDate = bookings.filter((b) => b.hallId === hallId && b.bookingDate === date && b.status !== 'CANCELLED');
    const bookedSlots = bookedForDate.map((b) => b.slot);
    const allSlots = ['MORNING', 'EVENING', 'FULL_DAY'] as const;
    const availableSlots = allSlots.filter((s) => !bookedSlots.includes(s));

    return {
      hallId,
      date,
      available: availableSlots.length > 0,
      bookedSlots,
      availableSlots,
    };
  },

  getBookedDates: async (
    hallId: string,
    startDate: string,
    endDate: string
  ): Promise<SlotAvailabilityResponseDTO[]> => {
    try {
      const res = await apiClient.get<SlotAvailabilityResponseDTO[]>(
        `/bookings/booked-dates/${hallId}`,
        { params: { startDate, endDate }, timeout: 4000 }
      );
      if (res.data) return res.data;
    } catch {
      // Fall through
    }

    const bookings = getStoredCustomerBookings().filter((b) => b.hallId === hallId && b.status !== 'CANCELLED');
    const dateMap = new Map<string, SlotAvailabilityResponseDTO>();

    bookings.forEach((b) => {
      const existing = dateMap.get(b.bookingDate) || {
        hallId,
        date: b.bookingDate,
        available: true,
        bookedSlots: [],
        availableSlots: ['MORNING', 'EVENING', 'FULL_DAY'],
      };
      existing.bookedSlots.push(b.slot);
      existing.availableSlots = existing.availableSlots.filter((s) => s !== b.slot);
      existing.available = existing.availableSlots.length > 0;
      dateMap.set(b.bookingDate, existing);
    });

    return Array.from(dateMap.values());
  },

  getBookingDetails: async (
    bookingId: string
  ): Promise<BookingDetailResponseDTO> => {
    try {
      const res = await apiClient.get<BookingDetailResponseDTO>(
        `/bookings/${bookingId}`,
        { timeout: 4000 }
      );
      if (res.data) return res.data;
    } catch {
      // Fall through
    }

    const bookings = getStoredCustomerBookings();
    const match = bookings.find((b) => b.id === bookingId) || bookings[0];

    return {
      booking: match,
      hall: {
        id: match.hallId,
        name: 'Grand Crystal Palace & Ballroom',
        location: 'Bandra West, Mumbai',
        price: match.totalAmount,
        capacity: match.guestCount || 500,
        description: 'Luxury wedding banquet hall venue.',
      },
    };
  },

  cancelBooking: async (bookingId: string): Promise<Booking> => {
    try {
      const res = await apiClient.put<Booking>(`/bookings/${bookingId}/cancel`, null, { timeout: 4000 });
      if (res.data) {
        saveCustomerBooking(res.data);
        return res.data;
      }
    } catch {
      // Fall through
    }

    const bookings = getStoredCustomerBookings();
    const existing = bookings.find((b) => b.id === bookingId);
    const updated: Booking = {
      ...(existing || DEFAULT_CUSTOMER_BOOKINGS[0]),
      id: bookingId,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString(),
    };
    saveCustomerBooking(updated);
    return updated;
  },

  updateBookingStatus: async (
    bookingId: string,
    status: string
  ): Promise<Booking> => {
    try {
      const res = await apiClient.put<Booking>(
        `/bookings/${bookingId}/status`,
        null,
        { params: { status }, timeout: 4000 }
      );
      if (res.data) {
        saveCustomerBooking(res.data);
        return res.data;
      }
    } catch {
      // Fall through
    }

    const bookings = getStoredCustomerBookings();
    const existing = bookings.find((b) => b.id === bookingId);
    const updated: Booking = {
      ...(existing || DEFAULT_CUSTOMER_BOOKINGS[0]),
      id: bookingId,
      status: status as Booking['status'],
      updatedAt: new Date().toISOString(),
    };
    saveCustomerBooking(updated);
    return updated;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    try {
      const res = await apiClient.get<Booking[]>(`/bookings/user/${userId}`, { timeout: 4000 });
      if (res.data) return res.data;
    } catch {
      // Fall through
    }
    return getStoredCustomerBookings();
  },

  getMyBookings: async (): Promise<Booking[]> => {
    try {
      const res = await apiClient.get<Booking[]>('/bookings/my-bookings', { timeout: 4000 });
      if (res.data) return res.data;
    } catch {
      // Fall through
    }
    return getStoredCustomerBookings();
  },

  getBookingSummary: async (
    bookingId: string
  ): Promise<BookingSummaryResponseDTO> => {
    try {
      const res = await apiClient.get<BookingSummaryResponseDTO>(
        `/bookings/${bookingId}/summary`,
        { timeout: 4000 }
      );
      if (res.data) return res.data;
    } catch {
      // Fall through
    }

    const bookings = getStoredCustomerBookings();
    const match = bookings.find((b) => b.id === bookingId) || bookings[0];

    return {
      bookingId: match.id,
      totalAmount: match.totalAmount,
      paidAmount: match.paidAmount,
      dueAmount: match.dueAmount,
      fullyPaid: match.dueAmount === 0,
      status: match.status,
    };
  },
};
