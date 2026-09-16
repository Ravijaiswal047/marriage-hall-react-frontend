import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hallsApi } from '../api/halls.api';
import type { HallRequestDTO } from '@/types/api';

export function useHallDetails(hallId?: string) {
  const queryClient = useQueryClient();

  const hallQuery = useQuery({
    queryKey: ['hall', hallId],
    queryFn: () => hallsApi.getHallById(hallId!),
    enabled: Boolean(hallId),
  });

  const createHallMutation = useMutation({
    mutationFn: (data: HallRequestDTO) => hallsApi.createHall(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['halls'] });
    },
  });

  const updateHallMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: HallRequestDTO }) =>
      hallsApi.updateHall(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hall', id] });
      queryClient.invalidateQueries({ queryKey: ['halls'] });
    },
  });

  const deleteHallMutation = useMutation({
    mutationFn: (id: string) => hallsApi.deleteHall(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['halls'] });
    },
  });

  return {
    hall: hallQuery.data,
    isLoading: hallQuery.isLoading,
    error: hallQuery.error,

    createHall: createHallMutation.mutateAsync,
    isCreating: createHallMutation.isPending,

    updateHall: updateHallMutation.mutateAsync,
    isUpdating: updateHallMutation.isPending,

    deleteHall: deleteHallMutation.mutateAsync,
    isDeleting: deleteHallMutation.isPending,
  };
}

