import type { FC } from 'react';
import type { BookingSummaryResponseDTO } from '@/types/api';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface PriceBreakdownProps {
  summary: BookingSummaryResponseDTO;
  className?: string;
}

export const PriceBreakdown: FC<PriceBreakdownProps> = ({
  summary,
  className,
}) => {
  const { totalAmount, paidAmount, dueAmount, fullyPaid, status } = summary;

  return (
    <div
      className={cn(
        'p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-xs flex flex-col gap-4 text-left',
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <h3 className="text-base font-bold text-[#222222]">Financial Breakdown</h3>
        <Badge
          variant={fullyPaid ? 'success' : 'warning'}
          size="sm"
          className="rounded-full px-2.5"
        >
          {fullyPaid ? 'Fully Paid' : 'Payment Due'}
        </Badge>
      </div>

      <div className="flex flex-col gap-2.5 text-xs text-[#717171]">
        {/* TOTAL AMOUNT (AUTHORITATIVE BACKEND VALUE) */}
        <div className="flex items-center justify-between font-semibold">
          <span>Total Venue Amount</span>
          <span className="text-[#222222] font-bold">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        {/* PAID AMOUNT */}
        <div className="flex items-center justify-between font-semibold">
          <span>Advance Paid Amount</span>
          <span className="text-emerald-700 font-bold">
            {formatCurrency(paidAmount)}
          </span>
        </div>

        {/* DUE AMOUNT */}
        <div className="flex items-center justify-between font-bold pt-2 border-t border-[#DDDDDD] text-sm">
          <span className="text-[#222222]">Remaining Due Balance</span>
          <span className={cn(dueAmount > 0 ? 'text-[#FF385C]' : 'text-emerald-600')}>
            {formatCurrency(dueAmount)}
          </span>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-[#717171] bg-[#F7F7F7] p-2.5 rounded-xl flex items-center justify-between">
        <span>Booking Status: <strong className="text-[#222222]">{status}</strong></span>
        <span>Authoritative Backend Valuation</span>
      </div>
    </div>
  );
};

