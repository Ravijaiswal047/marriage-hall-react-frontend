import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Building2 } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { useSearchStore } from '@/store/search.store';
import { SearchFiltersModal } from './SearchFiltersModal';

export const MobileNavbar: FC = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { filters } = useSearchStore();

  const selectedCity = filters.city || 'Anywhere';
  const selectedDate = filters.bookingDate || 'Any Date';
  const capacity = filters.minCapacity ? `${filters.minCapacity}+ Guests` : 'Add Guests';

  return (
    <div className="lg:hidden flex flex-col gap-2 px-4 py-3 bg-white border-b border-[#DDDDDD]">
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-1.5 font-black text-lg text-[#FF385C] tracking-tight"
        >
          <Building2 className="w-5 h-5 text-[#FF385C]" />
          <span>MarriageHall</span>
        </Link>
      </div>

      {/* MOBILE SEARCH TRIGGER PILL */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-white border border-[#DDDDDD] rounded-full shadow-xs hover:shadow-md transition-all text-left"
        >
          <Search className="w-4 h-4 text-[#FF385C] shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-[#222222] truncate">
              {selectedCity}
            </span>
            <span className="text-[10px] text-[#717171] truncate">
              {selectedDate} • {capacity}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          aria-label="Filter settings"
          className="p-2.5 border border-[#DDDDDD] rounded-full text-[#222222] hover:bg-[#F7F7F7] shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      <SearchFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};

