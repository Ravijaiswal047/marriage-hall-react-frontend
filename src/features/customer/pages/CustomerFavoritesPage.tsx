import type { FC } from 'react';
import { Heart } from 'lucide-react';
import { useFavoriteHalls } from '@/features/favorites/hooks/useFavorites';
import { HallCard } from '@/features/halls/components/HallCard';
import { HallGridSkeleton } from '@/features/halls/components/HallCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

export const CustomerFavoritesPage: FC = () => {
  const { favoriteHalls, favoriteIds, isLoading } = useFavoriteHalls();

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#FF385C] fill-current" />
          <h1 className="text-xl font-bold text-[#222222]">Saved Wishlist Venues</h1>
        </div>
        <span className="text-xs text-[#717171] font-semibold">
          {favoriteIds.length} saved venues
        </span>
      </div>

      {isLoading ? (
        <HallGridSkeleton count={Math.max(1, favoriteIds.length)} />
      ) : favoriteHalls.length === 0 ? (
        <EmptyState
          title="Your Wishlist is Empty"
          description="Click the heart icon on any wedding hall card to save your favorite venues for quick access!"
          actionLabel="Explore Venues"
          onAction={() => window.location.assign('/halls')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteHalls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      )}
    </div>
  );
};
