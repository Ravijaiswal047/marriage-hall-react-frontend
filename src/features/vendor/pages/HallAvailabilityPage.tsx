import { useState } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Building2, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useHallDetails } from '@/features/halls/hooks/useHallDetails';
import { useSlotAvailability } from '@/features/booking/hooks/useSlotAvailability';
import { AvailabilityChecker } from '@/features/booking/components/AvailabilityChecker';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export const HallAvailabilityPage: FC = () => {
  const { hallId } = useParams<{ hallId: string }>();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const { hall, isLoading: isLoadingHall, error: hallError } = useHallDetails(hallId);
  const { data: availability } = useSlotAvailability(hallId, selectedDate);

  if (isLoadingHall) {
    return (
      <div className="flex flex-col gap-6 animate-pulse text-left">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (hallError || !hall) {
    return (
      <ErrorState
        title="Venue Not Found"
        message={hallError?.message || 'Unable to load venue availability calendar.'}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD] flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF385C]" />
            <h1 className="text-xl font-bold text-[#222222]">Availability Calendar: {hall.name}</h1>
          </div>
          <span className="text-xs text-[#717171] flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> {hall.location}
          </span>
        </div>

        <Link to={`/vendor/halls/${hall.id}/edit`}>
          <button type="button" className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1">
            <span>Edit Venue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* DATE SELECTOR & SLOT STATUS CARD */}
      <Card className="p-6 bg-white border border-[#DDDDDD] rounded-2xl shadow-xs flex flex-col gap-5">
        <div className="flex flex-col gap-1.5 max-w-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-[#717171]">
            Inspect Date Availability
          </label>
          <Input
            type="date"
            min={todayStr}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-bold py-2"
          />
        </div>

        {/* BACKEND AVAILABILITY BANNER */}
        <AvailabilityChecker hallId={hall.id} date={selectedDate} selectedSlot="FULL_DAY" />

        {/* SLOT STATUS BREAKDOWN */}
        {availability && (
          <div className="flex flex-col gap-3 pt-3 border-t border-[#DDDDDD]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#717171]">
              Slot Breakdown for {selectedDate}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
              {['FULL_DAY', 'MORNING', 'EVENING'].map((slotKey) => {
                const isBooked = availability.bookedSlots?.includes(
                  slotKey as unknown as (typeof availability.bookedSlots)[number]
                );
                return (
                  <div
                    key={slotKey}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isBooked
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <span>{slotKey.replace('_', ' ')}</span>
                    {isBooked ? (
                      <span className="flex items-center gap-1 text-red-600 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Booked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
