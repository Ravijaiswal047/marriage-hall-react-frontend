import { useQuery } from '@tanstack/react-query';
import { hallsApi } from '../api/halls.api';

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: hallsApi.getCities,
    staleTime: 1000 * 60 * 60, // Cities list rarely changes, 1hr stale time
  });
}

