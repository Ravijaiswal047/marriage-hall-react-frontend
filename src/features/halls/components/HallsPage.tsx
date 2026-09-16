import type { FC } from 'react';
import { X, Building2 } from 'lucide-react';
import { useSearchStore } from '@/store/search.store';
import { useHallsCatalog } from '../hooks/useHallsCatalog';
import { HallSearch } from './HallSearch';
import { HallSort } from './HallSort';
import { HallFilters } from './HallFilters';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { HallGrid } from './HallGrid';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatters';

export const HallsPage: FC = () => {
  const { filters, setFilter, setFilters, resetFilters } = useSearchStore();
  const { data: pageData, isLoading, isError, error, refetch } =
    useHallsCatalog(filters);

  const activeFilters = [
    filters.city
      ? {
          key: 'city',
          label: `City: ${filters.city}`,
          onRemove: () => setFilter('city', undefined),
        }
      : null,
    filters.minCapacity
      ? {
          key: 'minCapacity',
          label: `Capacity: ${filters.minCapacity}+ Guests`,
          onRemove: () => setFilter('minCapacity', undefined),
        }
      : null,
    filters.minPrice || filters.maxPrice
      ? {
          key: 'price',
          label: `Price: ${
            filters.minPrice ? formatCurrency(filters.minPrice) : '₹0'
          } - ${
            filters.maxPrice ? formatCurrency(filters.maxPrice) : 'Any'
          }`,
          onRemove: () => setFilters({ minPrice: undefined, maxPrice: undefined }),
        }
      : null,
    filters.hasAc
      ? {
          key: 'hasAc',
          label: 'AC Included',
          onRemove: () => setFilter('hasAc', undefined),
        }
      : null,
    filters.hasParking
      ? {
          key: 'hasParking',
          label: 'Parking Included',
          onRemove: () => setFilter('hasParking', undefined),
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="py-6 flex flex-col gap-6 text-left">
      {/* PAGE HEADER & BANNER */}
      <div className="flex flex-col gap-2 pb-4 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#FFF0F3] text-[#FF385C]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
              Explore Wedding Venues
            </h1>
            <p className="text-xs sm:text-sm text-[#717171]">
              Discover banquet halls, lawns, hotels, and luxury venues with live availability & instant booking.
            </p>
          </div>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS BAR */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap bg-[#F7F7F7] p-3 rounded-xl border border-[#DDDDDD]">
          <span className="text-xs font-bold text-[#717171]">Active Filters:</span>
          {activeFilters.map((chip) => (
            <Badge
              key={chip!.key}
              variant="secondary"
              size="sm"
              className="bg-white border border-[#DDDDDD] text-[#222222] flex items-center gap-1.5 py-1 px-2.5 rounded-full shadow-2xs"
            >
              <span>{chip!.label}</span>
              <button
                type="button"
                onClick={chip!.onRemove}
                aria-label={`Remove ${chip!.label} filter`}
                className="hover:text-[#FF385C] p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-[#FF385C] hover:bg-[#FFF0F3] py-1 px-2.5 h-auto font-semibold"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* SEARCH BAR & CONTROLS HEADER */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[260px] max-w-xl">
          <HallSearch />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <MobileFilterDrawer className="lg:hidden" />
          <HallSort />
        </div>
      </div>

      {/* MAIN TWO-COLUMN DISCOVERY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTERS (1 COL) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <HallFilters />
        </div>

        {/* HALL RESULTS GRID (3 COLS) */}
        <main className="col-span-1 lg:col-span-3">
          <HallGrid
            pageData={pageData}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
          />
        </main>
      </div>
    </div>
  );
};

