import type { FC } from 'react';
import { Calendar, CheckCircle2, Heart, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export interface CustomerStatsGridProps {
  totalBookings?: number;
  confirmedBookings?: number;
  totalFavorites?: number;
  totalReviews?: number;
  className?: string;
}

export const CustomerStatsGrid: FC<CustomerStatsGridProps> = ({
  totalBookings = 0,
  confirmedBookings = 0,
  totalFavorites = 0,
  totalReviews = 0,
  className,
}) => {
  const stats = [
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'text-[#FF385C]',
      bgColor: 'bg-[#FFF0F3]',
    },
    {
      label: 'Confirmed Events',
      value: confirmedBookings,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Saved Venues',
      value: totalFavorites,
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      label: 'Reviews Posted',
      value: totalReviews,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-4 text-left', className)}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="p-4 bg-white border border-[#DDDDDD] flex flex-col gap-2 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={cn('p-2 rounded-xl shrink-0', stat.bgColor)}>
                <Icon className={cn('w-4 h-4', stat.color)} />
              </div>
            </div>
            <span className="text-2xl font-black text-[#222222]">
              {stat.value}
            </span>
          </Card>
        );
      })}
    </div>
  );
};

