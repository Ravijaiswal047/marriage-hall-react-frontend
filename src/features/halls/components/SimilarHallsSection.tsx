import type { FC } from 'react';
import { Building2 } from 'lucide-react';
import { useHallsCatalog } from '../hooks/useHallsCatalog';
import { HallCard } from './HallCard';
import { HallGridSkeleton } from './HallCardSkeleton';
import { cn } from '@/lib/utils/cn';

export interface SimilarHallsSectionProps {
  currentHallId: string;
  city?: string;
  className?: string;
}

export const SimilarHallsSection: FC<SimilarHallsSectionProps> = ({
  currentHallId,
  city,
  className,
}) => {
  const { data: pageData, isLoading } = useHallsCatalog({
    city,
    size: 4,
  });

  const similarHalls = (pageData?.content || []).filter(
    (h) => h.id !== currentHallId
  );

  if (isLoading) {
    return (
      <div className={cn('flex flex-col gap-4 text-left', className)}>
        <h2 className="text-xl font-bold text-[#222222]">Similar Wedding Venues</h2>
        <HallGridSkeleton count={3} />
      </div>
    );
  }

  if (similarHalls.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-4 text-left', className)}>
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-[#FF385C]" />
        <h2 className="text-xl font-bold text-[#222222]">
          Similar Venues in {city || 'this area'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarHalls.slice(0, 3).map((hall) => (
          <HallCard key={hall.id} hall={hall} />
        ))}
      </div>
    </div>
  );
};

