import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '@/types/common';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  role: Role | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,
      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
          role: user.role,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          role: null,
        }),
    }),
    {
      name: 'marriagehall-auth-storage',
    }
  )
);

