import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Building2, Clock, Users, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useVendorDashboard } from '../hooks/useVendorDashboard';
import { bookingApi } from '@/features/booking/api/booking.api';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils/cn';

export const VendorBookingsPage: FC = () => {
  const queryClient = useQueryClient();
  const { bookings, isLoadingBookings, bookingsError, refetch } = useVendorDashboard();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      bookingApi.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorBookings'] });
      queryClient.invalidateQueries({ queryKey: ['vendorDashboardStats'] });
      refetch();
    },
  });

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    if (window.confirm(`Update reservation #${bookingId.substring(0, 8)} status to ${newStatus}?`)) {
      await updateStatusMutation.mutateAsync({ bookingId, status: newStatus });
    }
  };

  const statusVariantMap = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
  } as const;

  const filteredBookings = bookings.filter(
    (b) => selectedStatus === 'ALL' || b.status === selectedStatus
  );

  if (isLoadingBookings) {
    return (
      <div className="flex flex-col gap-4 animate-pulse text-left">
        <div className="h-8 w-48 bg-gray-200 rounded-md" />
        <div className="h-32 bg-gray-100 rounded-2xl w-full" />
      </div>
    );
  }

  if (bookingsError) {
    return (
      <ErrorState
        title="Failed to Load Vendor Bookings"
        message={bookingsError.message || 'Unable to load reservations.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF385C]" />
          <h1 className="text-xl font-bold text-[#222222]">Vendor Reservation Management</h1>
        </div>
      </div>

      {/* FILTER TABS */}
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
              <span>{st === 'ALL' ? 'All Reservations' : st}</span>
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
          title="No Reservations Found"
          description={`No venue bookings currently marked as ${selectedStatus}.`}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-xs"
            >
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-[#717171]">
                    #{booking.bookingId.substring(0, 8)}
                  </span>
                  <Badge
                    variant={statusVariantMap[booking.status as keyof typeof statusVariantMap] || 'neutral'}
                    size="sm"
                    className="rounded-full font-bold"
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
                    {booking.hallName}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#717171] flex-wrap">
                  <span>Host: <strong className="text-[#222222]">{booking.customerName}</strong> ({booking.customerPhone})</span>
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

              {/* FINANCIAL & ACTION BUTTONS */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#DDDDDD]">
                <div className="flex flex-col text-left md:text-right">
                  <span className="text-xs font-black text-[#FF385C]">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Paid: {formatCurrency(booking.paidAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {booking.status === 'PENDING' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(booking.bookingId, 'CONFIRMED')}
                      isLoading={updateStatusMutation.isPending}
                      className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Confirm
                    </Button>
                  )}

                  {booking.status !== 'CANCELLED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(booking.bookingId, 'CANCELLED')}
                      isLoading={updateStatusMutation.isPending}
                      className="text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50"
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Reject
                    </Button>
                  )}

                  <Link to={`/vendor/bookings/${booking.bookingId}`}>
                    <Button size="sm" variant="outline" className="text-xs font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View
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

