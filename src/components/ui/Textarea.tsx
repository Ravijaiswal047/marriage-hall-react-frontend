import {
  type TextareaHTMLAttributes,
  forwardRef,
  useId,
} from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      showCharCount = false,
      className,
      id,
      disabled,
      value,
      defaultValue,
      onChange,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const currentLength =
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
        ? defaultValue.length
        : 0;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <div className="flex items-center justify-between">
          {label ? (
            <label
              htmlFor={textareaId}
              className="text-xs font-semibold text-[#222222] tracking-wide"
            >
              {label}
            </label>
          ) : null}
          {showCharCount && maxLength ? (
            <span className="text-[11px] text-[#717171]">
              {currentLength}/{maxLength}
            </span>
          ) : null}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            'w-full px-3.5 py-2.5 text-sm bg-white text-[#222222] border border-[#DDDDDD] rounded-xl shadow-xs placeholder:text-[#717171] resize-y transition-all duration-150',
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
        />
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

Textarea.displayName = 'Textarea';

