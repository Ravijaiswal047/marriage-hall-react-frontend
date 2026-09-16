import { apiClient } from '@/lib/api/client';
import type { PaymentRequestDTO } from '@/types/api';
import type { PaymentEntity } from '@/types/common';

export const paymentsApi = {
  payAdvance: async (
    data: PaymentRequestDTO,
    idempotencyKey: string
  ): Promise<PaymentEntity> => {
    const res = await apiClient.post<PaymentEntity>(
      '/payments/advance',
      data,
      {
        headers: { 'Idempotency-Key': idempotencyKey },
      }
    );
    return res.data;
  },

  payFinal: async (
    data: PaymentRequestDTO,
    idempotencyKey: string
  ): Promise<PaymentEntity> => {
    const res = await apiClient.post<PaymentEntity>('/payments/final', data, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    return res.data;
  },
};

