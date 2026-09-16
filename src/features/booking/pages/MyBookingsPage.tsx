import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Building2, Clock, Users, ChevronRight, XCircle } from 'lucide-react';
import { useMyBookings } from '../hooks/useMyBookings';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const MyBookingsPage: FC = () => {
  const { data: bookings, isLoading, isError, error, refetch } = useMyBookings();
  const { cancelBooking, isCancelling } = useCreateBooking();

  const handleCancel = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this venue reservation?')) {
      await cancelBooking(bookingId);
      refetch();
    }
  };

  const statusVariantMap = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
  } as const;

  if (isLoading) {
    return (
      <div className="py-6 flex flex-col gap-6 text-left max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 max-w-md mx-auto px-4">
        <ErrorState
          title="Failed to Load Bookings"
          message={error?.message || 'Unable to retrieve your booking history.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="py-8 max-w-2xl mx-auto px-4">
        <EmptyState
          title="No Venue Reservations Found"
          description="You haven't booked any marriage halls or banquets yet. Explore top venues and plan your dream wedding!"
          actionLabel="Explore Venues"
          onAction={() => window.location.assign('/halls')}
        />
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col gap-6 text-left max-w-5xl mx-auto px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD] flex-wrap gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
            My Venue Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[#717171]">
            Track status, financial statements, and payments for your reserved wedding venues.
          </p>
        </div>

        <Link to="/halls">
          <Button size="sm" variant="outline" className="text-xs font-semibold">
            Book Another Venue
          </Button>
        </Link>
      </div>

      {/* BOOKINGS LIST */}
      <div className="flex flex-col gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md"
          >
            {/* BOOKING INFO */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-[#717171]">
                  #{booking.id.substring(0, 8)}
                </span>
                <Badge
                  variant={statusVariantMap[booking.status] || 'neutral'}
                  size="sm"
                  className="rounded-full"
                >
                  {booking.status}
                </Badge>
                <span className="text-xs text-[#717171] font-medium">
                  {booking.eventType}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FF385C]" />
                <h3 className="text-base font-bold text-[#222222]">
                  {booking.customerName}'s Reservation
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#717171] flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FF385C]" />
                  {booking.bookingDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#FF385C]" />
                  {booking.slot}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#717171]" />
                  {booking.guestCount} Guests
                </span>
              </div>
            </div>

            {/* FINANCIAL & ACTIONS */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#DDDDDD]">
              <div className="flex flex-col text-left md:text-right">
                <span className="text-[10px] uppercase font-bold text-[#717171]">
                  Total Amount
                </span>
                <span className="text-base font-black text-[#FF385C]">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {booking.status !== 'CANCELLED' && (
                  <button
                    type="button"
                    onClick={() => handleCancel(booking.id)}
                    disabled={isCancelling}
                    aria-label="Cancel booking"
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                )}

                <Link to={`/bookings/${booking.id}`}>
                  <Button
                    size="sm"
                    className="text-xs font-bold"
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

