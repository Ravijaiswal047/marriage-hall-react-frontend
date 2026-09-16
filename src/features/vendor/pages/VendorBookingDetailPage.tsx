import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Building2,
  Clock,
  Users,
  User,
  Phone,
  FileText,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MapPin,
} from 'lucide-react';
import { bookingApi } from '@/features/booking/api/booking.api';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';

export const VendorBookingDetailPage: FC = () => {
  const { bookingId = '' } = useParams<{ bookingId: string }>();
  const queryClient = useQueryClient();

  const {
    data: detail,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['bookingDetail', bookingId],
    queryFn: () => bookingApi.getBookingDetails(bookingId),
    enabled: Boolean(bookingId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      bookingApi.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingDetail', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['vendorBookings'] });
      queryClient.invalidateQueries({ queryKey: ['vendorDashboardStats'] });
    },
  });

  const handleUpdateStatus = async (newStatus: string) => {
    if (
      window.confirm(
        `Are you sure you want to set reservation #${bookingId.substring(0, 8)} status to ${newStatus}?`
      )
    ) {
      await updateStatusMutation.mutateAsync({ status: newStatus });
    }
  };

  const statusVariantMap = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
  } as const;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse text-left">
        <div className="h-8 w-48 bg-gray-200 rounded-md" />
        <div className="h-40 bg-gray-100 rounded-2xl w-full" />
        <div className="h-40 bg-gray-100 rounded-2xl w-full" />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <ErrorState
        title="Reservation Not Found"
        message={error?.message || 'Unable to retrieve reservation details.'}
        onRetry={refetch}
      />
    );
  }

  const { booking, hall } = detail;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD] flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Link to="/vendor/bookings">
            <Button size="sm" variant="outline" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#222222]">
                Reservation #{booking.id.substring(0, 8)}
              </h1>
              <Badge
                variant={
                  statusVariantMap[
                    booking.status as keyof typeof statusVariantMap
                  ] || 'neutral'
                }
                size="sm"
              >
                {booking.status}
              </Badge>
            </div>
            <span className="text-xs text-[#717171]">
              Created on{' '}
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* STATUS ACTIONS */}
        <div className="flex items-center gap-2">
          {booking.status === 'PENDING' && (
            <Button
              size="sm"
              onClick={() => handleUpdateStatus('CONFIRMED')}
              isLoading={updateStatusMutation.isPending}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Booking
            </Button>
          )}

          {booking.status !== 'CANCELLED' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpdateStatus('CANCELLED')}
              isLoading={updateStatusMutation.isPending}
              className="text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50"
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              Reject / Cancel
            </Button>
          )}
        </div>
      </div>

      {/* GRID DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EVENT & HOST DETAILS */}
        <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-4 shadow-2xs">
          <h2 className="text-base font-bold text-[#222222] border-b border-[#DDDDDD] pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF385C]" />
            Customer & Event Details
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[#717171] text-xs">Customer Name:</span>
              <span className="font-bold text-[#222222]">{booking.customerName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#717171] text-xs flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Phone Number:
              </span>
              <a
                href={`tel:${booking.customerPhone}`}
                className="font-bold text-[#FF385C] underline hover:text-[#E31C5F]"
              >
                {booking.customerPhone}
              </a>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#717171] text-xs">Event Type:</span>
              <span className="font-bold text-[#222222]">{booking.eventType}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#717171] text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Date:
              </span>
              <span className="font-bold text-[#222222]">{booking.bookingDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#717171] text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time Slot:
              </span>
              <span className="font-bold text-[#222222]">{booking.slot}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#717171] text-xs flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Guest Capacity:
              </span>
              <span className="font-bold text-[#222222]">
                {booking.guestCount} Guests
              </span>
            </div>

            {booking.specialRequests && (
              <div className="flex flex-col gap-1 pt-2 border-t border-[#DDDDDD]">
                <span className="text-[#717171] text-xs flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Special Requests:
                </span>
                <p className="text-xs text-[#222222] bg-[#F7F7F7] p-2.5 rounded-xl italic">
                  "{booking.specialRequests}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* VENUE & FINANCIAL DETAILS */}
        <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-4 shadow-2xs">
          <h2 className="text-base font-bold text-[#222222] border-b border-[#DDDDDD] pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#FF385C]" />
            Venue & Payment Breakdown
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-start">
              <span className="text-[#717171] text-xs">Hall Name:</span>
              <span className="font-bold text-[#222222] text-right">{hall.name}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-[#717171] text-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Location:
              </span>
              <span className="font-medium text-[#717171] text-right text-xs">
                {hall.location}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#717171] text-xs">Venue Base Rate:</span>
              <span className="font-semibold text-[#222222]">
                {formatCurrency(hall.price)}
              </span>
            </div>

            <div className="pt-3 border-t border-[#DDDDDD] flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#222222] flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-[#FF385C]" /> Total Amount:
                </span>
                <span className="text-base font-black text-[#FF385C]">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

