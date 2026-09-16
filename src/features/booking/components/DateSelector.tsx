import type { FC } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { BookingSlot } from '@/types/common';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils/cn';

export interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedSlot: BookingSlot;
  onSlotChange: (slot: BookingSlot) => void;
  dateError?: string;
  className?: string;
}

const SLOT_OPTIONS = [
  { label: 'Full Day Slot (8:00 AM – 11:00 PM)', value: 'FULL_DAY' },
  { label: 'Morning Slot (8:00 AM – 4:00 PM)', value: 'MORNING' },
  { label: 'Evening Slot (5:00 PM – 11:00 PM)', value: 'EVENING' },
];

export const DateSelector: FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotChange,
  dateError,
  className,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className={cn('flex flex-col gap-4 text-left', className)}>
      {/* EVENT DATE INPUT */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#FF385C]" />
          Select Event Date
        </label>
        <Input
          type="date"
          min={todayStr}
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          error={dateError}
          className="text-xs font-semibold py-2.5"
        />
      </div>

      {/* TIME SLOT SELECT */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#FF385C]" />
          Select Time Slot
        </label>
        <Select
          value={selectedSlot}
          onChange={(e) => onSlotChange(e.target.value as BookingSlot)}
          options={SLOT_OPTIONS}
          className="text-xs py-2.5"
        />
      </div>
    </div>
  );
};

