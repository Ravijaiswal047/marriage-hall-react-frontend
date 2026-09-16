import type { FC } from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';

export interface GuestSelectorProps {
  guestCount: number;
  onGuestCountChange: (count: number) => void;
  maxCapacity?: number;
  error?: string;
  className?: string;
}

export const GuestSelector: FC<GuestSelectorProps> = ({
  guestCount,
  onGuestCountChange,
  maxCapacity,
  error,
  className,
}) => {
  const isOverCapacity = Boolean(maxCapacity && guestCount > maxCapacity);

  return (
    <div className={cn('flex flex-col gap-2 text-left', className)}>
      <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
        <Users className="w-4 h-4 text-[#FF385C]" />
        Expected Guest Count
      </label>

      <Input
        type="number"
        min={1}
        max={maxCapacity ? maxCapacity + 500 : undefined}
        value={guestCount || ''}
        onChange={(e) => onGuestCountChange(Number(e.target.value))}
        error={error}
        placeholder="Enter number of guests..."
        className="text-xs py-2.5"
      />

      {maxCapacity ? (
        <div className="flex items-center justify-between text-[11px] text-[#717171] mt-0.5">
          <span>Venue Seated Capacity: <strong className="text-[#222222]">{maxCapacity} guests</strong></span>
          {isOverCapacity && (
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Exceeds seated capacity!
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
};

