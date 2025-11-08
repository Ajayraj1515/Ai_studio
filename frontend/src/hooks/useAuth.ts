import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@shared/auth';
import { authService } from '@/services/auth';

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    queryClient.setQueryData(['auth', 'user'], result.user);
    return result;
  };

  const signup = async (email: string, password: string, name: string) => {
    const result = await authService.signup({ email, password, name });
    queryClient.setQueryData(['auth', 'user'], result.user);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };
}