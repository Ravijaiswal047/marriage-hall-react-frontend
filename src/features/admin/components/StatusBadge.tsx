import type { FC } from 'react';
import { Badge } from '@/components/ui/Badge';

export interface StatusBadgeProps {
  status: string;
  type?: 'booking' | 'role' | 'payment' | 'hall';
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, type = 'booking', className }) => {
  const normalized = status.toUpperCase();

  if (type === 'role') {
    const roleVariantMap = {
      ADMIN: 'danger',
      VENDOR: 'warning',
      USER: 'neutral',
    } as const;

    return (
      <Badge
        variant={roleVariantMap[normalized as keyof typeof roleVariantMap] || 'neutral'}
        size="sm"
        className={className}
      >
        {status}
      </Badge>
    );
  }

  if (type === 'payment') {
    const paymentVariantMap = {
      SUCCESS: 'success',
      PAID: 'success',
      ADVANCE: 'warning',
      PENDING: 'warning',
      FAILED: 'danger',
      UNPAID: 'danger',
    } as const;

    return (
      <Badge
        variant={paymentVariantMap[normalized as keyof typeof paymentVariantMap] || 'neutral'}
        size="sm"
        className={className}
      >
        {status}
      </Badge>
    );
  }

  const bookingVariantMap = {
    CONFIRMED: 'success',
    ACTIVE: 'success',
    PENDING: 'warning',
    CANCELLED: 'danger',
    INACTIVE: 'danger',
  } as const;

  return (
    <Badge
      variant={bookingVariantMap[normalized as keyof typeof bookingVariantMap] || 'neutral'}
      size="sm"
      className={className}
    >
      {status}
    </Badge>
  );
};

