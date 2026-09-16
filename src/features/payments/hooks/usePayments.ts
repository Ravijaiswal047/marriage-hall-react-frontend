import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments.api';
import type { PaymentRequestDTO } from '@/types/api';

export function usePayments() {
  const queryClient = useQueryClient();

  const payAdvanceMutation = useMutation({
    mutationFn: ({
      data,
      idempotencyKey,
    }: {
      data: PaymentRequestDTO;
      idempotencyKey: string;
    }) => paymentsApi.payAdvance(data, idempotencyKey),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({
        queryKey: ['bookingDetails', payment.bookingId],
      });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });

  const payFinalMutation = useMutation({
    mutationFn: ({
      data,
      idempotencyKey,
    }: {
      data: PaymentRequestDTO;
      idempotencyKey: string;
    }) => paymentsApi.payFinal(data, idempotencyKey),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({
        queryKey: ['bookingDetails', payment.bookingId],
      });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });

  return {
    payAdvance: payAdvanceMutation.mutateAsync,
    isPayingAdvance: payAdvanceMutation.isPending,
    advanceError: payAdvanceMutation.error,

    payFinal: payFinalMutation.mutateAsync,
    isPayingFinal: payFinalMutation.isPending,
    finalError: payFinalMutation.error,
  };
}

