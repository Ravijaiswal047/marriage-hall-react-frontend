import type { FC } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { SpringPage } from '@/types/api';
import type { Hall } from '@/types/common';
import { useSearchStore } from '@/store/search.store';
import { HallCard } from './HallCard';
import { HallGridSkeleton } from './HallCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface HallGridProps {
  pageData?: SpringPage<Hall>;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export const HallGrid: FC<HallGridProps> = ({
  pageData,
  isLoading,
  isError,
  error,
  onRetry,
}) => {
  const { filters, setFilter, resetFilters } = useSearchStore();

  if (isLoading) {
    return <HallGridSkeleton count={filters.size || 12} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Venues"
        message={
          error?.message ||
          'Unable to connect to the MarriageHall catalog service. Please check your network or try again.'
        }
        onRetry={onRetry}
      />
    );
  }

  if (!pageData || pageData.content.length === 0) {
    return (
      <EmptyState
        title="No Matching Venues Found"
        description="We couldn't find any wedding venues matching your criteria. Try adjusting your location, price range, or guest capacity filters."
        actionLabel="Reset All Filters"
        onAction={resetFilters}
      />
    );
  }

  const { content, number: currentPage, totalPages, totalElements, size } = pageData;

  const startCount = currentPage * size + 1;
  const endCount = Math.min((currentPage + 1) * size, totalElements);

  // Generate pagination buttons array (Max 5 page buttons visible)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setFilter('page', newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('size', Number(e.target.value));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* RESULTS HEADER & COUNTER */}
      <div className="flex items-center justify-between text-xs text-[#717171] font-medium border-b border-[#DDDDDD] pb-3">
        <span>
          Showing <strong className="text-[#222222]">{startCount}–{endCount}</strong> of{' '}
          <strong className="text-[#222222]">{totalElements}</strong> available venues
        </span>

        <div className="flex items-center gap-2">
          <span>Show per page:</span>
          <Select
            value={String(size)}
            onChange={handleSizeChange}
            options={[
              { label: '12 per page', value: '12' },
              { label: '24 per page', value: '24' },
              { label: '48 per page', value: '48' },
            ]}
            className="text-xs py-1"
          />
        </div>
      </div>

      {/* HALL CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((hall) => (
          <HallCard key={hall.id} hall={hall} />
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-[#DDDDDD] mt-4">
          <div className="flex items-center gap-1">
            {/* FIRST PAGE */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
              aria-label="First page"
              className="p-1.5 min-w-0"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            {/* PREVIOUS PAGE */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Previous page"
              className="p-1.5 min-w-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* PAGE NUMBERS */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pg) => {
              const isActive = pg === currentPage;
              return (
                <button
                  key={pg}
                  type="button"
                  onClick={() => handlePageChange(pg)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FF385C] text-white shadow-xs'
                      : 'bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]'
                  }`}
                >
                  {pg + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            {/* NEXT PAGE */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Next page"
              className="p-1.5 min-w-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* LAST PAGE */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Last page"
              className="p-1.5 min-w-0"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

