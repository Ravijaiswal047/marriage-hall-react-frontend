import type { FC, MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '@/lib/utils/cn';

export interface FavoriteButtonProps {
  hallId: string;
  hallName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'floating' | 'inline';
  className?: string;
  onToggle?: (isFav: boolean) => void;
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({
  hallId,
  hallName = 'Venue',
  size = 'md',
  variant = 'floating',
  className,
  onToggle,
}) => {
  const { isFavorite, optimisticToggle } = useFavorites();
  const active = isFavorite(hallId);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    optimisticToggle(hallId);
    if (onToggle) {
      onToggle(!active);
    }
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonPadding = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? `Remove ${hallName} from wishlist` : `Save ${hallName} to wishlist`}
      aria-pressed={active}
      title={active ? 'Remove from Wishlist' : 'Save to Wishlist'}
      className={cn(
        'rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF385C]',
        variant === 'floating'
          ? 'bg-white/90 backdrop-blur-xs hover:bg-white text-[#222222] shadow-xs hover:scale-105 active:scale-95 border border-[#DDDDDD]/50'
          : 'hover:bg-[#FFF0F3] text-[#717171] hover:text-[#FF385C]',
        buttonPadding[size],
        className
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-colors duration-200',
          active
            ? 'fill-[#FF385C] text-[#FF385C]'
            : 'text-[#222222] hover:text-[#FF385C]'
        )}
      />
    </button>
  );
};

