import type { FC } from 'react';
import {
  DollarSign,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import type { VendorDashboardResponseDTO } from '@/types/api';
import { formatCurrency } from '@/lib/utils/formatters';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export interface VendorMetricsGridProps {
  stats?: VendorDashboardResponseDTO;
  className?: string;
}

export const VendorMetricsGrid: FC<VendorMetricsGridProps> = ({
  stats,
  className,
}) => {
  if (!stats) return null;

  const {
    totalRevenue,
    receivedAmount,
    dueAmount,
    totalHalls,
    totalBookings,
    pendingBookings,
    confirmedBookings,
  } = stats;

  return (
    <div className={cn('flex flex-col gap-4 text-left', className)}>
      {/* 1. FINANCIAL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-[#DDDDDD] flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#717171] font-bold uppercase tracking-wider">
            <span>Total Revenue</span>
            <div className="p-2 rounded-xl bg-[#FFF0F3] text-[#FF385C]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#222222]">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[11px] text-[#717171] flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" /> Gross Booking Value
          </span>
        </Card>

        <Card className="p-4 bg-white border border-[#DDDDDD] flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#717171] font-bold uppercase tracking-wider">
            <span>Received Amount</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-700">
            {formatCurrency(receivedAmount)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            Payments Settled
          </span>
        </Card>

        <Card className="p-4 bg-white border border-[#DDDDDD] flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#717171] font-bold uppercase tracking-wider">
            <span>Due Balance</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-800">
            {formatCurrency(dueAmount)}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">
            Pending Final Settlements
          </span>
        </Card>
      </div>

      {/* 2. OPERATIONAL METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-[#DDDDDD] flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#717171] font-bold uppercase tracking-wider">Listed Venues</span>
            <Building2 className="w-4 h-4 text-[#FF385C]" />
          </div>
          <span className="text-xl font-bold text-[#222222]">{totalHalls}</span>
        </Card>

        <Card className="p-4 bg-white border border-[#DDDDDD] flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#717171] font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-xl font-bold text-[#222222]">{totalBookings}</span>
        </Card>

        <Card className="p-4 bg-white border border-[#DDDDDD] flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#717171] font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl font-bold text-amber-700">{pendingBookings}</span>
        </Card>

        <Card className="p-4 bg-white border border-[#DDDDDD] flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#717171] font-bold uppercase tracking-wider">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl font-bold text-emerald-700">{confirmedBookings}</span>
        </Card>
      </div>
    </div>
  );
};

