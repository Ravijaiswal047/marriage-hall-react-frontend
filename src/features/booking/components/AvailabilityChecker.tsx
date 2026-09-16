import type { FC } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { BookingSlot } from '@/types/common';
import { useSlotAvailability } from '../hooks/useSlotAvailability';
import { cn } from '@/lib/utils/cn';

export interface AvailabilityCheckerProps {
  hallId: string;
  date: string;
  selectedSlot: BookingSlot;
  className?: string;
}

export const AvailabilityChecker: FC<AvailabilityCheckerProps> = ({
  hallId,
  date,
  selectedSlot,
  className,
}) => {
  const { data: availability, isLoading, isError } = useSlotAvailability(
    hallId,
    date
  );

  if (!date) {
    return (
      <div className={cn('text-xs text-[#717171] italic', className)}>
        Select an event date to check live venue availability.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#717171]',
          className
        )}
      >
        <Loader2 className="w-4 h-4 animate-spin text-[#FF385C]" />
        <span>Checking real-time venue availability...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          'p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900',
          className
        )}
      >
        Unable to verify slot status with venue calendar. You may still proceed with reservation.
      </div>
    );
  }

  const isSlotBooked =
    availability?.bookedSlots?.includes(selectedSlot) ||
    (availability !== undefined && !availability.available);

  if (isSlotBooked) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700',
          className
        )}
      >
        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
        <span>Selected slot is unavailable for {date}. Please select another date or time slot.</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800',
        className
      )}
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
      <span>Venue slot is available for instant reservation on {date}!</span>
    </div>
  );
};

