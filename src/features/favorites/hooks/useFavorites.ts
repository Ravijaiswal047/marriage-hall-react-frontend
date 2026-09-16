import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useQueries } from '@tanstack/react-query';
import { hallsApi } from '@/features/halls/api/halls.api';
import type { Hall } from '@/types/common';

interface FavoritesState {
  favoriteIds: string[];
  addFavorite: (hallId: string) => void;
  removeFavorite: (hallId: string) => void;
  toggleFavorite: (hallId: string) => boolean; // returns new isFavorite state
  setFavoriteIds: (ids: string[]) => void;
  isFavorite: (hallId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (hallId: string) => {
        const current = get().favoriteIds;
        if (!current.includes(hallId)) {
          set({ favoriteIds: [...current, hallId] });
        }
      },

      removeFavorite: (hallId: string) => {
        const current = get().favoriteIds;
        set({ favoriteIds: current.filter((id) => id !== hallId) });
      },

      toggleFavorite: (hallId: string) => {
        const current = get().favoriteIds;
        const exists = current.includes(hallId);
        if (exists) {
          set({ favoriteIds: current.filter((id) => id !== hallId) });
          return false;
        } else {
          set({ favoriteIds: [...current, hallId] });
          return true;
        }
      },

      setFavoriteIds: (ids: string[]) => set({ favoriteIds: ids }),

      isFavorite: (hallId: string) => get().favoriteIds.includes(hallId),
    }),
    {
      name: 'marriagehall-favorites-storage',
    }
  )
);

export function useFavorites() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const setFavoriteIds = useFavoritesStore((state) => state.setFavoriteIds);

  /**
   * Optimistic toggle with optional rollback action if an external API fails
   */
  const optimisticToggle = async (
    hallId: string,
    apiAction?: (nextIsFav: boolean) => Promise<void>
  ) => {
    const previous = [...favoriteIds];
    const isNowFav = toggleFavorite(hallId);

    if (apiAction) {
      try {
        await apiAction(isNowFav);
      } catch (err) {
        // Rollback state on error
        setFavoriteIds(previous);
        throw err;
      }
    }
  };

  return {
    favoriteIds,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    optimisticToggle,
    isFavorite: (hallId: string) => favoriteIds.includes(hallId),
  };
}

/**
 * Hook to fetch detailed Hall entities for all saved favorite IDs
 */
export function useFavoriteHalls() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  const queryResults = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ['hallDetail', id],
      queryFn: () => hallsApi.getHallById(id),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queryResults.some((res) => res.isLoading);
  const isError = queryResults.some((res) => res.isError);

  const favoriteHalls: Hall[] = queryResults
    .map((res) => res.data)
    .filter((hall): hall is Hall => Boolean(hall));

  return {
    favoriteIds,
    favoriteHalls,
    isLoading,
    isError,
    count: favoriteIds.length,
  };
}
