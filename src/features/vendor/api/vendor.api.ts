import { apiClient } from '@/lib/api/client';
import type {
  VendorBookingResponseDTO,
  VendorDashboardResponseDTO,
} from '@/types/api';

export const vendorApi = {
  getDashboardStats: async (): Promise<VendorDashboardResponseDTO> => {
    const res = await apiClient.get<VendorDashboardResponseDTO>(
      '/vendor/dashboard/stats'
    );
    return res.data;
  },

  getVendorBookings: async (): Promise<VendorBookingResponseDTO[]> => {
    const res = await apiClient.get<VendorBookingResponseDTO[]>(
      '/vendor/dashboard/bookings'
    );
    return res.data;
  },
};
