import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Car, Wind } from 'lucide-react';
import type { Hall } from '@/types/common';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HallImageCarousel } from './HallImageCarousel';
import { Rating } from './Rating';
import { PriceDisplay } from './PriceDisplay';
import { cn } from '@/lib/utils/cn';

export interface HallCardProps {
  hall: Hall;
  className?: string;
}

export const HallCard: FC<HallCardProps> = ({ hall, className }) => {
  const navigate = useNavigate();

  const images =
    hall.images && hall.images.length > 0
      ? hall.images
      : hall.coverImageUrl
      ? [hall.coverImageUrl]
      : [];

  return (
    <Card
      interactive
      onClick={() => navigate(`/halls/${hall.id}`)}
      className={cn('group h-full flex flex-col', className)}
    >
      {/* COVER IMAGE CAROUSEL WITH OVERLAY BADGES */}
      <HallImageCarousel images={images} alt={hall.name} aspectRatio="video">
        <div className="flex items-center justify-between w-full">
          {/* CITY BADGE */}
          <Badge
            variant="secondary"
            size="sm"
            className="bg-[#222222]/80 backdrop-blur-xs text-white border-none shadow-xs"
          >
            <MapPin className="w-3 h-3 text-[#FF385C]" />
            <span>{hall.city || hall.location.split(',')[0]}</span>
          </Badge>

          {/* WISHLIST BUTTON */}
          <FavoriteButton hallId={hall.id} hallName={hall.name} size="sm" />
        </div>
      </HallImageCarousel>

      {/* CARD CONTENT */}
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-base font-bold text-[#222222] group-hover:text-[#FF385C] transition-colors line-clamp-1 text-left">
            {hall.name}
          </h3>
          <Rating hallId={hall.id} size="sm" showCount={false} />
        </div>

        <p className="text-xs text-[#717171] line-clamp-1 mb-3 text-left">
          {hall.location}
        </p>

        {/* AMENITIES BADGES */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Badge variant="neutral" size="sm">
            <Users className="w-3 h-3 text-[#717171]" />
            <span>{hall.capacity} Guests</span>
          </Badge>
          {hall.hasAc ? (
            <Badge variant="neutral" size="sm">
              <Wind className="w-3 h-3 text-sky-600" />
              <span>AC</span>
            </Badge>
          ) : null}
          {hall.hasParking ? (
            <Badge variant="neutral" size="sm">
              <Car className="w-3 h-3 text-emerald-600" />
              <span>Parking</span>
            </Badge>
          ) : null}
        </div>
      </CardContent>

      {/* CARD FOOTER */}
      <CardFooter className="p-4 border-t border-[#DDDDDD] bg-[#F7F7F7]/60 flex items-center justify-between">
        <PriceDisplay price={hall.price} size="sm" />

        <span className="text-xs font-bold text-[#FF385C] group-hover:underline">
          View Details →
        </span>
      </CardFooter>
    </Card>
  );
};
