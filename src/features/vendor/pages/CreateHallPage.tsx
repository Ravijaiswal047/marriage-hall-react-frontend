import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { hallsApi } from '@/features/halls/api/halls.api';
import type { HallRequestDTO } from '@/types/api';
import { HallForm } from '../components/HallForm';

export const CreateHallPage: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: HallRequestDTO) => hallsApi.createHall(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorHalls'] });
      queryClient.invalidateQueries({ queryKey: ['halls'] });
      queryClient.invalidateQueries({ queryKey: ['vendorDashboardStats'] });
      navigate('/vendor/halls');
    },
  });

  const handleSubmit = async (data: HallRequestDTO) => {
    await createMutation.mutateAsync(data);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-2 pb-3 border-b border-[#DDDDDD]">
        <PlusCircle className="w-5 h-5 text-[#FF385C]" />
        <h1 className="text-xl font-bold text-[#222222]">Add New Venue Listing</h1>
      </div>

      <HallForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitError={createMutation.error}
        buttonText="Publish Venue Listing"
      />
    </div>
  );
};

