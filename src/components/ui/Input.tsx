import {
  type InputHTMLAttributes,
  forwardRef,
  type ReactNode,
  useId,
} from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#222222] tracking-wide"
          >
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center w-full">
          {leftIcon ? (
            <span className="absolute left-3.5 text-[#717171] pointer-events-none flex items-center justify-center shrink-0">
              {leftIcon}
            </span>
          ) : null}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'w-full px-3.5 py-2.5 text-sm bg-white text-[#222222] border border-[#DDDDDD] rounded-xl shadow-xs placeholder:text-[#717171] transition-all duration-150',
              'focus-visible:outline-none focus-visible:border-[#222222] focus-visible:ring-1 focus-visible:ring-[#222222]',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              error
                ? 'border-red-500 text-red-900 focus-visible:border-red-500 focus-visible:ring-red-500'
                : '',
              disabled
                ? 'bg-[#F7F7F7] text-[#717171] cursor-not-allowed border-[#DDDDDD]'
                : '',
              className
            )}
            {...props}
          />
          {rightIcon ? (
            <span className="absolute right-3.5 text-[#717171] flex items-center justify-center shrink-0">
              {rightIcon}
            </span>
          ) : null}
        </div>
        {error ? (
          <span id={errorId} className="text-xs font-medium text-red-600">
            {error}
          </span>
        ) : helperText ? (
          <span id={helperId} className="text-xs text-[#717171]">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
