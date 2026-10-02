import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews.api';
import { bookingApi } from '@/features/booking/api/booking.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ReviewRequestDTO } from '@/types/api';
import { toast } from '@/store/ui.store';

export function useReviews(hallId?: string) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  // 1. Fetch Hall Reviews List
  const reviewsQuery = useQuery({
    queryKey: ['reviews', hallId],
    queryFn: () => reviewsApi.getHallReviews(hallId!),
    enabled: Boolean(hallId),
  });

  // 2. Fetch Average Rating & Total Review Count
  const averageQuery = useQuery({
    queryKey: ['averageRating', hallId],
    queryFn: () => reviewsApi.getAverageRating(hallId!),
    enabled: Boolean(hallId),
  });

  // 3. Fetch User's Bookings to Check Review Eligibility
  const myBookingsQuery = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingApi.getMyBookings(),
    enabled: isAuthenticated,
  });

  const myBookings = myBookingsQuery.data || [];
  const hasVerifiedBooking = Boolean(
    hallId && myBookings.some((b) => b.hallId === hallId && b.status !== 'CANCELLED')
  );

  // 4. Submit Review Mutation
  const addReviewMutation = useMutation({
    mutationFn: (data: ReviewRequestDTO) => reviewsApi.addReview(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.hallId] });
      queryClient.invalidateQueries({
        queryKey: ['averageRating', data.hallId],
      });
      queryClient.invalidateQueries({ queryKey: ['hallReviews'] });
      queryClient.invalidateQueries({ queryKey: ['adminHallReviews'] });
      toast.success({
        title: 'Review Published!',
        message: 'Thank you for sharing your venue experience.',
      });
    },
    onError: (err: Error) => {
      toast.error({
        title: 'Review Submission Failed',
        message: err.message || 'Could not publish review. Please try again.',
      });
    },
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoadingReviews: reviewsQuery.isLoading,
    isReviewsError: reviewsQuery.isError,
    reviewsError: reviewsQuery.error,

    averageRating: averageQuery.data,
    isLoadingAverage: averageQuery.isLoading,

    isAuthenticated,
    user,
    hasVerifiedBooking,
    isLoadingEligibility: myBookingsQuery.isLoading,

    addReview: addReviewMutation.mutateAsync,
    isSubmittingReview: addReviewMutation.isPending,
    submitError: addReviewMutation.error,
    refetchReviews: reviewsQuery.refetch,
  };
}
