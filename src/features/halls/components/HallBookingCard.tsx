import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CheckCircle2, XCircle, Sparkles, AlertCircle, FileText } from 'lucide-react';
import type { Hall, BookingSlot, EventType } from '@/types/common';
import { useSlotAvailability } from '@/features/booking/hooks/useSlotAvailability';
import { useCreateBooking } from '@/features/booking/hooks/useCreateBooking';
import { useAuthStore } from '@/store/auth.store';
import { PriceDisplay } from './PriceDisplay';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils/cn';
import { formatCurrency } from '@/lib/utils/formatters';

export interface HallBookingCardProps {
  hall: Hall;
  className?: string;
}

const EVENT_TYPE_OPTIONS = [
  { label: 'Wedding Ceremony', value: 'WEDDING' },
  { label: 'Wedding Reception', value: 'RECEPTION' },
  { label: 'Engagement Ceremony', value: 'ENGAGEMENT' },
  { label: 'Sangeet / Mehendi', value: 'SANGEET' },
  { label: 'Birthday Celebration', value: 'BIRTHDAY' },
  { label: 'Corporate Event', value: 'CORPORATE' },
  { label: 'Other Event', value: 'OTHER' },
];

const SLOT_OPTIONS = [
  { label: 'Full Day Slot (8 AM - 11 PM)', value: 'FULL_DAY' },
  { label: 'Morning Slot (8 AM - 4 PM)', value: 'MORNING' },
  { label: 'Evening Slot (5 PM - 11 PM)', value: 'EVENING' },
];

export const HallBookingCard: FC<HallBookingCardProps> = ({ hall, className }) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // State for booking form
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot>('FULL_DAY');
  const [eventType, setEventType] = useState<EventType>('WEDDING');
  const [guestCount, setGuestCount] = useState<number>(hall.capacity);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Real backend slot availability query
  const { data: availability, isLoading: checkingAvailability } =
    useSlotAvailability(hall.id, selectedDate);

  // Real booking mutation
  const { createBooking, isCreating, createError } = useCreateBooking();

  const isSlotBooked =
    availability?.bookedSlots?.includes(selectedSlot) ||
    (availability !== undefined && !availability.available);

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/halls/${hall.id}` } });
      return;
    }

    if (guestCount > hall.capacity + 500) {
      return;
    }

    try {
      const res = await createBooking({
        hallId: hall.id,
        bookingDate: selectedDate,
        slot: selectedSlot,
        eventType,
        guestCount,
        specialRequests: specialRequests.trim() || undefined,
      });

      if (res && res.id) {
        setIsMobileModalOpen(false);
        navigate(`/customer/bookings`);
      }
    } catch {
      // Handled via createError state
    }
  };

  const formContent = (
    <div className="flex flex-col gap-4 text-left">
      {/* PRICE HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDDDDD]">
        <PriceDisplay price={hall.price} size="lg" />
        <div className="flex flex-col items-end">
          <span className="text-xs text-[#717171] font-medium">Capacity</span>
          <span className="text-xs font-bold text-[#222222]">
            Up to {hall.capacity} guests
          </span>
        </div>
      </div>

      {/* 1. DATE SELECTOR */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#FF385C]" />
          Event Date
        </label>
        <Input
          type="date"
          min={todayStr}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="text-xs font-semibold py-2"
        />
      </div>

      {/* AVAILABILITY BADGE */}
      {selectedDate && (
        <div className="text-xs">
          {checkingAvailability ? (
            <span className="text-[#717171] animate-pulse">Checking date availability...</span>
          ) : isSlotBooked ? (
            <div className="flex items-center gap-1.5 text-red-600 bg-red-50 p-2 rounded-lg font-semibold border border-red-200">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Selected slot is already booked for this date.</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-2 rounded-lg font-semibold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Venue slot is available for instant booking!</span>
            </div>
          )}
        </div>
      )}

      {/* 2. TIME SLOT SELECTOR */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171]">
          Time Slot
        </label>
        <Select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value as BookingSlot)}
          options={SLOT_OPTIONS}
          className="text-xs py-2"
        />
      </div>

      {/* 3. EVENT TYPE */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171]">
          Event Type
        </label>
        <Select
          value={eventType}
          onChange={(e) => setEventType(e.target.value as EventType)}
          options={EVENT_TYPE_OPTIONS}
          className="text-xs py-2"
        />
      </div>

      {/* 4. GUEST COUNT */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#FF385C]" />
          Expected Guests
        </label>
        <Input
          type="number"
          min={1}
          max={hall.capacity + 500}
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className="text-xs py-2"
        />
        {guestCount > hall.capacity && (
          <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Exceeds seated capacity of {hall.capacity}.
          </span>
        )}
      </div>

      {/* 5. SPECIAL REQUESTS */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#717171]" />
          Special Requests / Notes (Optional)
        </label>
        <Textarea
          rows={2}
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Catering choices, stage preferences, arrival time..."
          className="text-xs"
        />
      </div>

      {/* PRICE BREAKDOWN CALCULATION */}
      <div className="flex flex-col gap-2 pt-3 border-t border-[#DDDDDD] bg-[#F7F7F7] p-3 rounded-xl">
        <div className="flex justify-between text-xs text-[#717171]">
          <span>Hall Daily Rent</span>
          <span>{formatCurrency(hall.price)}</span>
        </div>
        <div className="flex justify-between text-xs text-[#717171]">
          <span>Service & Maintenance</span>
          <span>Included</span>
        </div>
        <div className="flex justify-between text-sm font-black text-[#222222] pt-2 border-t border-[#DDDDDD]">
          <span>Total Estimated Price</span>
          <span className="text-[#FF385C]">{formatCurrency(hall.price)}</span>
        </div>
      </div>

      {/* BOOKING ERROR ALERT */}
      {createError && (
        <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
          {createError.message || 'Failed to submit booking request. Please try again.'}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <Button
        onClick={handleReserve}
        disabled={isSlotBooked || isCreating || checkingAvailability}
        isLoading={isCreating}
        className="py-3 text-sm font-bold shadow-md hover:shadow-lg w-full"
        leftIcon={<Sparkles className="w-4 h-4" />}
      >
        {!isAuthenticated
          ? 'Log In to Book'
          : isSlotBooked
          ? 'Slot Unavailable'
          : 'Instant Reserve'}
      </Button>

      <p className="text-[11px] text-[#717171] text-center">
        You won't be charged yet. Instant confirmation from vendor.
      </p>
    </div>
  );

  return (
    <>
      {/* 1. STICKY DESKTOP CARD */}
      <aside
        className={cn(
          'hidden lg:block p-6 bg-white border border-[#DDDDDD] rounded-2xl shadow-xl sticky top-24',
          className
        )}
      >
        {formContent}
      </aside>

      {/* 2. MOBILE PERSISTENT BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DDDDDD] p-3 sm:p-4 shadow-2xl backdrop-blur-md bg-white/95 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-black text-[#222222]">
            {formatCurrency(hall.price)}
          </span>
          <span className="text-[11px] text-[#717171] font-medium">per day</span>
        </div>

        <Button
          onClick={() => setIsMobileModalOpen(true)}
          className="px-6 py-2.5 text-xs font-bold"
        >
          Check Availability
        </Button>
      </div>

      {/* 3. MOBILE BOOKING MODAL */}
      <Modal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        title="Reserve Venue"
        maxWidth="md"
      >
        {formContent}
      </Modal>
    </>
  );
};

