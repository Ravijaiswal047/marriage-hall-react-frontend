import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { useHallDetails } from '@/features/halls/hooks/useHallDetails';
import { hallsApi } from '@/features/halls/api/halls.api';
import type { HallRequestDTO } from '@/types/api';
import { HallForm } from '../components/HallForm';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export const EditHallPage: FC = () => {
  const { hallId } = useParams<{ hallId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { hall, isLoading, error } = useHallDetails(hallId);

  const updateMutation = useMutation({
    mutationFn: (data: HallRequestDTO) => hallsApi.updateHall(hallId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hall', hallId] });
      queryClient.invalidateQueries({ queryKey: ['vendorHalls'] });
      queryClient.invalidateQueries({ queryKey: ['halls'] });
      navigate('/vendor/halls');
    },
  });

  const handleSubmit = async (data: HallRequestDTO) => {
    await updateMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse text-left">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !hall) {
    return (
      <ErrorState
        title="Venue Not Found"
        message={error?.message || 'The requested venue listing could not be found.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-2 pb-3 border-b border-[#DDDDDD]">
        <Edit className="w-5 h-5 text-[#FF385C]" />
        <h1 className="text-xl font-bold text-[#222222]">Edit Listing: {hall.name}</h1>
      </div>

      <HallForm
        initialValues={hall}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitError={updateMutation.error}
        buttonText="Save Venue Changes"
      />
    </div>
  );
};

