import type { FC } from 'react';
import {
  Users,
  Utensils,
  UtensilsCrossed,
  DoorOpen,
  Car,
  Zap,
  Music,
  Wine,
} from 'lucide-react';
import type { Hall } from '@/types/common';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export interface HallOverviewProps {
  hall: Hall;
}

export const HallOverview: FC<HallOverviewProps> = ({ hall }) => {
  return (
    <div className="flex flex-col gap-6 text-left">
      {/* 1. DESCRIPTION */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-[#222222]">About this venue</h2>
        <p className="text-sm text-[#717171] leading-relaxed whitespace-pre-line">
          {hall.description ||
            `${hall.name} is a premier wedding hall located in ${hall.location}. Equipped with modern facilities, spacious dining capacity, and dedicated event support staff to host your dream wedding and celebrations.`}
        </p>
      </div>

      {/* 2. KEY SPECIFICATIONS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* CAPACITY */}
        <Card className="p-3.5 bg-[#F7F7F7] border border-[#DDDDDD] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-[#717171] font-medium">
            <Users className="w-4 h-4 text-[#FF385C]" />
            <span>Seated Capacity</span>
          </div>
          <span className="text-base font-black text-[#222222]">
            {hall.capacity} Guests
          </span>
          {hall.floatingCapacity ? (
            <span className="text-[11px] text-[#717171]">
              ({hall.floatingCapacity} Floating)
            </span>
          ) : null}
        </Card>

        {/* ROOMS */}
        <Card className="p-3.5 bg-[#F7F7F7] border border-[#DDDDDD] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-[#717171] font-medium">
            <DoorOpen className="w-4 h-4 text-[#FF385C]" />
            <span>Guest Rooms</span>
          </div>
          <span className="text-base font-black text-[#222222]">
            {hall.roomsCount ? `${hall.roomsCount} Rooms` : 'Available on Request'}
          </span>
        </Card>

        {/* PARKING */}
        <Card className="p-3.5 bg-[#F7F7F7] border border-[#DDDDDD] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-[#717171] font-medium">
            <Car className="w-4 h-4 text-[#FF385C]" />
            <span>Parking Space</span>
          </div>
          <span className="text-base font-black text-[#222222]">
            {hall.parkingCapacity ? `${hall.parkingCapacity} Vehicles` : hall.hasParking ? 'Dedicated' : 'Street'}
          </span>
        </Card>

        {/* POWER BACKUP */}
        <Card className="p-3.5 bg-[#F7F7F7] border border-[#DDDDDD] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-[#717171] font-medium">
            <Zap className="w-4 h-4 text-[#FF385C]" />
            <span>Power Backup</span>
          </div>
          <span className="text-base font-black text-[#222222]">
            {hall.powerBackup !== false ? '100% Backup' : 'Standard Grid'}
          </span>
        </Card>
      </div>

      {/* 3. FOOD & CATERING PRICING (IF APPLICABLE) */}
      {(hall.vegPricePerPlate || hall.nonVegPricePerPlate) && (
        <div className="p-4 bg-[#FFF0F3]/50 rounded-xl border border-[#FF385C]/20 flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF385C] flex items-center gap-1.5">
            <Utensils className="w-4 h-4" />
            Catering Packages & Plate Pricing
          </h3>
          <div className="flex items-center gap-6 flex-wrap">
            {hall.vegPricePerPlate && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#717171] font-medium">Vegetarian Menu</span>
                  <span className="text-sm font-bold text-[#222222]">
                    {formatCurrency(hall.vegPricePerPlate)}{' '}
                    <span className="text-[11px] font-normal text-[#717171]">/ plate</span>
                  </span>
                </div>
              </div>
            )}

            {hall.nonVegPricePerPlate && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#717171] font-medium">Non-Vegetarian Menu</span>
                  <span className="text-sm font-bold text-[#222222]">
                    {formatCurrency(hall.nonVegPricePerPlate)}{' '}
                    <span className="text-[11px] font-normal text-[#717171]">/ plate</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. VENUE POLICIES & BADGES */}
      <div className="flex flex-col gap-3 pt-2">
        <h3 className="text-sm font-bold text-[#222222]">Venue Policies</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="neutral" size="md">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#717171]" />
            <span>
              {hall.outsideCateringAllowed ? 'Outside Catering Allowed' : 'In-House Catering Only'}
            </span>
          </Badge>
          <Badge variant="neutral" size="md">
            <Music className="w-3.5 h-3.5 text-[#717171]" />
            <span>{hall.djAllowed !== false ? 'DJ & Music Allowed' : 'No DJ Permitted'}</span>
          </Badge>
          <Badge variant="neutral" size="md">
            <Wine className="w-3.5 h-3.5 text-[#717171]" />
            <span>{hall.alcoholAllowed ? 'Alcohol Permitted' : 'No Alcohol Allowed'}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

