import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Spinner } from './Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'brand-light';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none';

    const variantStyles = {
      primary:
        'bg-[#FF385C] text-white hover:bg-[#E31C5F] shadow-sm hover:shadow-md',
      secondary:
        'bg-[#222222] text-white hover:bg-black shadow-sm hover:shadow-md',
      outline:
        'border border-[#DDDDDD] bg-white text-[#222222] hover:bg-[#F7F7F7] hover:border-[#222222]',
      ghost: 'text-[#222222] hover:bg-[#F7F7F7]',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      'brand-light':
        'bg-[#FFF0F3] text-[#FF385C] hover:bg-[#FFE0E6] hover:text-[#E31C5F]',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Spinner
            size={size === 'lg' ? 'md' : 'sm'}
            variant={
              variant === 'primary' || variant === 'secondary' || variant === 'danger'
                ? 'white'
                : 'brand'
            }
          />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!isLoading && rightIcon ? (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
