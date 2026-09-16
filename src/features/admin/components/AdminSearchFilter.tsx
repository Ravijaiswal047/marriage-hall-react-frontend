import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export interface FilterOption {
  value: string;
  label: string;
}

export interface AdminSearchFilterProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  filterOptions?: FilterOption[];
  onFilterChange?: (val: string) => void;
  filterLabel?: string;
  onClearAll?: () => void;
  className?: string;
}

export const AdminSearchFilter: React.FC<AdminSearchFilterProps> = ({
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterValue,
  filterOptions,
  onFilterChange,
  filterLabel = 'Filter',
  onClearAll,
  className,
}) => {
  const hasActiveFilters = Boolean(searchQuery.trim() || (filterValue && filterValue !== 'ALL'));

  return (
    <div className={cn('flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3', className)}>
      {/* SEARCH INPUT */}
      {onSearchChange && (
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            leftIcon={<Search className="w-4 h-4 text-[#717171]" />}
            className="text-xs py-2 pr-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717171] hover:text-[#222222]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* FILTER DROPDOWN & CLEAR */}
      <div className="flex items-center gap-2">
        {filterOptions && onFilterChange && (
          <div className="flex items-center gap-1.5 bg-white border border-[#DDDDDD] rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#717171]" />
            <span className="text-xs font-bold text-[#717171] hidden md:inline">{filterLabel}:</span>
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#222222] focus:outline-none cursor-pointer"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && onClearAll && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearAll}
            className="text-xs font-bold text-[#FF385C] hover:bg-[#FFF0F3]"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

