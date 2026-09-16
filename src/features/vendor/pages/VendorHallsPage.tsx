import type { FC } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Building2, Plus, Edit, Calendar, Trash2, MapPin, Users } from 'lucide-react';
import { hallsApi } from '@/features/halls/api/halls.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const VendorHallsPage: FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: halls = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['vendorHalls', user?.id],
    queryFn: () => hallsApi.getVendorHalls(user?.id || ''),
    enabled: Boolean(user?.id),
  });

  const deleteMutation = useMutation({
    mutationFn: (hallId: string) => hallsApi.deleteHall(hallId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorHalls'] });
      queryClient.invalidateQueries({ queryKey: ['halls'] });
      queryClient.invalidateQueries({ queryKey: ['vendorDashboardStats'] });
    },
  });

  const handleDelete = async (hallId: string, hallName: string) => {
    if (window.confirm(`Are you sure you want to delete "${hallName}"? This action cannot be undone.`)) {
      await deleteMutation.mutateAsync(hallId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse text-left">
        <div className="h-8 w-48 bg-gray-200 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Listed Venues"
        message={error?.message || 'Unable to retrieve your listed halls.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#FF385C]" />
          <h1 className="text-xl font-bold text-[#222222]">My Listed Venues ({halls.length})</h1>
        </div>

        <Link to="/vendor/halls/new">
          <Button size="sm" className="text-xs font-bold" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Venue
          </Button>
        </Link>
      </div>

      {/* HALLS LIST */}
      {halls.length === 0 ? (
        <EmptyState
          title="No Venues Listed Yet"
          description="Create your first wedding hall listing to start receiving customer bookings and managing event schedules!"
          actionLabel="Create First Venue"
          onAction={() => window.location.assign('/vendor/halls/new')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {halls.map((hall) => (
            <div
              key={hall.id}
              className="bg-white border border-[#DDDDDD] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={hall.coverImageUrl || hall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                  alt={hall.name}
                  className="w-full h-full object-cover"
                />
                <Badge variant="secondary" size="sm" className="absolute top-3 left-3 bg-[#222222]/80 backdrop-blur-xs text-white border-none">
                  {hall.city || hall.location.split(',')[0]}
                </Badge>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-base font-bold text-[#222222] line-clamp-1">
                  {hall.name}
                </h3>
                <p className="text-xs text-[#717171] line-clamp-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                  {hall.location}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDDDDD]">
                  <span className="font-semibold text-[#717171] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {hall.capacity} Guests
                  </span>
                  <span className="font-black text-[#FF385C]">
                    {formatCurrency(hall.price)} / day
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F7F7] border-t border-[#DDDDDD] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link to={`/vendor/halls/${hall.id}/edit`}>
                    <Button size="sm" variant="outline" className="text-xs font-semibold" leftIcon={<Edit className="w-3.5 h-3.5 text-sky-600" />}>
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/vendor/halls/${hall.id}/availability`}>
                    <Button size="sm" variant="outline" className="text-xs font-semibold" leftIcon={<Calendar className="w-3.5 h-3.5 text-purple-600" />}>
                      Calendar
                    </Button>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(hall.id, hall.name)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete hall"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

