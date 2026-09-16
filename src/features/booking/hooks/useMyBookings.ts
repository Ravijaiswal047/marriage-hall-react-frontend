import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/booking.api';
import { useAuthStore } from '@/store/auth.store';

export function useMyBookings() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['myBookings'],
    queryFn: bookingApi.getMyBookings,
    enabled: isAuthenticated,
  });
}

