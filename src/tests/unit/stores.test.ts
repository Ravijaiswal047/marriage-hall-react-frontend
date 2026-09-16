import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/auth.store';
import { useSearchStore } from '@/store/search.store';
import { useUIStore } from '@/store/ui.store';
import { useFavoritesStore } from '@/features/favorites/hooks/useFavorites';
import type { User } from '@/types/common';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('initializes with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.role).toBeNull();
  });

  it('sets authentication state correctly', () => {
    const testUser: User = {
      id: 'usr-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
    };
    useAuthStore.getState().setAuth('mock-token-123', testUser);

    const state = useAuthStore.getState();
    expect(state.token).toBe('mock-token-123');
    expect(state.user).toEqual(testUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe('USER');
  });

  it('clears state on logout', () => {
    const testUser: User = {
      id: 'usr-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
    };
    useAuthStore.getState().setAuth('mock-token-123', testUser);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('useSearchStore', () => {
  beforeEach(() => {
    useSearchStore.getState().resetFilters();
  });

  it('sets individual filter key and resets page to 0', () => {
    useSearchStore.getState().setFilter('city', 'Mumbai');
    let state = useSearchStore.getState();
    expect(state.filters.city).toBe('Mumbai');
    expect(state.filters.page).toBe(0);

    useSearchStore.getState().setFilter('page', 2);
    state = useSearchStore.getState();
    expect(state.filters.page).toBe(2);
  });

  it('resets all filters to initial state', () => {
    useSearchStore.getState().setFilter('city', 'Delhi');
    useSearchStore.getState().setFilter('minPrice', 50000);
    useSearchStore.getState().resetFilters();

    const state = useSearchStore.getState();
    expect(state.filters.city).toBeUndefined();
    expect(state.filters.minPrice).toBeUndefined();
    expect(state.filters.page).toBe(0);
  });
});

describe('useUIStore', () => {
  it('manages modal opening and closing', () => {
    useUIStore.getState().openModal('TEST_MODAL');
    expect(useUIStore.getState().activeModal).toBe('TEST_MODAL');

    useUIStore.getState().closeModal();
    expect(useUIStore.getState().activeModal).toBeNull();
  });

  it('adds and removes toasts', () => {
    useUIStore.getState().addToast({ type: 'success', title: 'Saved!' });
    const toasts = useUIStore.getState().toasts;
    expect(toasts.length).toBeGreaterThan(0);
    expect(toasts[0].title).toBe('Saved!');

    const id = toasts[0].id;
    useUIStore.getState().removeToast(id);
    expect(useUIStore.getState().toasts.find((t) => t.id === id)).toBeUndefined();
  });
});

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.getState().setFavoriteIds([]);
  });

  it('adds, removes, and toggles favorite IDs', () => {
    useFavoritesStore.getState().addFavorite('hall-1');
    expect(useFavoritesStore.getState().isFavorite('hall-1')).toBe(true);

    const isFavNow = useFavoritesStore.getState().toggleFavorite('hall-1');
    expect(isFavNow).toBe(false);
    expect(useFavoritesStore.getState().isFavorite('hall-1')).toBe(false);

    useFavoritesStore.getState().toggleFavorite('hall-2');
    expect(useFavoritesStore.getState().isFavorite('hall-2')).toBe(true);

    useFavoritesStore.getState().removeFavorite('hall-2');
    expect(useFavoritesStore.getState().isFavorite('hall-2')).toBe(false);
  });
});

