import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface StarRatingProps {
  rating: number; // 0 to 5
  onChange?: (newRating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  readOnly = false,
  size = 'md',
  className,
  showLabel = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (readOnly || !onChange) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(5, (rating || 0) + 1);
      onChange(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(1, (rating || 1) - 1);
      onChange(prev);
    } else if (e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      onChange(Number(e.key));
    }
  };

  return (
    <div
      className={cn('inline-flex items-center gap-1 select-none', className)}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? `Rating: ${rating} out of 5 stars` : 'Select venue rating'}
      tabIndex={readOnly ? undefined : 0}
      onKeyDown={handleKeyDown}
    >
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= currentDisplayRating;

        if (readOnly) {
          return (
            <Star
              key={starValue}
              className={cn(
                starSizes[size],
                isFilled ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-100'
              )}
            />
          );
        }

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={rating === starValue}
            aria-label={`${starValue} Star${starValue > 1 ? 's' : ''}`}
            onClick={() => onChange && onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(null)}
            className="p-0.5 focus:outline-none focus:scale-110 transition-transform cursor-pointer"
          >
            <Star
              className={cn(
                starSizes[size],
                'transition-colors duration-150',
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-2xs'
                  : 'text-gray-300 hover:text-amber-300 fill-gray-100'
              )}
            />
          </button>
        );
      })}

      {showLabel && (
        <span className="ml-1.5 text-xs font-bold text-[#222222]">
          {currentDisplayRating > 0 ? `${currentDisplayRating}.0` : 'Select rating'}
        </span>
      )}
    </div>
  );
};

