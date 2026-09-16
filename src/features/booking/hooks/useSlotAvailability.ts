import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/booking.api';

export function useSlotAvailability(hallId?: string, date?: string) {
  return useQuery({
    queryKey: ['slotAvailability', hallId, date],
    queryFn: () => bookingApi.checkSlotAvailability(hallId!, date!),
    enabled: Boolean(hallId && date),
  });
}

