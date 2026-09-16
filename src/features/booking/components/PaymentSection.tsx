import { useState } from 'react';
import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { paymentsApi } from '@/features/payments/api/payments.api';
import type { BookingSummaryResponseDTO } from '@/types/api';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export interface PaymentSectionProps {
  summary: BookingSummaryResponseDTO;
  onPaymentSuccess?: () => void;
  className?: string;
}

export const PaymentSection: FC<PaymentSectionProps> = ({
  summary,
  onPaymentSuccess,
  className,
}) => {
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NETBANKING'>('CARD');

  const { bookingId, dueAmount, fullyPaid, paidAmount } = summary;

  // Mutation for advance/final payment with Idempotency-Key
  const paymentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const idempotencyKey = `pay-${bookingId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      // If no payment has been made yet, process advance payment; otherwise final payment
      if (paidAmount === 0) {
        return paymentsApi.payAdvance({ bookingId, amount }, idempotencyKey);
      } else {
        return paymentsApi.payFinal({ bookingId, amount }, idempotencyKey);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingSummary', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      if (onPaymentSuccess) onPaymentSuccess();
    },
  });

  if (fullyPaid || dueAmount <= 0) {
    return (
      <div className={cn('p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-left flex flex-col items-center gap-3 text-center', className)}>
        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-emerald-950">Payment Complete</h3>
        <p className="text-xs text-emerald-800 max-w-sm">
          Your booking is fully paid and confirmed with the venue vendor. No further payment is required.
        </p>
      </div>
    );
  }

  // Calculate suggested advance payment (e.g. 20% or minimum advance) vs full payment
  const paymentAmountToPay = dueAmount;

  const handleProcessPayment = () => {
    paymentMutation.mutate(paymentAmountToPay);
  };

  return (
    <div
      className={cn(
        'p-6 bg-white border border-[#DDDDDD] rounded-2xl shadow-xs flex flex-col gap-5 text-left',
        className
      )}
    >
      <div className="flex items-center justify-between pb-4 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#FF385C]" />
          <h3 className="text-base font-bold text-[#222222]">Secure Payment Gateway</h3>
        </div>
        <span className="text-xs font-bold text-[#FF385C]">
          Amount: {formatCurrency(paymentAmountToPay)}
        </span>
      </div>

      {/* PAYMENT METHOD SELECTOR */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171]">
          Select Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('CARD')}
            className={cn(
              'p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1',
              paymentMethod === 'CARD'
                ? 'bg-[#FFF0F3] border-[#FF385C] text-[#FF385C]'
                : 'bg-white border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]'
            )}
          >
            <CreditCard className="w-4 h-4" />
            <span>Credit/Debit</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('UPI')}
            className={cn(
              'p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1',
              paymentMethod === 'UPI'
                ? 'bg-[#FFF0F3] border-[#FF385C] text-[#FF385C]'
                : 'bg-white border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]'
            )}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>UPI / GPay</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('NETBANKING')}
            className={cn(
              'p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1',
              paymentMethod === 'NETBANKING'
                ? 'bg-[#FFF0F3] border-[#FF385C] text-[#FF385C]'
                : 'bg-white border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]'
            )}
          >
            <Lock className="w-4 h-4" />
            <span>Netbanking</span>
          </button>
        </div>
      </div>

      {/* PAYMENT GATEWAY BOUNDARY NOTICE */}
      <div className="p-3 bg-[#F7F7F7] border border-[#DDDDDD] rounded-xl text-xs text-[#717171] flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-[#FF385C] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-[#222222]">Payment Integration Boundary</span>
          <span className="text-[11px] leading-relaxed">
            Clicking Pay executes direct backend payment settlement with idempotency protection. External payment gateway webhooks (Stripe / Razorpay) process transactions securely via the backend payment microservice.
          </span>
        </div>
      </div>

      {/* MUTATION ERROR ALERT */}
      {paymentMutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {paymentMutation.error?.message || 'Payment transaction failed. Please check details and retry.'}
          </span>
        </div>
      )}

      {/* SUBMIT PAYMENT BUTTON */}
      <Button
        onClick={handleProcessPayment}
        isLoading={paymentMutation.isPending}
        disabled={paymentMutation.isPending}
        className="py-3 text-sm font-bold shadow-md hover:shadow-lg w-full"
        leftIcon={<Lock className="w-4 h-4" />}
      >
        Pay {formatCurrency(paymentAmountToPay)} Now
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#717171]">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>256-bit SSL Encrypted & Protected by Idempotency Key</span>
      </div>
    </div>
  );
};

