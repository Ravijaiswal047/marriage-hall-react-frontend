import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline'
    | 'neutral';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  className?: string;
}

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
}) => {
  const variantStyles = {
    primary: 'bg-[#FFF0F3] text-[#FF385C] border-[#FFE0E6]',
    secondary: 'bg-[#222222] text-white border-[#222222]',
    neutral: 'bg-[#F7F7F7] text-[#222222] border-[#DDDDDD]',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    outline: 'bg-transparent text-[#222222] border-[#DDDDDD]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border tracking-tight shrink-0 select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon ? <span className="inline-flex shrink-0">{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
};
