import { useQuery } from '@tanstack/react-query';
import { hallsApi } from '../api/halls.api';
import type { HallSearchParams } from '@/types/api';

export function useHallsCatalog(params: HallSearchParams) {
  return useQuery({
    queryKey: ['halls', params],
    queryFn: () => hallsApi.getHalls(params),
    placeholderData: (previousData) => previousData,
  });
}

