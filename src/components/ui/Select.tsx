import {
  type SelectHTMLAttributes,
  forwardRef,
  useId,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      placeholder,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label ? (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-[#222222] tracking-wide"
          >
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'w-full px-3.5 py-2.5 pr-10 text-sm bg-white text-[#222222] border border-[#DDDDDD] rounded-xl shadow-xs appearance-none transition-all duration-150 cursor-pointer',
              'focus-visible:outline-none focus-visible:border-[#222222] focus-visible:ring-1 focus-visible:ring-[#222222]',
              error
                ? 'border-red-500 text-red-900 focus-visible:border-red-500 focus-visible:ring-red-500'
                : '',
              disabled
                ? 'bg-[#F7F7F7] text-[#717171] cursor-not-allowed border-[#DDDDDD]'
                : '',
              className
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((opt) => (
              <option
                key={String(opt.value)}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 w-4 h-4 text-[#717171] pointer-events-none" />
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

Select.displayName = 'Select';
