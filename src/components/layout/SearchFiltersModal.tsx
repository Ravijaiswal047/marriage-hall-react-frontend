import type { FC } from 'react';
import { useSearchStore } from '@/store/search.store';
import { toast } from '@/store/ui.store';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { RotateCcw } from 'lucide-react';

export interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchFiltersModal: FC<SearchFiltersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { filters, setFilter, resetFilters } = useSearchStore();

  const handleApply = () => {
    onClose();
    toast.success({
      title: 'Filters Applied',
      message: 'Venue search results updated based on your selected criteria.',
    });
  };

  const handleReset = () => {
    resetFilters();
    toast.info({
      title: 'Filters Cleared',
      message: 'All venue search filters have been reset.',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Filters"
      subtitle="Refine MarriageHall venues by price, capacity, and amenities"
      maxWidth="lg"
    >
      <div className="flex flex-col gap-6 text-left">
        {/* Price Range */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#222222] uppercase tracking-wider">
            Price Range (per day)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Minimum Price (₹)"
              placeholder="e.g. 50000"
              value={filters.minPrice || ''}
              onChange={(e) =>
                setFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <Input
              type="number"
              label="Maximum Price (₹)"
              placeholder="e.g. 500000"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                setFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>

        {/* Capacity & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Minimum Capacity (Guests)"
            placeholder="e.g. 300"
            value={filters.minCapacity || ''}
            onChange={(e) =>
              setFilter(
                'minCapacity',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />

          <Select
            label="Sort Venues By"
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            options={[
              { label: 'Recently Added', value: 'createdAt' },
              { label: 'Price: Low to High', value: 'price' },
              { label: 'Capacity: High to Low', value: 'capacity' },
              { label: 'Venue Name', value: 'name' },
            ]}
          />
        </div>

        {/* Amenities Checkboxes */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#222222] uppercase tracking-wider">
            Key Amenities
          </label>
          <div className="grid grid-cols-2 gap-4 bg-[#F7F7F7] p-4 rounded-xl border border-[#DDDDDD]">
            <label className="flex items-center gap-3 text-xs font-semibold text-[#222222] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(filters.hasAc)}
                onChange={(e) =>
                  setFilter('hasAc', e.target.checked ? true : undefined)
                }
                className="w-4 h-4 rounded border-[#DDDDDD] text-[#FF385C] focus:ring-[#FF385C]"
              />
              Air Conditioning (AC)
            </label>

            <label className="flex items-center gap-3 text-xs font-semibold text-[#222222] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(filters.hasParking)}
                onChange={(e) =>
                  setFilter('hasParking', e.target.checked ? true : undefined)
                }
                className="w-4 h-4 rounded border-[#DDDDDD] text-[#FF385C] focus:ring-[#FF385C]"
              />
              On-site Parking
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#DDDDDD] mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Clear All
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply}>
              Show Venues
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

