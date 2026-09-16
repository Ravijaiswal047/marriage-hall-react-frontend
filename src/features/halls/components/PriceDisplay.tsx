import type { FC } from 'react';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

export interface PriceDisplayProps {
  price: number;
  period?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const PriceDisplay: FC<PriceDisplayProps> = ({
  price,
  period = '/ day',
  size = 'md',
  showLabel = true,
  label = 'Starting from',
  className,
}) => {
  const sizeClasses = {
    sm: {
      label: 'text-[10px]',
      amount: 'text-sm font-bold',
      period: 'text-[10px]',
    },
    md: {
      label: 'text-xs',
      amount: 'text-base font-black',
      period: 'text-xs',
    },
    lg: {
      label: 'text-xs',
      amount: 'text-2xl font-black text-[#FF385C]',
      period: 'text-sm font-normal text-[#717171]',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn('flex flex-col text-left', className)}>
      {showLabel && label && (
        <span className={cn('uppercase tracking-wider font-semibold text-[#717171]', currentSize.label)}>
          {label}
        </span>
      )}
      <div className="flex items-baseline gap-1">
        <span className={cn('text-[#222222]', currentSize.amount)}>
          {formatCurrency(price)}
        </span>
        {period && (
          <span className={cn('text-[#717171] font-normal', currentSize.period)}>
            {period}
          </span>
        )}
      </div>
    </div>
  );
};

