import type { FC } from 'react';
import { Filter, RotateCcw, MapPin, DollarSign, Users, Wind, Car } from 'lucide-react';
import { useSearchStore } from '@/store/search.store';
import { useCities } from '../hooks/useCities';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface HallFiltersProps {
  className?: string;
  onApplyMobile?: () => void;
}

const CAPACITY_PRESETS = [
  { label: 'Any Capacity', value: undefined },
  { label: '100+ Guests', value: 100 },
  { label: '250+ Guests', value: 250 },
  { label: '500+ Guests', value: 500 },
  { label: '1,000+ Guests', value: 1000 },
];

const PRICE_PRESETS = [
  { label: 'Any Price', min: undefined, max: undefined },
  { label: 'Under ₹50k', min: undefined, max: 50000 },
  { label: '₹50k - ₹1.5L', min: 50000, max: 150000 },
  { label: '₹1.5L - ₹3L', min: 150000, max: 300000 },
  { label: 'Above ₹3L', min: 300000, max: undefined },
];

export const HallFilters: FC<HallFiltersProps> = ({
  className,
  onApplyMobile,
}) => {
  const { filters, setFilter, setFilters, resetFilters } = useSearchStore();
  const { data: cities = [], isLoading: isLoadingCities } = useCities();

  const cityOptions = [
    { label: 'All Cities', value: '' },
    ...cities.map((city: string) => ({ label: city, value: city })),
  ];

  const activeCount = [
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.minCapacity,
    filters.hasAc,
    filters.hasParking,
  ].filter((val) => val !== undefined && val !== '').length;

  return (
    <aside
      className={cn(
        'flex flex-col gap-6 p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-xs text-left',
        className
      )}
    >
      {/* FILTER HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF385C]" />
          <h2 className="text-base font-bold text-[#222222]">Filters</h2>
          {activeCount > 0 && (
            <Badge variant="primary" size="sm" className="rounded-full px-2 py-0.5">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-[#FF385C] hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* 1. CITY FILTER */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
          City Location
        </label>
        <Select
          value={filters.city || ''}
          onChange={(e) => setFilter('city', e.target.value || undefined)}
          options={cityOptions}
          disabled={isLoadingCities}
          placeholder={isLoadingCities ? 'Loading cities...' : 'Select City'}
          className="text-xs py-2"
        />
      </div>

      {/* 2. GUEST CAPACITY FILTER */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#FF385C]" />
          Guest Capacity
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CAPACITY_PRESETS.slice(1).map((preset) => {
            const isSelected = filters.minCapacity === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  setFilter(
                    'minCapacity',
                    isSelected ? undefined : preset.value
                  )
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border text-center',
                  isSelected
                    ? 'bg-[#FF385C] text-white border-[#FF385C] shadow-xs'
                    : 'bg-[#F7F7F7] text-[#222222] border-[#DDDDDD] hover:border-gray-400'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="mt-1">
          <Input
            type="number"
            placeholder="Custom Min Capacity"
            value={filters.minCapacity || ''}
            onChange={(e) =>
              setFilter(
                'minCapacity',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="text-xs py-1.5"
          />
        </div>
      </div>

      {/* 3. PRICE RANGE FILTER */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-[#FF385C]" />
          Daily Price (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) =>
              setFilter(
                'minPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="text-xs py-1.5"
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              setFilter(
                'maxPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="text-xs py-1.5"
          />
        </div>

        {/* QUICK PRICE RANGE CHIPS */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {PRICE_PRESETS.slice(1).map((preset) => {
            const isSelected =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  isSelected
                    ? setFilters({ minPrice: undefined, maxPrice: undefined })
                    : setFilters({ minPrice: preset.min, maxPrice: preset.max })
                }
                className={cn(
                  'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                  isSelected
                    ? 'bg-[#222222] text-white border-[#222222]'
                    : 'bg-white text-[#717171] border-[#DDDDDD] hover:border-gray-400'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. AMENITIES TOGGLES */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#DDDDDD]">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171]">
          Required Amenities
        </label>

        {/* AC TOGGLE */}
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#222222]">
            <Wind className="w-4 h-4 text-sky-600" />
            <span>Air Conditioned (AC)</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.hasAc)}
            onChange={(e) => setFilter('hasAc', e.target.checked || undefined)}
            className="w-4 h-4 rounded-xs text-[#FF385C] focus:ring-[#FF385C] border-[#DDDDDD] cursor-pointer"
          />
        </label>

        {/* PARKING TOGGLE */}
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#222222]">
            <Car className="w-4 h-4 text-emerald-600" />
            <span>Dedicated Parking</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.hasParking)}
            onChange={(e) =>
              setFilter('hasParking', e.target.checked || undefined)
            }
            className="w-4 h-4 rounded-xs text-[#FF385C] focus:ring-[#FF385C] border-[#DDDDDD] cursor-pointer"
          />
        </label>
      </div>

      {/* MOBILE APPLY BUTTON */}
      {onApplyMobile && (
        <div className="pt-4 border-t border-[#DDDDDD] lg:hidden">
          <Button onClick={onApplyMobile} className="w-full py-2.5">
            Show Filtered Venues
          </Button>
        </div>
      )}
    </aside>
  );
};

