import type { FC } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'white' | 'neutral' | 'current';
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({
  size = 'md',
  variant = 'brand',
  className,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  const variantMap = {
    brand: 'border-[#FF385C] border-t-transparent',
    white: 'border-white border-t-transparent',
    neutral: 'border-[#717171] border-t-transparent',
    current: 'border-current border-t-transparent',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full shrink-0',
        sizeMap[size],
        variantMap[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
