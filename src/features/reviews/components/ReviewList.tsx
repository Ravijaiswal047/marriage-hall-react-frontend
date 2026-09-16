import { useState } from 'react';
import type { FC } from 'react';
import { MessageSquare, Star, ShieldCheck, Plus } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { StarRating } from './StarRating';
import { ReviewFormModal } from './ReviewFormModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export interface ReviewListProps {
  hallId: string;
  hallName?: string;
  className?: string;
}

export const ReviewList: FC<ReviewListProps> = ({
  hallId,
  hallName = 'Venue',
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    reviews,
    isLoadingReviews,
    isReviewsError,
    reviewsError,
    averageRating,
    isLoadingAverage,
    refetchReviews,
  } = useReviews(hallId);

  return (
    <div className={`flex flex-col gap-6 text-left ${className || ''}`}>
      {/* RATING OVERVIEW BANNER */}
      <div className="p-6 bg-white border border-[#DDDDDD] rounded-3xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FFF0F3] text-[#FF385C] rounded-2xl">
            <Star className="w-7 h-7 fill-[#FF385C]" />
          </div>

          <div className="flex flex-col">
            {isLoadingAverage ? (
              <Skeleton className="h-7 w-32 rounded-md" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#222222]">
                  {averageRating?.averageRating ? averageRating.averageRating.toFixed(1) : '0.0'}
                </span>
                <div className="flex flex-col">
                  <StarRating rating={Math.round(averageRating?.averageRating || 0)} readOnly size="sm" />
                  <span className="text-xs text-[#717171] font-semibold">
                    {averageRating?.totalReviews || reviews.length} Total Verified Reviews
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="font-bold text-xs shadow-xs"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Write a Review
        </Button>
      </div>

      {/* REVIEWS LIST SECTION */}
      {isLoadingReviews ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : isReviewsError ? (
        <ErrorState
          title="Failed to Load Venue Reviews"
          message={reviewsError?.message || 'Unable to retrieve reviews for this hall.'}
          onRetry={refetchReviews}
        />
      ) : reviews.length === 0 ? (
        <div className="p-8 text-center bg-[#F7F7F7] rounded-3xl border border-[#DDDDDD] flex flex-col items-center gap-3">
          <div className="p-3 bg-white rounded-full text-[#717171] shadow-2xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#222222]">No Reviews Written Yet</h3>
            <p className="text-xs text-[#717171] max-w-sm">
              Be the first host to share your wedding experience and rate "{hallName}"!
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="font-bold text-xs mt-1"
          >
            Be the First to Review
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-3 transition-shadow hover:shadow-xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FFF0F3] text-[#FF385C] font-bold text-sm flex items-center justify-center border border-[#FF385C]/20 shrink-0">
                    {rev.reviewerName ? rev.reviewerName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#222222]">
                      {rev.reviewerName || 'Verified Guest'}
                    </span>
                    <span className="text-[11px] text-[#717171]">
                      {rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Verified Host'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {rev.isVerifiedBooking && (
                    <Badge
                      variant="success"
                      size="sm"
                      className="rounded-full flex items-center gap-1 text-[10px] font-bold"
                    >
                      <ShieldCheck className="w-3 h-3" /> Verified Booking
                    </Badge>
                  )}
                  <StarRating rating={rev.rating} readOnly size="sm" />
                </div>
              </div>

              <p className="text-xs text-[#222222] leading-relaxed bg-[#F7F7F7] p-3.5 rounded-xl border border-[#DDDDDD]/40">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hallId={hallId}
        hallName={hallName}
      />
    </div>
  );
};
