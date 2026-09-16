import type { FC } from 'react';
import { Building2, Calendar, Clock, Users, User, FileText, MapPin } from 'lucide-react';
import type { BookingDetailResponseDTO } from '@/types/api';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface BookingSummaryProps {
  details: BookingDetailResponseDTO;
  className?: string;
}

export const BookingSummary: FC<BookingSummaryProps> = ({
  details,
  className,
}) => {
  const { booking, hall } = details;

  const statusVariantMap = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
  } as const;

  const slotLabelMap = {
    FULL_DAY: 'Full Day (8:00 AM – 11:00 PM)',
    MORNING: 'Morning (8:00 AM – 4:00 PM)',
    EVENING: 'Evening (5:00 PM – 11:00 PM)',
  };

  return (
    <div
      className={cn(
        'p-6 bg-white border border-[#DDDDDD] rounded-2xl shadow-xs flex flex-col gap-5 text-left',
        className
      )}
    >
      {/* HEADER & STATUS BADGE */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-[#DDDDDD]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171]">
            Booking Reference
          </span>
          <span className="text-xs font-mono font-bold text-[#222222]">
            {booking.id}
          </span>
        </div>

        <Badge
          variant={statusVariantMap[booking.status] || 'neutral'}
          size="md"
          className="rounded-full px-3 py-1 font-bold"
        >
          {booking.status}
        </Badge>
      </div>

      {/* VENUE INFORMATION */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#FF385C]" />
          Venue Information
        </h4>
        <div className="flex flex-col gap-1 pl-5">
          <span className="text-base font-bold text-[#222222]">{hall.name}</span>
          <span className="text-xs text-[#717171] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
            {hall.location}
          </span>
        </div>
      </div>

      {/* RESERVATION SPECIFICATIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F7F7F7] p-4 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-white text-[#FF385C] border border-[#DDDDDD]">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#717171] font-medium">Event Date</span>
            <span className="text-xs font-bold text-[#222222]">{booking.bookingDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-white text-[#FF385C] border border-[#DDDDDD]">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#717171] font-medium">Time Slot</span>
            <span className="text-xs font-bold text-[#222222]">
              {slotLabelMap[booking.slot] || booking.slot}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-white text-[#FF385C] border border-[#DDDDDD]">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#717171] font-medium">Guest Count</span>
            <span className="text-xs font-bold text-[#222222]">{booking.guestCount} Guests</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-white text-[#FF385C] border border-[#DDDDDD]">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#717171] font-medium">Contact Host</span>
            <span className="text-xs font-bold text-[#222222]">
              {booking.customerName} ({booking.customerPhone})
            </span>
          </div>
        </div>
      </div>

      {/* SPECIAL REQUESTS */}
      {booking.specialRequests && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
          <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold mb-0.5">Special Instructions:</strong>
            <span>{booking.specialRequests}</span>
          </div>
        </div>
      )}
    </div>
  );
};

