import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { vendorApi } from '@/features/vendor/api/vendor.api';
import { hallsApi } from '@/features/halls/api/halls.api';
import { formatCurrency } from '@/lib/utils/formatters';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminDashboardPage: FC = () => {
  // 1. Fetch Vendor Dashboard Stats (Authorized for ADMIN)
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: vendorApi.getDashboardStats,
  });

  // 2. Fetch Recent Platform Bookings
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
  } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: vendorApi.getVendorBookings,
  });

  // 3. Fetch Halls Summary
  const { data: hallsPage } = useQuery({
    queryKey: ['adminHallsSummary'],
    queryFn: () => hallsApi.getHalls({ size: 1 }),
  });

  if (isStatsError) {
    return (
      <ErrorState
        title="Failed to Load Administrative Dashboard"
        message={statsError?.message || 'Unable to retrieve administrative stats.'}
        onRetry={refetchStats}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold text-[#222222]">Platform Administration Overview</h1>
        </div>
      </div>

      {/* METRICS GRID */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
          <div className="h-28 bg-gray-100 rounded-2xl" />
          <div className="h-28 bg-gray-100 rounded-2xl" />
          <div className="h-28 bg-gray-100 rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-1">
            <span className="text-xs font-bold text-[#717171] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#FF385C]" /> Total Catalog Halls
            </span>
            <span className="text-2xl font-black text-[#222222]">
              {hallsPage?.totalElements ?? stats?.totalHalls ?? 0}
            </span>
            <span className="text-[11px] text-[#717171]">Active marketplace venue listings</span>
          </div>

          <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-1">
            <span className="text-xs font-bold text-[#717171] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" /> Total Reservations
            </span>
            <span className="text-2xl font-black text-[#222222]">
              {stats?.totalBookings || 0}
            </span>
            <span className="text-[11px] text-[#717171]">
              Confirmed: <strong className="text-emerald-700">{stats?.confirmedBookings || 0}</strong> • Pending: <strong className="text-amber-700">{stats?.pendingBookings || 0}</strong>
            </span>
          </div>

          <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-1">
            <span className="text-xs font-bold text-[#717171] uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Total Revenue Handled
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {formatCurrency(stats?.totalRevenue || 0)}
            </span>
            <span className="text-[11px] text-[#717171]">
              Received: <strong>{formatCurrency(stats?.receivedAmount || 0)}</strong>
            </span>
          </div>
        </div>
      )}

      {/* SYSTEM HEALTH & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RECENT BOOKINGS PREVIEW */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#222222] flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              Recent Platform Reservations
            </h2>
            <Link to="/admin/bookings">
              <Button size="sm" variant="ghost" className="text-xs font-bold text-red-600">
                View All ({bookings.length})
              </Button>
            </Link>
          </div>

          {isLoadingBookings ? (
            <div className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          ) : bookings.length === 0 ? (
            <div className="p-6 bg-[#F7F7F7] border border-[#DDDDDD] rounded-2xl text-center text-xs text-[#717171]">
              No booking records retrieved.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {bookings.slice(0, 4).map((b) => (
                <div
                  key={b.bookingId}
                  className="p-4 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#717171] font-bold">
                        #{b.bookingId.substring(0, 8)}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <span className="font-bold text-[#222222]">{b.hallName}</span>
                    <span className="text-[11px] text-[#717171]">
                      Customer: {b.customerName} ({b.customerPhone}) • Date: {b.bookingDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-[#FF385C]">
                      {formatCurrency(b.totalAmount)}
                    </span>
                    <Link to={`/admin/bookings/${b.bookingId}`}>
                      <Button size="sm" variant="outline" className="p-2">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SYSTEM STATUS CARD */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-[#222222] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Infrastructure Status
          </h2>

          <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171]">API Gateway</span>
              <span className="font-bold text-emerald-600">Active (:8081)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171]">Auth Service</span>
              <span className="font-bold text-emerald-600">Active (:9090)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171]">Hall Service</span>
              <span className="font-bold text-emerald-600">Active (:8087)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171]">Booking Service</span>
              <span className="font-bold text-emerald-600">Active (:8082)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#717171]">Review Service</span>
              <span className="font-bold text-emerald-600">Active (:8086)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

