import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '@/store/search.store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface HallSearchProps {
  placeholder?: string;
  className?: string;
}

export const HallSearch: FC<HallSearchProps> = ({
  placeholder = 'Search by city, venue name, or address...',
  className,
}) => {
  const { filters, setFilter } = useSearchStore();
  const [searchTerm, setSearchTerm] = useState(filters.city || '');

  useEffect(() => {
    setSearchTerm(filters.city || '');
  }, [filters.city]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFilter('city', searchTerm.trim() ? searchTerm.trim() : undefined);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilter('city', undefined);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex items-center w-full">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            const val = e.target.value;
            setSearchTerm(val);
            if (!val.trim()) {
              setFilter('city', undefined);
            }
          }}
          placeholder={placeholder}
          leftIcon={<Search className="w-4 h-4 text-[#717171]" />}
          rightIcon={
            searchTerm || filters.city ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="text-[#717171] hover:text-[#222222] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            ) : undefined
          }
          className="pr-20"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1 bottom-1 h-auto py-1 px-4 text-xs font-semibold"
        >
          Search
        </Button>
      </div>
    </form>
  );
};
