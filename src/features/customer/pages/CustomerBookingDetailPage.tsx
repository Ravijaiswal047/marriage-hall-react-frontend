import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home, Calendar, Printer, ShieldCheck } from 'lucide-react';
import { useBookingDetails } from '@/features/booking/hooks/useBookingDetails';
import { BookingSummary } from '@/features/booking/components/BookingSummary';
import { PriceBreakdown } from '@/features/booking/components/PriceBreakdown';
import { PaymentSection } from '@/features/booking/components/PaymentSection';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export const CustomerBookingDetailPage: FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { details, summary, isLoadingDetails, isLoadingSummary, detailsError, refetch } =
    useBookingDetails(bookingId);

  const handlePrint = () => {
    window.print();
  };

  if (isLoadingDetails || isLoadingSummary) {
    return (
      <div className="flex flex-col gap-6 animate-pulse text-left">
        <Skeleton className="h-6 w-48 rounded-xs" />
        <Skeleton className="h-10 w-2/3 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (detailsError || !details) {
    return (
      <ErrorState
        title="Booking Details Unavailable"
        message={
          detailsError?.message ||
          'The requested reservation details could not be found.'
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-1.5 text-xs text-[#717171] font-medium flex-wrap">
        <Link to="/" className="hover:text-[#FF385C] flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/account/bookings" className="hover:text-[#FF385C] flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Bookings</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#222222] font-bold">#{details.booking.id.substring(0, 8)}</span>
      </nav>

      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD] flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-black text-[#222222] tracking-tight">
            Reservation Details
          </h1>
          <p className="text-xs text-[#717171]">
            Venue specs, authoritative pricing, and payment management.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4 text-[#717171]" />}
          className="text-xs font-semibold"
        >
          Print Receipt
        </Button>
      </div>

      {/* GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <main className="lg:col-span-2 flex flex-col gap-6">
          <BookingSummary details={details} />
          {summary && <PaymentSection summary={summary} />}
        </main>

        <aside className="lg:col-span-1 flex flex-col gap-4">
          {summary && <PriceBreakdown summary={summary} />}

          <div className="p-4 bg-[#FFF0F3] rounded-2xl border border-[#FF385C]/20 flex flex-col gap-2 text-xs text-[#717171]">
            <span className="font-bold text-[#FF385C] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Reservation
            </span>
            <span>
              All financial figures reflect backend-authoritative calculation rules.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

