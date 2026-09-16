import { useState } from 'react';
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Building2, Calendar, Plus, Info } from 'lucide-react';
import { bookingApi } from '@/features/booking/api/booking.api';
import { ReviewFormModal } from '@/features/reviews/components/ReviewFormModal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export const CustomerReviewsPage: FC = () => {
  const [selectedHall, setSelectedHall] = useState<{ id: string; name: string } | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingApi.getMyBookings(),
  });

  const validBookings = bookings.filter((b) => b.status !== 'CANCELLED');

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#FF385C]" />
          <h1 className="text-xl font-bold text-[#222222]">My Venue Reviews & Eligibility</h1>
        </div>
      </div>

      {/* BACKEND NOTICE */}
      <div className="p-4 bg-[#FFF0F3] border border-[#FF385C]/20 rounded-2xl flex items-start gap-3 text-xs text-[#222222]">
        <Info className="w-5 h-5 text-[#FF385C] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <strong className="font-bold text-[#FF385C]">Verified Booking Review Eligibility</strong>
          <span>
            Reviews submitted for venues where you hold a confirmed reservation are automatically assigned a <strong>Verified Booking</strong> badge by the review service. Review edit and delete operations are not supported by the backend REST API contract.
          </span>
        </div>
      </div>

      {/* VERIFIED BOOKINGS FOR REVIEW */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#222222]">
          My Reservations Eligible for Verified Feedback ({validBookings.length})
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : validBookings.length === 0 ? (
          <EmptyState
            title="No Verified Reservations Found"
            description="Book a wedding venue first to submit verified reviews and rating feedback."
            actionLabel="Explore Venues"
            onAction={() => window.location.assign('/halls')}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {validBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-[#222222] text-sm flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#FF385C]" />
                    Hall ID: {b.hallId.substring(0, 8)}...
                  </span>
                  <span className="text-[#717171] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#FF385C]" />
                    Event Date: <strong>{b.bookingDate}</strong> ({b.slot}) • {b.eventType}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => setSelectedHall({ id: b.hallId, name: `Venue #${b.hallId.substring(0, 8)}` })}
                  className="text-xs font-bold shrink-0"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Write Verified Review
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REVIEW FORM MODAL */}
      {selectedHall && (
        <ReviewFormModal
          isOpen={Boolean(selectedHall)}
          onClose={() => setSelectedHall(null)}
          hallId={selectedHall.id}
          hallName={selectedHall.name}
        />
      )}
    </div>
  );
};
