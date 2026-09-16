import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/booking.api';

export function useBookedDates(
  hallId?: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ['bookedDates', hallId, startDate, endDate],
    queryFn: () => bookingApi.getBookedDates(hallId!, startDate!, endDate!),
    enabled: Boolean(hallId && startDate && endDate),
  });
}

