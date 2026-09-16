import type { FC } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, ShieldCheck, AlertCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import { reviewFormSchema, type ReviewFormValues } from '../schemas/review.schema';
import { StarRating } from './StarRating';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  hallId: string;
  hallName?: string;
  onSuccess?: () => void;
}

export const ReviewFormModal: FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  hallId,
  hallName = 'Venue',
  onSuccess,
}) => {
  const {
    isAuthenticated,
    user,
    hasVerifiedBooking,
    addReview,
    isSubmittingReview,
    submitError,
  } = useReviews(hallId);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      hallId,
      rating: 5,
      comment: '',
      reviewerName: user?.name || '',
      reviewerAvatar: user?.avatarUrl || '',
    },
  });

  const commentValue = useWatch({ control, name: 'comment' }) || '';

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      await addReview({
        hallId,
        rating: values.rating,
        comment: values.comment,
        reviewerName: user?.name || values.reviewerName || 'Guest User',
        reviewerAvatar: user?.avatarUrl || values.reviewerAvatar,
      });
      reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      // Error handled by addReview mutation state
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Write a Review for ${hallName}`}
    >
      <div className="flex flex-col gap-4 text-left pt-1">
        {!isAuthenticated ? (
          <div className="p-5 bg-[#FFF0F3] border border-[#FF385C]/20 rounded-2xl flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-white rounded-full text-[#FF385C]">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-[#222222]">Authentication Required</h4>
              <p className="text-xs text-[#717171]">
                Please sign in to write an authentic review for this wedding venue.
              </p>
            </div>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="sm" className="w-full font-bold">
                Log In to Review
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* VERIFIED BOOKING STATUS BADGE */}
            {hasVerifiedBooking ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Host Booking: Your review will feature a Verified Booking badge.</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  No verified reservation logged for this hall on your account. Review will be submitted under standard user feedback.
                </span>
              </div>
            )}

            {/* RATING SELECTION */}
            <div className="flex flex-col gap-1.5 p-4 bg-[#F7F7F7] rounded-2xl border border-[#DDDDDD]">
              <label className="text-xs font-bold text-[#222222]">Your Overall Rating *</label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <StarRating
                    rating={field.value}
                    onChange={field.onChange}
                    size="lg"
                    showLabel
                  />
                )}
              />
              {errors.rating && (
                <span className="text-[11px] font-semibold text-red-600">
                  {errors.rating.message}
                </span>
              )}
            </div>

            {/* COMMENT TEXTAREA */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#222222]">Your Review Feedback *</label>
                <span className="text-[10px] text-[#717171]">
                  {commentValue.length}/2000 chars
                </span>
              </div>

              <Textarea
                rows={4}
                placeholder="Share details of your experience: hall ambiance, lighting, catering, parking, staff behavior..."
                {...register('comment')}
                error={errors.comment?.message}
                className="text-xs"
              />
            </div>

            {/* SUBMISSION ERROR ALERT */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError.message || 'Failed to submit review. Please try again.'}</span>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DDDDDD]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmittingReview}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmittingReview}
                disabled={isSubmittingReview}
                className="font-bold px-6"
                leftIcon={<MessageSquare className="w-4 h-4" />}
              >
                Publish Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
