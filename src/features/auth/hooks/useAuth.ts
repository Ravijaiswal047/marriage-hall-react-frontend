import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { LoginRequestDTO, SignupRequestDTO } from '@/types/api';
import { useAuthStore } from '@/store/auth.store';

export const AUTH_QUERY_KEY = ['currentUser'];

export function useAuth() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const storeLogout = useAuthStore((state) => state.logout);
  const storeUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  const signupMutation = useMutation({
    mutationFn: (data: SignupRequestDTO) => authApi.signup(data),
    onSuccess: (res) => {
      setAuth(res.token, {
        id: res.userId,
        name: res.name,
        email: res.email,
        role: res.role,
        phone: res.phone,
        avatarUrl: res.avatarUrl,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequestDTO) => authApi.login(data),
    onSuccess: (res) => {
      setAuth(res.token, {
        id: res.userId,
        name: res.name,
        email: res.email,
        role: res.role,
        phone: res.phone,
        avatarUrl: res.avatarUrl,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const currentUserQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
  });

  const logout = () => {
    storeLogout();
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
  };

  return {
    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    user: currentUserQuery.data || storeUser,
    isAuthenticated,
    role,
    isLoadingUser: currentUserQuery.isLoading,
    logout,
  };
}
