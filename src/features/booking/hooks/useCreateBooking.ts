import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/booking.api';
import type { BookingRequestDTO } from '@/types/api';
import { toast } from '@/store/ui.store';

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
      toast.success({
        title: 'Booking Request Submitted!',
        message: 'The venue host will review and confirm your reservation.',
        action: {
          label: 'View My Bookings',
          onClick: () => {
            window.location.href = '/my-bookings';
          },
        },
      });
    },
    onError: (err: Error) => {
      toast.error({
        title: 'Booking Failed',
        message: err.message || 'Unable to submit reservation request. Please try again.',
      });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => bookingApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      toast.info({
        title: 'Booking Cancelled',
        message: 'Your reservation request has been cancelled.',
      });
    },
    onError: (err: Error) => {
      toast.error({
        title: 'Cancellation Error',
        message: err.message || 'Could not cancel booking request.',
      });
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
      toast.success({
        title: 'Booking Status Updated',
        message: 'The reservation status has been updated successfully.',
      });
    },
    onError: (err: Error) => {
      toast.error({
        title: 'Update Failed',
        message: err.message || 'Unable to update booking status.',
      });
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

