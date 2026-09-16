import type { FC } from 'react';
import { Star } from 'lucide-react';
import { useReviews } from '@/features/reviews/hooks/useReviews';
import { cn } from '@/lib/utils/cn';

export interface RatingProps {
  hallId?: string;
  rating?: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export const Rating: FC<RatingProps> = ({
  hallId,
  rating: staticRating,
  totalReviews: staticReviews,
  size = 'sm',
  showCount = true,
  className,
}) => {
  const { averageRating, isLoadingAverage } = useReviews(hallId);

  const displayRating =
    averageRating?.averageRating ?? staticRating ?? (hallId ? 0 : 4.8);
  const displayCount =
    averageRating?.totalReviews ?? staticReviews ?? (hallId ? 0 : 12);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
  };

  if (isLoadingAverage && hallId) {
    return (
      <div className={cn('flex items-center gap-1 text-[#717171] animate-pulse', className)}>
        <Star className={cn(starSizes[size], 'text-gray-300 fill-gray-200')} />
        <span className={cn(textSizes[size], 'bg-gray-200 h-3 w-8 rounded-xs')} />
      </div>
    );
  }

  const formattedRating =
    displayRating > 0 ? displayRating.toFixed(1) : 'New';

  return (
    <div
      className={cn('inline-flex items-center gap-1 text-[#222222]', className)}
    >
      <Star
        className={cn(
          starSizes[size],
          displayRating > 0
            ? 'fill-[#FF385C] text-[#FF385C]'
            : 'fill-gray-200 text-gray-300'
        )}
      />
      <span className={cn('font-bold', textSizes[size])}>{formattedRating}</span>
      {showCount && displayCount > 0 && (
        <span className="text-xs text-[#717171] font-normal">
          ({displayCount})
        </span>
      )}
    </div>
  );
};

