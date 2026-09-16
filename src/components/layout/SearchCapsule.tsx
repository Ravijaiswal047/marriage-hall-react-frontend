import { type FC, useState } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Plus,
  Minus,
} from 'lucide-react';
import { useSearchStore } from '@/store/search.store';
import { Popover } from '../ui/Popover';
import { SearchFiltersModal } from './SearchFiltersModal';
import { cn } from '@/lib/utils/cn';

const POPULAR_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Goa',
  'Jaipur',
  'Chennai',
];

export const SearchCapsule: FC = () => {
  const { filters, setFilter } = useSearchStore();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const selectedCity = filters.city || 'Anywhere';
  const selectedDate = filters.bookingDate || 'Any Date';
  const guestCount = filters.minCapacity || 0;

  return (
    <>
      <div
        role="search"
        aria-label="Search wedding venues"
        className="inline-flex items-center bg-white border border-[#DDDDDD] rounded-full shadow-xs hover:shadow-md transition-all duration-200 divide-x divide-[#DDDDDD] p-1 select-none"
      >
        {/* SECTION 1: LOCATION */}
        <Popover
          align="left"
          trigger={({ isOpen, toggle, ariaProps }) => (
            <button
              type="button"
              onClick={toggle}
              {...ariaProps}
              className={cn(
                'flex flex-col text-left px-4 py-1.5 rounded-full transition-colors',
                isOpen ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]'
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#222222]">
                Location
              </span>
              <span className="text-xs font-semibold text-[#717171] truncate max-w-[110px]">
                {selectedCity}
              </span>
            </button>
          )}
        >
          {({ close }) => (
            <div className="w-64 flex flex-col gap-3 text-left">
              <div className="text-xs font-bold text-[#222222]">
                Select City / Region
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={filters.city || ''}
                  onChange={(e) =>
                    setFilter('city', e.target.value ? e.target.value : undefined)
                  }
                  className="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-[#222222]"
                />
              </div>
              <div className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">
                Popular Destinations
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setFilter('city', city);
                      close();
                    }}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-left transition-colors',
                      filters.city === city
                        ? 'bg-[#FFF0F3] text-[#FF385C]'
                        : 'text-[#222222] hover:bg-[#F7F7F7]'
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#717171]" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Popover>

        {/* SECTION 2: DATES */}
        <Popover
          align="center"
          trigger={({ isOpen, toggle, ariaProps }) => (
            <button
              type="button"
              onClick={toggle}
              {...ariaProps}
              className={cn(
                'flex flex-col text-left px-4 py-1.5 rounded-full transition-colors',
                isOpen ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]'
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#222222]">
                Date
              </span>
              <span className="text-xs font-semibold text-[#717171] truncate max-w-[100px]">
                {selectedDate}
              </span>
            </button>
          )}
        >
          {({ close }) => (
            <div className="w-64 flex flex-col gap-3 text-left">
              <div className="text-xs font-bold text-[#222222]">
                Select Event Date
              </div>
              <input
                type="date"
                value={filters.bookingDate || ''}
                onChange={(e) => {
                  setFilter('bookingDate', e.target.value || undefined);
                  close();
                }}
                className="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-[#222222]"
              />
              <div className="flex items-center justify-between pt-2 border-t border-[#DDDDDD]">
                <button
                  type="button"
                  onClick={() => {
                    setFilter('bookingDate', undefined);
                    close();
                  }}
                  className="text-xs font-semibold text-[#717171] hover:text-[#222222]"
                >
                  Clear Date
                </button>
              </div>
            </div>
          )}
        </Popover>

        {/* SECTION 3: GUESTS */}
        <Popover
          align="right"
          trigger={({ isOpen, toggle, ariaProps }) => (
            <button
              type="button"
              onClick={toggle}
              {...ariaProps}
              className={cn(
                'flex flex-col text-left px-4 py-1.5 rounded-full transition-colors',
                isOpen ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]'
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#222222]">
                Guests
              </span>
              <span className="text-xs font-semibold text-[#717171] truncate max-w-[100px]">
                {guestCount > 0 ? `${guestCount}+ Guests` : 'Add Guests'}
              </span>
            </button>
          )}
        >
          {() => (
            <div className="w-64 flex flex-col gap-3 text-left">
              <div className="text-xs font-bold text-[#222222]">
                Expected Guests Capacity
              </div>
              <div className="flex items-center justify-between bg-[#F7F7F7] p-3 rounded-xl border border-[#DDDDDD]">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#222222]">Guests</span>
                  <span className="text-[11px] text-[#717171]">Minimum capacity</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={guestCount <= 0}
                    onClick={() =>
                      setFilter(
                        'minCapacity',
                        Math.max(0, guestCount - 50) || undefined
                      )
                    }
                    className="w-7 h-7 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#222222] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-[#222222] w-8 text-center">
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFilter('minCapacity', guestCount + 50)}
                    className="w-7 h-7 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#222222] hover:bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Popover>

        {/* SECTION 4: SEARCH BUTTON & FILTERS TRIGGER */}
        <div className="flex items-center gap-1.5 pl-2 pr-1">
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            title="All Filters"
            aria-label="Open filter settings"
            className="p-2 text-[#717171] hover:text-[#222222] rounded-full hover:bg-[#F7F7F7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Search venues"
            className="p-2.5 bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-full transition-all duration-150 shadow-xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <SearchFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </>
  );
};

