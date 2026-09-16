import type { FC } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useSearchStore } from '@/store/search.store';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils/cn';

export interface HallSortProps {
  className?: string;
}

const SORT_OPTIONS = [
  { label: 'Newest Additions', value: 'createdAt:desc' },
  { label: 'Price: Low to High', value: 'price:asc' },
  { label: 'Price: High to Low', value: 'price:desc' },
  { label: 'Capacity: Largest First', value: 'capacity:desc' },
  { label: 'Capacity: Small & Intimate', value: 'capacity:asc' },
  { label: 'Name: A to Z', value: 'name:asc' },
];

export const HallSort: FC<HallSortProps> = ({ className }) => {
  const { filters, setFilters } = useSearchStore();

  const currentSortKey = filters.sortBy || 'createdAt';
  const currentDirection = filters.direction || 'desc';
  const currentValue = `${currentSortKey}:${currentDirection}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, direction] = e.target.value.split(':') as [
      string,
      'asc' | 'desc',
    ];
    setFilters({ sortBy, direction });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ArrowUpDown className="w-4 h-4 text-[#717171] shrink-0" />
      <span className="text-xs text-[#717171] font-medium whitespace-nowrap hidden sm:inline">
        Sort by:
      </span>
      <Select
        value={currentValue}
        onChange={handleChange}
        options={SORT_OPTIONS}
        className="text-xs py-1.5 min-w-[170px]"
        aria-label="Sort halls"
      />
    </div>
  );
};

