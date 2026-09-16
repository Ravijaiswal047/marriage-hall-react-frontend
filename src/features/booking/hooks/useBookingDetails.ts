import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/booking.api';

export function useBookingDetails(bookingId?: string) {
  const detailsQuery = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getBookingDetails(bookingId!),
    enabled: Boolean(bookingId),
  });

  const summaryQuery = useQuery({
    queryKey: ['bookingSummary', bookingId],
    queryFn: () => bookingApi.getBookingSummary(bookingId!),
    enabled: Boolean(bookingId),
  });

  return {
    details: detailsQuery.data,
    isLoadingDetails: detailsQuery.isLoading,
    detailsError: detailsQuery.error,

    summary: summaryQuery.data,
    isLoadingSummary: summaryQuery.isLoading,
    summaryError: summaryQuery.error,

    refetch: () => {
      detailsQuery.refetch();
      summaryQuery.refetch();
    },
  };
}

