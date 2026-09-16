import type { FC } from 'react';
import { DollarSign, CheckCircle2, AlertCircle, Calendar, Building2, ShieldAlert } from 'lucide-react';
import { useVendorDashboard } from '../hooks/useVendorDashboard';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';

export const VendorPaymentsPage: FC = () => {
  const { stats, bookings, isLoadingStats, isLoadingBookings, statsError, refetch } =
    useVendorDashboard();

  if (statsError) {
    return (
      <ErrorState
        title="Failed to Load Financial Summary"
        message={statsError.message || 'Unable to load revenue data.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#FF385C]" />
          <h1 className="text-xl font-bold text-[#222222]">Financials & Payout Overview</h1>
        </div>
      </div>

      {/* REVENUE METRICS CARDS */}
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
              <DollarSign className="w-4 h-4 text-[#FF385C]" /> Total Contract Revenue
            </span>
            <span className="text-2xl font-black text-[#FF385C]">
              {formatCurrency(stats?.totalRevenue || 0)}
            </span>
            <span className="text-[11px] text-[#717171]">Gross value across all bookings</span>
          </div>

          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl shadow-2xs flex flex-col gap-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Total Received Amount
            </span>
            <span className="text-2xl font-black text-emerald-700">
              {formatCurrency(stats?.receivedAmount || 0)}
            </span>
            <span className="text-[11px] text-emerald-800/80">Collected via advances & finals</span>
          </div>

          <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl shadow-2xs flex flex-col gap-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Pending Balance Due
            </span>
            <span className="text-2xl font-black text-amber-700">
              {formatCurrency(stats?.dueAmount || 0)}
            </span>
            <span className="text-[11px] text-amber-800/80">Outstanding customer balances</span>
          </div>
        </div>
      )}

      {/* BACKEND CONTRACT INFORMATION NOTICE */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-3 text-xs text-[#717171]">
        <ShieldAlert className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <strong className="text-[#222222]">Banking & Payout Operations</strong>
          <span>
            Payout settlement occurs directly to your linked business bank account upon event completion. Refund processing or manual payment adjustments are coordinated through account services per platform contract terms.
          </span>
        </div>
      </div>

      {/* BOOKING PAYMENTS TABLE */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#222222] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF385C]" />
          Reservation Ledger & Payment Status
        </h2>

        {isLoadingBookings ? (
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center bg-[#F7F7F7] rounded-2xl border border-[#DDDDDD]">
            <p className="text-xs text-[#717171]">No reservation payment transactions logged yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.map((booking) => {
              const isFullyPaid = booking.dueAmount <= 0;
              const isPartiallyPaid = booking.paidAmount > 0 && booking.dueAmount > 0;

              return (
                <div
                  key={booking.bookingId}
                  className="p-4 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-[#717171]">
                        #{booking.bookingId.substring(0, 8)}
                      </span>
                      <Badge
                        variant={isFullyPaid ? 'success' : isPartiallyPaid ? 'warning' : 'neutral'}
                        size="sm"
                        className="rounded-full"
                      >
                        {isFullyPaid ? 'Fully Paid' : isPartiallyPaid ? 'Advance Paid' : 'Unpaid'}
                      </Badge>
                      <span className="text-xs font-bold text-[#222222]">
                        {booking.eventType}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-[#222222] flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#FF385C]" />
                      {booking.hallName}
                    </span>

                    <span className="text-xs text-[#717171]">
                      Customer: <strong className="text-[#222222]">{booking.customerName}</strong> • Date: <strong>{booking.bookingDate}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#DDDDDD]">
                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] text-[#717171] uppercase font-bold">Total Bill</span>
                      <span className="text-sm font-black text-[#222222]">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                    </div>

                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] text-emerald-700 uppercase font-bold">Paid</span>
                      <span className="text-sm font-black text-emerald-600">
                        {formatCurrency(booking.paidAmount)}
                      </span>
                    </div>

                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] text-amber-800 uppercase font-bold">Due</span>
                      <span className="text-sm font-black text-amber-600">
                        {formatCurrency(booking.dueAmount)}
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

