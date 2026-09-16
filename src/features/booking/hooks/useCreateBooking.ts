import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/booking.api';
import type { BookingRequestDTO } from '@/types/api';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const createBookingMutation = useMutation({
    mutationFn: (data: BookingRequestDTO) => bookingApi.createBooking(data),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({
        queryKey: ['slotAvailability', booking.hallId],
      });
      queryClient.invalidateQueries({
        queryKey: ['bookedDates', booking.hallId],
      });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => bookingApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: string;
    }) => bookingApi.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['vendorBookings'] });
    },
  });

  return {
    createBooking: createBookingMutation.mutateAsync,
    isCreating: createBookingMutation.isPending,
    createError: createBookingMutation.error,

    cancelBooking: cancelBookingMutation.mutateAsync,
    isCancelling: cancelBookingMutation.isPending,

    updateBookingStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}

