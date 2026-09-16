import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, CheckCircle2, AlertCircle, Calendar, ShieldAlert } from 'lucide-react';
import { vendorApi } from '@/features/vendor/api/vendor.api';
import { formatCurrency } from '@/lib/utils/formatters';
import { StatusBadge } from '../components/StatusBadge';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminPaymentsPage: FC = () => {
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['adminPaymentStats'],
    queryFn: vendorApi.getDashboardStats,
  });

  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['adminPaymentBookings'],
    queryFn: vendorApi.getVendorBookings,
  });

  if (isStatsError) {
    return (
      <ErrorState
        title="Failed to Load Platform Revenue Summary"
        message={statsError?.message || 'Unable to load financial stats.'}
        onRetry={refetchStats}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold text-[#222222]">Platform Financials & Revenue</h1>
        </div>
      </div>

      {/* METRICS CARDS */}
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
              <DollarSign className="w-4 h-4 text-[#FF385C]" /> Platform Gross Revenue
            </span>
            <span className="text-2xl font-black text-[#FF385C]">
              {formatCurrency(stats?.totalRevenue || 0)}
            </span>
            <span className="text-[11px] text-[#717171]">Gross value across all bookings</span>
          </div>

          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl shadow-2xs flex flex-col gap-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Collected Payments
            </span>
            <span className="text-2xl font-black text-emerald-700">
              {formatCurrency(stats?.receivedAmount || 0)}
            </span>
            <span className="text-[11px] text-emerald-800/80">Advances & final balances received</span>
          </div>

          <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl shadow-2xs flex flex-col gap-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Pending Receivables
            </span>
            <span className="text-2xl font-black text-amber-700">
              {formatCurrency(stats?.dueAmount || 0)}
            </span>
            <span className="text-[11px] text-amber-800/80">Outstanding customer balances</span>
          </div>
        </div>
      )}

      {/* BANKING & REFUND NOTICE */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-3 text-xs text-[#717171]">
        <ShieldAlert className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <strong className="text-[#222222]">Banking & Payment Settlement Boundary</strong>
          <span>
            Payment collections are processed directly via `booking-service` advance (`/api/payments/advance`) and final (`/api/payments/final`) controllers. Automated refund management or third-party payment gateway webhooks are administered via platform banking partners.
          </span>
        </div>
      </div>

      {/* BOOKING TRANSACTIONS TABLE */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#222222] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-600" />
          Financial Ledger per Booking
        </h2>

        {isLoadingBookings ? (
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center bg-[#F7F7F7] rounded-2xl border border-[#DDDDDD]">
            <p className="text-xs text-[#717171]">No reservation payment transactions logged yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.map((b) => {
              const isFullyPaid = b.dueAmount <= 0;
              const isPartiallyPaid = b.paidAmount > 0 && b.dueAmount > 0;

              return (
                <div
                  key={b.bookingId}
                  className="p-4 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-[#717171]">
                        #{b.bookingId.substring(0, 8)}
                      </span>
                      <StatusBadge
                        status={isFullyPaid ? 'Fully Paid' : isPartiallyPaid ? 'Advance Paid' : 'Unpaid'}
                        type="payment"
                      />
                      <span className="text-xs font-bold text-[#222222]">{b.hallName}</span>
                    </div>

                    <span className="text-xs text-[#717171]">
                      Customer: <strong className="text-[#222222]">{b.customerName}</strong> ({b.customerPhone}) • Date: <strong>{b.bookingDate}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#DDDDDD]">
                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] text-[#717171] uppercase font-bold">Total Bill</span>
                      <span className="text-sm font-black text-[#222222]">
                        {formatCurrency(b.totalAmount)}
                      </span>
                    </div>

                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] text-emerald-700 uppercase font-bold">Paid</span>
                      <span className="text-sm font-black text-emerald-600">
                        {formatCurrency(b.paidAmount)}
                      </span>
                    </div>

                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] text-amber-800 uppercase font-bold">Due</span>
                      <span className="text-sm font-black text-amber-600">
                        {formatCurrency(b.dueAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

