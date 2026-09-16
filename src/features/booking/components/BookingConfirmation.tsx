import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Building2, Calendar, Users, DollarSign, ArrowRight, Printer } from 'lucide-react';
import type { BookingDetailResponseDTO, BookingSummaryResponseDTO } from '@/types/api';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface BookingConfirmationProps {
  details: BookingDetailResponseDTO;
  summary?: BookingSummaryResponseDTO;
  className?: string;
}

export const BookingConfirmation: FC<BookingConfirmationProps> = ({
  details,
  summary,
  className,
}) => {
  const { booking, hall } = details;

  const totalAmount = summary?.totalAmount ?? booking.totalAmount ?? hall.price;
  const paidAmount = summary?.paidAmount ?? 0;
  const dueAmount = summary?.dueAmount ?? totalAmount - paidAmount;
  const paymentStatusText = summary?.fullyPaid
    ? 'PAID IN FULL'
    : paidAmount > 0
    ? 'ADVANCE PAID'
    : 'PAYMENT PENDING';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={className}>
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white border border-[#DDDDDD] rounded-3xl shadow-xl flex flex-col gap-6 text-left">
        {/* SUCCESS BADGE & TITLE */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-[#DDDDDD] gap-2">
          <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 shadow-xs mb-1">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-[#717171] max-w-md">
            Your venue reservation request has been created successfully. The venue host has received your booking details.
          </p>
        </div>

        {/* CONFIRMATION METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F7F7] p-4 rounded-2xl border border-[#DDDDDD]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-[#717171]">Booking ID</span>
            <span className="text-xs font-mono font-bold text-[#222222] truncate">
              {booking.id}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-[#717171]">Booking Status</span>
            <div>
              <Badge
                variant={booking.status === 'CONFIRMED' ? 'success' : 'warning'}
                size="sm"
                className="rounded-full"
              >
                {booking.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-[#717171]">Payment Status</span>
            <span className="text-xs font-bold text-emerald-700">
              {paymentStatusText}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-[#717171]">Total Amount</span>
            <span className="text-xs font-black text-[#FF385C]">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* RESERVATION DETAILS TABLE */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#717171]">
            Reservation Breakdown
          </h3>

          <div className="flex flex-col gap-2.5 text-xs text-[#222222] bg-white p-4 rounded-xl border border-[#DDDDDD]">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171] flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-[#FF385C]" /> Venue
              </span>
              <strong className="font-bold">{hall.name} ({hall.location})</strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171] flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#FF385C]" /> Event Date & Slot
              </span>
              <strong className="font-bold">{booking.bookingDate} ({booking.slot})</strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171] flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-[#FF385C]" /> Guests
              </span>
              <strong className="font-bold">{booking.guestCount} Guests</strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171] flex items-center gap-1.5 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Amount Paid
              </span>
              <strong className="font-bold text-emerald-700">{formatCurrency(paidAmount)}</strong>
            </div>

            {dueAmount > 0 && (
              <div className="flex items-center justify-between font-bold text-[#FF385C]">
                <span>Remaining Balance Due</span>
                <span>{formatCurrency(dueAmount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#DDDDDD] flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4 text-[#717171]" />}
            className="text-xs font-semibold"
          >
            Print Receipt
          </Button>

          <Link to="/my-bookings">
            <Button
              size="sm"
              className="text-xs font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View My Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

