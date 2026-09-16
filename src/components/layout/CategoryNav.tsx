/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react';
import {
  Building2,
  Trees,
  Hotel,
  Crown,
  Sun,
  HeartHandshake,
  PartyPopper,
  Home,
  Palmtree,
  Grid,
} from 'lucide-react';
import { useSearchStore } from '@/store/search.store';
import { cn } from '@/lib/utils/cn';

export interface CategoryItem {
  id: string;
  label: string;
  icon: typeof Building2;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All', icon: Grid },
  { id: 'banquet-halls', label: 'Banquet Halls', icon: Building2 },
  { id: 'lawns', label: 'Lawns', icon: Trees },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'luxury-venues', label: 'Luxury Venues', icon: Crown },
  { id: 'rooftop', label: 'Rooftop', icon: Sun },
  { id: 'wedding-halls', label: 'Wedding Halls', icon: HeartHandshake },
  { id: 'party-halls', label: 'Party Halls', icon: PartyPopper },
  { id: 'farmhouses', label: 'Farmhouses', icon: Home },
  { id: 'resorts', label: 'Resorts', icon: Palmtree },
];

export const CategoryNav: FC = () => {
  const { filters, setFilter } = useSearchStore();
  const activeCategory = filters.category || 'all';

  const handleCategorySelect = (categoryId: string) => {
    setFilter('category', categoryId === 'all' ? undefined : categoryId);
  };

  return (
    <div className="w-full bg-white border-b border-[#DDDDDD] py-3 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          role="tablist"
          aria-label="Venue categories"
          className="flex items-center gap-6 overflow-x-auto scrollbar-none py-1 select-none"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="venues-catalog-section"
                onClick={() => handleCategorySelect(cat.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 pb-1 border-b-2 transition-all duration-150 shrink-0 group',
                  isActive
                    ? 'border-[#222222] text-[#222222]'
                    : 'border-transparent text-[#717171] hover:text-[#222222] hover:border-[#DDDDDD]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C] focus-visible:rounded-lg'
                )}
              >
                <Icon
                  className={cn(
                    'w-6 h-6 transition-transform duration-150 group-hover:scale-110',
                    isActive ? 'text-[#FF385C]' : 'text-[#717171] group-hover:text-[#222222]'
                  )}
                />
                <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

