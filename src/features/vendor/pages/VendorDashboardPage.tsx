import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { useVendorDashboard } from '../hooks/useVendorDashboard';
import { VendorMetricsGrid } from '../components/VendorMetricsGrid';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';

export const VendorDashboardPage: FC = () => {
  const { stats, bookings, isLoadingStats, isLoadingBookings, statsError, refetch } =
    useVendorDashboard();

  const statusVariantMap = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
  } as const;

  if (statsError) {
    return (
      <ErrorState
        title="Failed to Load Vendor Dashboard"
        message={statsError.message || 'Unable to retrieve vendor statistics.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-[#FF385C]" />
          <h1 className="text-xl font-bold text-[#222222]">Vendor Analytics & Dashboard</h1>
        </div>

        <Link to="/vendor/halls/new">
          <Button size="sm" className="text-xs font-bold">
            + Add New Venue
          </Button>
        </Link>
      </div>

      {/* 1. METRICS GRID */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
          <div className="h-28 bg-gray-100 rounded-2xl" />
          <div className="h-28 bg-gray-100 rounded-2xl" />
          <div className="h-28 bg-gray-100 rounded-2xl" />
        </div>
      ) : (
        <VendorMetricsGrid stats={stats} />
      )}

      {/* 2. RECENT BOOKINGS TABLE */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF385C]" />
            <h2 className="text-lg font-bold text-[#222222]">Recent Reservations</h2>
          </div>
          <Link to="/vendor/bookings">
            <Button variant="ghost" size="sm" className="text-xs text-[#FF385C] font-semibold">
              View All ({bookings.length})
            </Button>
          </Link>
        </div>

        {isLoadingBookings ? (
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center bg-[#F7F7F7] rounded-2xl border border-[#DDDDDD] flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-[#717171]" />
            <h3 className="text-sm font-bold text-[#222222]">No Recent Bookings</h3>
            <p className="text-xs text-[#717171] max-w-sm">
              Your venue listings haven't received reservations yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.bookingId}
                className="p-4 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariantMap[booking.status as keyof typeof statusVariantMap] || 'neutral'} size="sm">
                      {booking.status}
                    </Badge>
                    <span className="text-xs font-bold text-[#222222]">
                      {booking.eventType}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#222222] flex items-center gap-1.5 mt-1">
                    <Building2 className="w-4 h-4 text-[#FF385C]" />
                    {booking.hallName}
                  </span>
                  <span className="text-xs text-[#717171]">
                    Host: <strong className="text-[#222222]">{booking.customerName}</strong> ({booking.customerPhone}) • Date: <strong>{booking.bookingDate}</strong> ({booking.slot})
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex flex-col text-left sm:text-right">
                    <span className="text-xs font-black text-[#FF385C]">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Paid: {formatCurrency(booking.paidAmount)}
                    </span>
                  </div>
                  <Link to={`/vendor/bookings/${booking.bookingId}`}>
                    <Button size="sm" variant="outline" className="text-xs font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

