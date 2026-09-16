import { useState } from 'react';
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Star, Building2, ShieldCheck } from 'lucide-react';
import { hallsApi } from '@/features/halls/api/halls.api';
import { reviewsApi } from '@/features/reviews/api/reviews.api';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminReviewsPage: FC = () => {
  const [selectedHallId, setSelectedHallId] = useState<string>('');

  // 1. Fetch Platform Halls
  const {
    data: hallsPage,
    isLoading: isLoadingHalls,
    isError: isHallsError,
    error: hallsError,
    refetch: refetchHalls,
  } = useQuery({
    queryKey: ['adminReviewHalls'],
    queryFn: () => hallsApi.getHalls({ size: 50 }),
  });

  const halls = hallsPage?.content || [];
  const activeHallId = selectedHallId || (halls.length > 0 ? halls[0].id : '');

  // 2. Fetch Reviews for Selected Hall
  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    isError: isReviewsError,
    error: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['adminHallReviews', activeHallId],
    queryFn: () => reviewsApi.getHallReviews(activeHallId),
    enabled: Boolean(activeHallId),
  });

  // 3. Fetch Average Rating
  const { data: ratingSummary } = useQuery({
    queryKey: ['adminHallAverageRating', activeHallId],
    queryFn: () => reviewsApi.getAverageRating(activeHallId),
    enabled: Boolean(activeHallId),
  });

  if (isLoadingHalls) {
    return (
      <div className="flex flex-col gap-4 animate-pulse text-left">
        <div className="h-8 w-48 bg-gray-200 rounded-md" />
        <div className="h-32 bg-gray-100 rounded-2xl w-full" />
      </div>
    );
  }

  if (isHallsError) {
    return (
      <ErrorState
        title="Failed to Load Marketplace Venues"
        message={hallsError?.message || 'Unable to retrieve halls catalog.'}
        onRetry={refetchHalls}
      />
    );
  }

  const selectedHall = halls.find((h) => h.id === activeHallId);

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold text-[#222222]">Platform Reviews Governance</h1>
        </div>

        {/* HALL SELECTOR DROPDOWN */}
        {halls.length > 0 && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#717171]" />
            <select
              value={activeHallId}
              onChange={(e) => setSelectedHallId(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#DDDDDD] rounded-xl text-xs font-bold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            >
              {halls.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city || h.location.split(',')[0]})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {halls.length === 0 ? (
        <EmptyState
          title="No Venues in Marketplace Catalog"
          description="Create venue listings to monitor ratings and customer feedback."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* RATING SUMMARY BANNER */}
          {ratingSummary && selectedHall && (
            <div className="p-5 bg-red-50/60 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                  Venue Review Summary
                </span>
                <h2 className="text-lg font-bold text-[#222222]">{selectedHall.name}</h2>
                <span className="text-xs text-[#717171]">{selectedHall.location}</span>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#DDDDDD] shadow-2xs">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-black text-[#222222]">
                      {ratingSummary.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#717171] font-semibold">
                    {ratingSummary.totalReviews} Total Reviews
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS LIST */}
          {isLoadingReviews ? (
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ) : isReviewsError ? (
            <ErrorState
              title="Failed to Load Venue Reviews"
              message={reviewsError?.message || 'Unable to load reviews.'}
              onRetry={refetchReviews}
            />
          ) : reviews.length === 0 ? (
            <EmptyState
              title="No Reviews Submitted Yet"
              description={`No customer reviews have been published for "${selectedHall?.name || 'this hall'}".`}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center border border-red-200">
                        {rev.reviewerName ? rev.reviewerName[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#222222]">
                          {rev.reviewerName || 'Verified Guest'}
                        </span>
                        <span className="text-[10px] text-[#717171]">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString()
                            : 'Verified Reservation'}
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
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-900">
                          {rev.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#222222] leading-relaxed bg-[#F7F7F7] p-3 rounded-xl">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

