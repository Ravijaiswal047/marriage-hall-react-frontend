import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { LoginRequestDTO, SignupRequestDTO } from '@/types/api';
import { useAuthStore } from '@/store/auth.store';
import { toast } from '@/store/ui.store';

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
      toast.success({
        title: 'Welcome to MarriageHall!',
        message: `Account created successfully. Welcome, ${res.name}!`,
      });
    },
    onError: (err: Error) => {
      toast.error({
        title: 'Registration Failed',
        message: err.message || 'Could not create account. Please try again.',
      });
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
      toast.success({
        title: 'Welcome back!',
        message: `Signed in as ${res.name}`,
      });
    },
    onError: (err: Error) => {
      toast.error({
        title: 'Login Failed',
        message: err.message || 'Invalid email or password. Please check your details.',
      });
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
    toast.info({
      title: 'Signed Out',
      message: 'You have been logged out safely.',
    });
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
