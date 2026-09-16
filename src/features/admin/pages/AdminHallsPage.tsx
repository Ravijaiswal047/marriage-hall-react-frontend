import { useState } from 'react';
import type { FC } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Building2, Plus, Edit, Trash2, Eye, MapPin, Users } from 'lucide-react';
import { hallsApi } from '@/features/halls/api/halls.api';
import type { Hall } from '@/types/common';
import { formatCurrency } from '@/lib/utils/formatters';
import { DataTable, type Column } from '../components/DataTable';
import { AdminPagination } from '../components/AdminPagination';
import { AdminSearchFilter } from '../components/AdminSearchFilter';
import { DetailDrawer } from '../components/DetailDrawer';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminHallsPage: FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Hall for Drawer & Delete Confirmation
  const [drawerHall, setDrawerHall] = useState<Hall | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Hall | null>(null);

  // 1. Fetch Distinct Cities
  const { data: cities = [] } = useQuery({
    queryKey: ['adminCities'],
    queryFn: hallsApi.getCities,
  });

  // 2. Fetch Paginated Halls Catalog
  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminHalls', page, pageSize, selectedCity],
    queryFn: () =>
      hallsApi.getHalls({
        page,
        size: pageSize,
        city: selectedCity !== 'ALL' ? selectedCity : undefined,
      }),
  });

  // 3. Delete Hall Mutation
  const deleteMutation = useMutation({
    mutationFn: (hallId: string) => hallsApi.deleteHall(hallId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHalls'] });
      queryClient.invalidateQueries({ queryKey: ['vendorHalls'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      setDeleteTarget(null);
    },
  });

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await deleteMutation.mutateAsync(deleteTarget.id);
    }
  };

  const filteredContent = (pageData?.content || []).filter((h) =>
    searchQuery
      ? h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const columns: Column<Hall>[] = [
    {
      key: 'name',
      header: 'Venue Name',
      accessor: (h) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-[#222222]">{h.name}</span>
          <span className="text-[11px] text-[#717171] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#FF385C]" /> {h.location}
          </span>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      accessor: (h) => (
        <Badge variant="secondary" size="sm" className="bg-[#F7F7F7] text-[#222222]">
          {h.city || h.location.split(',')[0]}
        </Badge>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      align: 'center',
      accessor: (h) => (
        <span className="flex items-center justify-center gap-1 text-xs">
          <Users className="w-3.5 h-3.5 text-[#717171]" />
          {h.capacity} Seated
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Daily Rate',
      align: 'right',
      accessor: (h) => (
        <span className="font-black text-[#FF385C]">{formatCurrency(h.price)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      accessor: (h) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDrawerHall(h)}
            className="p-1.5"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5 text-[#717171]" />
          </Button>
          <Link to={`/vendor/halls/${h.id}/edit`}>
            <Button size="sm" variant="outline" className="p-1.5" title="Edit Hall">
              <Edit className="w-3.5 h-3.5 text-sky-600" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteTarget(h)}
            className="p-1.5 border-red-200 hover:bg-red-50"
            title="Delete Listing"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Venues Catalog"
        message={error?.message || 'Unable to retrieve halls data.'}
        onRetry={refetch}
      />
    );
  }

  const cityOptions = [
    { value: 'ALL', label: 'All Cities' },
    ...cities.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold text-[#222222]">
            Platform Venues Catalog ({pageData?.totalElements ?? 0})
          </h1>
        </div>

        <Link to="/vendor/halls/new">
          <Button size="sm" className="text-xs font-bold" leftIcon={<Plus className="w-4 h-4" />}>
            + Add New Venue
          </Button>
        </Link>
      </div>

      {/* SEARCH & FILTER BAR */}
      <AdminSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search venue by name or address..."
        filterValue={selectedCity}
        filterOptions={cityOptions}
        onFilterChange={(c) => {
          setSelectedCity(c);
          setPage(0);
        }}
        filterLabel="City"
        onClearAll={() => {
          setSearchQuery('');
          setSelectedCity('ALL');
          setPage(0);
        }}
      />

      {/* DATA TABLE */}
      <DataTable
        data={filteredContent}
        columns={columns}
        keyExtractor={(h) => h.id}
        isLoading={isLoading}
        emptyTitle="No Venues Found"
        emptyDescription="No venue listings matched your search criteria."
      />

      {/* PAGINATION */}
      {pageData && (
        <AdminPagination
          currentPage={page}
          totalPages={pageData.totalPages}
          totalElements={pageData.totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setPage(0);
          }}
        />
      )}

      {/* DETAIL DRAWER */}
      <DetailDrawer
        isOpen={Boolean(drawerHall)}
        onClose={() => setDrawerHall(null)}
        title={drawerHall?.name || 'Venue Details'}
        subtitle={drawerHall?.location}
      >
        {drawerHall && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-[#DDDDDD]">
              <img
                src={drawerHall.coverImageUrl || drawerHall.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                alt={drawerHall.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171]">Daily Price:</span>
              <span className="font-black text-[#FF385C] text-sm">{formatCurrency(drawerHall.price)}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171]">Capacity:</span>
              <span className="font-bold text-[#222222]">{drawerHall.capacity} Seated Guests</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-[#DDDDDD]">
              <span className="text-[#717171]">Vendor Reference:</span>
              <span className="font-mono font-bold text-[#717171]">{drawerHall.vendorId || 'N/A'}</span>
            </div>

            {drawerHall.description && (
              <div className="flex flex-col gap-1 pt-2">
                <span className="text-[#717171] font-bold">Description:</span>
                <p className="bg-[#F7F7F7] p-3 rounded-xl leading-relaxed text-[#222222]">
                  {drawerHall.description}
                </p>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Venue Listing"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Listing"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

