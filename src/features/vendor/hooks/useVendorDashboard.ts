import { useQuery } from '@tanstack/react-query';
import { vendorApi } from '../api/vendor.api';
import { useAuthStore } from '@/store/auth.store';

export function useVendorDashboard() {
  const role = useAuthStore((state) => state.role);
  const isVendorOrAdmin = role === 'VENDOR' || role === 'ADMIN';

  const statsQuery = useQuery({
    queryKey: ['vendorDashboardStats'],
    queryFn: vendorApi.getDashboardStats,
    enabled: isVendorOrAdmin,
  });

  const bookingsQuery = useQuery({
    queryKey: ['vendorBookings'],
    queryFn: vendorApi.getVendorBookings,
    enabled: isVendorOrAdmin,
  });

  return {
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    statsError: statsQuery.error,

    bookings: bookingsQuery.data || [],
    isLoadingBookings: bookingsQuery.isLoading,
    bookingsError: bookingsQuery.error,

    refetch: () => {
      statsQuery.refetch();
      bookingsQuery.refetch();
    },
  };
}
