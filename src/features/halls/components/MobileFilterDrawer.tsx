import { useState } from 'react';
import type { FC } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchStore } from '@/store/search.store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HallFilters } from './HallFilters';

export interface MobileFilterDrawerProps {
  className?: string;
}

export const MobileFilterDrawer: FC<MobileFilterDrawerProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { filters } = useSearchStore();

  const activeCount = [
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.minCapacity,
    filters.hasAc,
    filters.hasParking,
  ].filter((val) => val !== undefined && val !== '').length;

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border-[#DDDDDD] text-xs font-semibold py-2"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#FF385C]" />
        <span>Filters</span>
        {activeCount > 0 && (
          <Badge variant="primary" size="sm" className="rounded-full px-1.5 py-0.2">
            {activeCount}
          </Badge>
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#FF385C]" />
            <span>Filter Venues</span>
          </div>
        }
        maxWidth="lg"
      >
        <HallFilters
          className="border-none shadow-none rounded-none p-0"
          onApplyMobile={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};

