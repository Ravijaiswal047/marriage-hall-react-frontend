import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ApiError } from '@/lib/api/errors';

export interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes stale time
            gcTime: 1000 * 60 * 30, // 30 minutes garbage collection time
            retry: (failureCount, error: unknown) => {
              const apiErr = error as ApiError;
              if (
                apiErr?.status === 401 ||
                apiErr?.status === 403 ||
                apiErr?.status === 404
              ) {
                return false;
              }
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
