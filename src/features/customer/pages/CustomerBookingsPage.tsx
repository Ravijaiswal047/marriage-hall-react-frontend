import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Building2, Clock, Users, ArrowRight, XCircle, Search } from 'lucide-react';
import { useMyBookings } from '@/features/booking/hooks/useMyBookings';
import { useCreateBooking } from '@/features/booking/hooks/useCreateBooking';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils/cn';

export const CustomerBookingsPage: FC = () => {
  const { data: bookings = [], isLoading, isError, error, refetch } = useMyBookings();
  const { cancelBooking, isCancelling } = useCreateBooking();

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  // Filter bookings strictly by actual backend status enums
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    const matchesSearch =
      !searchTerm ||
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingDate?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-10 bg-gray-100 rounded-xl w-full" />
        <div className="h-32 bg-gray-100 rounded-2xl w-full" />
        <div className="h-32 bg-gray-100 rounded-2xl w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Bookings"
        message={error?.message || 'Unable to load customer bookings.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER & SEARCH */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF385C]" />
          <h1 className="text-xl font-bold text-[#222222]">My Venue Bookings</h1>
        </div>

        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search by ID or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[#717171]" />}
            className="text-xs py-1.5"
          />
        </div>
      </div>

      {/* FILTER TABS (ACTUAL BACKEND STATUS ENUMS) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((st) => {
          const isActive = selectedStatus === st;
          const count =
            st === 'ALL'
              ? bookings.length
              : bookings.filter((b) => b.status === st).length;

          return (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5',
                isActive
                  ? 'bg-[#FF385C] text-white border-[#FF385C] shadow-xs'
                  : 'bg-white text-[#717171] border-[#DDDDDD] hover:bg-[#F7F7F7]'
              )}
            >
              <span>{st === 'ALL' ? 'All Bookings' : st}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px]',
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F7F7F7] text-[#222222]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* BOOKINGS LIST */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          description={
            selectedStatus === 'ALL'
              ? "You haven't reserved any wedding halls yet. Browse our marketplace to find your dream venue!"
              : `No bookings currently marked as ${selectedStatus}.`
          }
          actionLabel="Explore Venues"
          onAction={() => window.location.assign('/halls')}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-xs"
            >
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
                      aria-label="Cancel reservation"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                  )}

                  <Link to={`/account/bookings/${booking.id}`}>
                    <Button
                      size="sm"
                      className="text-xs font-bold"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

