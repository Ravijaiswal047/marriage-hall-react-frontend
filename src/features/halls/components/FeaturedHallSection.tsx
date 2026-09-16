import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useHallsCatalog } from '../hooks/useHallsCatalog';
import { HallCard } from './HallCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants/routes';

export interface FeaturedHallSectionProps {
  title?: string;
  subtitle?: string;
  filterParams?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minCapacity?: number;
    sortBy?: string;
    size?: number;
  };
  badgeText?: string;
}

export const FeaturedHallSection: FC<FeaturedHallSectionProps> = ({
  title = 'Featured Wedding Venues',
  subtitle = 'Top-rated, verified venues ready for instant booking.',
  filterParams = { size: 6, sortBy: 'createdAt' },
  badgeText = 'Handpicked',
}) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useHallsCatalog(filterParams);

  const halls = data?.content || [];

  return (
    <section className="py-12 sm:py-16 text-left border-t border-[#DDDDDD]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            <Sparkles className="w-3 h-3 text-[#FF385C]" />
            <span>{badgeText}</span>
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-[#717171] mt-1">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.HALLS)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF385C] hover:text-[#E31C5F] group"
        >
          <span>Explore All Venues</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* ASYNC LOADING STATE */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full aspect-video rounded-2xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load featured venues"
          message="There was an issue connecting to the Hall Service. Please try again."
          onRetry={refetch}
        />
      ) : halls.length === 0 ? (
        <EmptyState
          title="No venues found"
          description="We couldn't find any venues matching the current criteria in our database."
          actionLabel="Explore All Venues"
          onAction={() => navigate(ROUTES.HALLS)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      )}
    </section>
  );
};

