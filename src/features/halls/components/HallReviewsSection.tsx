import type { FC } from 'react';
import { ReviewList } from '@/features/reviews/components/ReviewList';

export interface HallReviewsSectionProps {
  hallId: string;
  className?: string;
}

export const HallReviewsSection: FC<HallReviewsSectionProps> = ({
  hallId,
  className,
}) => {
  return (
    <div className={className}>
      <ReviewList hallId={hallId} />
    </div>
  );
};
