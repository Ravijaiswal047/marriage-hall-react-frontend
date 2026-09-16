import { useState } from 'react';
import type { FC } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, Building2, Eye, CheckCircle2, XCircle, User, Phone } from 'lucide-react';
import { vendorApi } from '@/features/vendor/api/vendor.api';
import { bookingApi } from '@/features/booking/api/booking.api';
import type { VendorBookingResponseDTO } from '@/types/api';
import { formatCurrency } from '@/lib/utils/formatters';
import { DataTable, type Column } from '../components/DataTable';
import { AdminSearchFilter } from '../components/AdminSearchFilter';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils/cn';

export const AdminBookingsPage: FC = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Status Action Target
  const [statusTarget, setStatusTarget] = useState<{
    booking: VendorBookingResponseDTO;
    nextStatus: string;
  } | null>(null);

  // Fetch Platform Bookings (Authorized for ADMIN)
  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminBookingsList'],
    queryFn: vendorApi.getVendorBookings,
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      bookingApi.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookingsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      setStatusTarget(null);
    },
  });

  const handleConfirmStatusChange = async () => {
    if (statusTarget) {
      await updateStatusMutation.mutateAsync({
        bookingId: statusTarget.booking.bookingId,
        status: statusTarget.nextStatus,
      });
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    const matchesSearch = searchQuery
      ? b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.hallName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const columns: Column<VendorBookingResponseDTO>[] = [
    {
      key: 'bookingId',
      header: 'Reservation ID',
      accessor: (b) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono font-bold text-[#222222]">
            #{b.bookingId.substring(0, 8)}
          </span>
          <StatusBadge status={b.status} />
        </div>
      ),
    },
    {
      key: 'hallName',
      header: 'Venue',
      accessor: (b) => (
        <div className="flex items-center gap-1.5 font-bold text-[#222222]">
          <Building2 className="w-3.5 h-3.5 text-[#FF385C]" />
          <span>{b.hallName}</span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer Details',
      accessor: (b) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-bold text-[#222222] flex items-center gap-1">
            <User className="w-3 h-3 text-[#717171]" /> {b.customerName}
          </span>
          <span className="text-[11px] text-[#717171] flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#717171]" /> {b.customerPhone}
          </span>
        </div>
      ),
    },
    {
      key: 'bookingDate',
      header: 'Event Date & Slot',
      accessor: (b) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-bold text-[#222222]">{b.bookingDate}</span>
          <span className="text-[11px] text-[#717171] uppercase">{b.slot} • {b.eventType}</span>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Bill',
      align: 'right',
      accessor: (b) => (
        <div className="flex flex-col text-right">
          <span className="font-black text-[#FF385C]">{formatCurrency(b.totalAmount)}</span>
          <span className="text-[10px] text-emerald-700 font-semibold">
            Paid: {formatCurrency(b.paidAmount)}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      accessor: (b) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {b.status === 'PENDING' && (
            <Button
              size="sm"
              onClick={() => setStatusTarget({ booking: b, nextStatus: 'CONFIRMED' })}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              title="Confirm Reservation"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          )}

          {b.status !== 'CANCELLED' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatusTarget({ booking: b, nextStatus: 'CANCELLED' })}
              className="p-1.5 border-red-200 text-red-600 hover:bg-red-50"
              title="Cancel Reservation"
            >
              <XCircle className="w-3.5 h-3.5" />
            </Button>
          )}

          <Link to={`/admin/bookings/${b.bookingId}`}>
            <Button size="sm" variant="outline" className="p-1.5" title="View Details">
              <Eye className="w-3.5 h-3.5 text-[#717171]" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Platform Bookings"
        message={error?.message || 'Unable to retrieve booking records.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold text-[#222222]">
            Platform Reservation Management ({bookings.length})
          </h1>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((st) => {
          const isActive = selectedStatus === st;
          const count =
            st === 'ALL'
              ? bookings.length
              : bookings.filter((b) => b.status === st).length;

          return (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5',
                isActive
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-white text-[#717171] border-[#DDDDDD] hover:bg-[#F7F7F7]'
              )}
            >
              <span>{st === 'ALL' ? 'All Reservations' : st}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px]',
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F7F7F7] text-[#222222]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SEARCH INPUT */}
      <AdminSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by ID, customer name, or venue..."
        onClearAll={() => {
          setSearchQuery('');
          setSelectedStatus('ALL');
        }}
      />

      {/* DATA TABLE */}
      <DataTable
        data={filteredBookings}
        columns={columns}
        keyExtractor={(b) => b.bookingId}
        isLoading={isLoading}
        emptyTitle="No Reservations Found"
        emptyDescription="No booking records matched your search and filter criteria."
      />

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusChange}
        title="Update Reservation Status"
        description={`Are you sure you want to change reservation #${statusTarget?.booking.bookingId.substring(0, 8)} status to ${statusTarget?.nextStatus}?`}
        confirmLabel={`Set Status to ${statusTarget?.nextStatus}`}
        variant={statusTarget?.nextStatus === 'CANCELLED' ? 'danger' : 'info'}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
};

