import type { FC } from 'react';
import {
  Wind,
  Car,
  DoorOpen,
  Zap,
  UtensilsCrossed,
  Music,
  Wine,
  ShieldCheck,
  Sparkles,
  Tv,
} from 'lucide-react';
import type { Hall } from '@/types/common';
import { cn } from '@/lib/utils/cn';

export interface HallAmenitiesProps {
  hall: Hall;
  className?: string;
}

export const HallAmenities: FC<HallAmenitiesProps> = ({ hall, className }) => {
  const amenitiesList = [
    {
      label: 'Air Conditioning (AC)',
      supported: hall.hasAc,
      icon: Wind,
      color: 'text-sky-600',
    },
    {
      label: 'Dedicated Parking',
      supported: hall.hasParking,
      icon: Car,
      color: 'text-emerald-600',
    },
    {
      label: 'Guest Changing Rooms',
      supported: Boolean(hall.roomsCount && hall.roomsCount > 0),
      icon: DoorOpen,
      color: 'text-purple-600',
    },
    {
      label: 'Power Backup',
      supported: hall.powerBackup !== false,
      icon: Zap,
      color: 'text-amber-600',
    },
    {
      label: 'Outside Catering Allowed',
      supported: hall.outsideCateringAllowed,
      icon: UtensilsCrossed,
      color: 'text-[#FF385C]',
    },
    {
      label: 'DJ & Sound System',
      supported: hall.djAllowed !== false,
      icon: Music,
      color: 'text-indigo-600',
    },
    {
      label: 'Bar & Alcohol Service',
      supported: hall.alcoholAllowed,
      icon: Wine,
      color: 'text-rose-600',
    },
    {
      label: 'Decor & Stage Lighting',
      supported: true,
      icon: Sparkles,
      color: 'text-yellow-600',
    },
    {
      label: 'CCTV & Security Staff',
      supported: true,
      icon: ShieldCheck,
      color: 'text-[#222222]',
    },
    {
      label: 'Audio/Visual Setup',
      supported: true,
      icon: Tv,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className={cn('flex flex-col gap-4 text-left', className)}>
      <h2 className="text-xl font-bold text-[#222222]">Amenities & Features</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {amenitiesList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl border transition-all',
                item.supported
                  ? 'bg-white border-[#DDDDDD] text-[#222222]'
                  : 'bg-[#F7F7F7]/50 border-gray-200 text-gray-400 line-through opacity-60'
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-lg shrink-0',
                  item.supported ? 'bg-[#F7F7F7]' : 'bg-gray-100'
                )}
              >
                <Icon className={cn('w-5 h-5', item.supported ? item.color : 'text-gray-400')} />
              </div>
              <span className="text-xs sm:text-sm font-semibold">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

