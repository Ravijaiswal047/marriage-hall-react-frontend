import { apiClient } from '@/lib/api/client';
import type {
  VendorBookingResponseDTO,
  VendorDashboardResponseDTO,
} from '@/types/api';

const DEFAULT_MOCK_BOOKINGS: VendorBookingResponseDTO[] = [
  {
    bookingId: 'bk-101',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    hallName: 'Grand Crystal Palace & Ballroom',
    bookingDate: '2026-10-15',
    slot: 'EVENING',
    eventType: 'Wedding Reception',
    guestCount: 500,
    totalAmount: 150000,
    paidAmount: 75000,
    dueAmount: 75000,
    status: 'CONFIRMED',
  },
  {
    bookingId: 'bk-102',
    customerName: 'Ananya Patel',
    customerPhone: '+91 98123 45678',
    hallName: 'Royal Heritage Lawns & Convention',
    bookingDate: '2026-11-02',
    slot: 'FULL_DAY',
    eventType: 'Sangeet & Reception',
    guestCount: 800,
    totalAmount: 220000,
    paidAmount: 50000,
    dueAmount: 170000,
    status: 'PENDING',
  },
  {
    bookingId: 'bk-103',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 99887 66554',
    hallName: 'Emerald Palms Banquet & Stage',
    bookingDate: '2026-12-01',
    slot: 'MORNING',
    eventType: 'Engagement Ceremony',
    guestCount: 300,
    totalAmount: 95000,
    paidAmount: 95000,
    dueAmount: 0,
    status: 'CONFIRMED',
  },
  {
    bookingId: 'bk-104',
    customerName: 'Pooja Verma',
    customerPhone: '+91 97654 32109',
    hallName: 'Jaipur Royal Palace Banquet',
    bookingDate: '2026-12-20',
    slot: 'EVENING',
    eventType: 'Anniversary Party',
    guestCount: 400,
    totalAmount: 180000,
    paidAmount: 0,
    dueAmount: 180000,
    status: 'CANCELLED',
  },
];

const FALLBACK_BOOKINGS_KEY = 'marriagehall_fallback_vendor_bookings';

const getStoredVendorBookings = (): VendorBookingResponseDTO[] => {
  try {
    const raw = localStorage.getItem(FALLBACK_BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(FALLBACK_BOOKINGS_KEY, JSON.stringify(DEFAULT_MOCK_BOOKINGS));
      return DEFAULT_MOCK_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MOCK_BOOKINGS;
  } catch {
    return DEFAULT_MOCK_BOOKINGS;
  }
};

export const vendorApi = {
  getDashboardStats: async (): Promise<VendorDashboardResponseDTO> => {
    try {
      const res = await apiClient.get<VendorDashboardResponseDTO>(
        '/vendor/dashboard/stats',
        { timeout: 4000 }
      );
      if (res.data) return res.data;
    } catch {
      // Fall through to fallback metrics
    }

    const bookings = getStoredVendorBookings();
    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED');
    const pending = bookings.filter((b) => b.status === 'PENDING');
    const cancelled = bookings.filter((b) => b.status === 'CANCELLED');

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const receivedAmount = bookings.reduce((sum, b) => sum + b.paidAmount, 0);
    const dueAmount = totalRevenue - receivedAmount;

    return {
      totalHalls: 6,
      totalBookings: bookings.length,
      pendingBookings: pending.length,
      confirmedBookings: confirmed.length,
      cancelledBookings: cancelled.length,
      totalRevenue,
      receivedAmount,
      dueAmount,
    };
  },

  getVendorBookings: async (): Promise<VendorBookingResponseDTO[]> => {
    try {
      const res = await apiClient.get<VendorBookingResponseDTO[]>(
        '/vendor/dashboard/bookings',
        { timeout: 4000 }
      );
      if (res.data) return res.data;
    } catch {
      // Fall through to fallback bookings
    }

    return getStoredVendorBookings();
  },
};
