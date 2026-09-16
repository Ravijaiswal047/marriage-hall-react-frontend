import type { FC } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home, Calendar, ShieldCheck } from 'lucide-react';
import { useBookingDetails } from '../hooks/useBookingDetails';
import { BookingSummary } from '../components/BookingSummary';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { PaymentSection } from '../components/PaymentSection';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export const BookingCheckoutPage: FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { details, summary, isLoadingDetails, isLoadingSummary, detailsError, refetch } =
    useBookingDetails(bookingId);

  const handlePaymentSuccess = () => {
    navigate(`/bookings/${bookingId}/confirmation`);
  };

  if (isLoadingDetails || isLoadingSummary) {
    return (
      <div className="py-6 flex flex-col gap-6 text-left max-w-5xl mx-auto px-4 sm:px-6">
        <Skeleton className="h-4 w-48 rounded-xs" />
        <Skeleton className="h-8 w-1/2 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (detailsError || !details) {
    return (
      <div className="py-12 max-w-md mx-auto px-4">
        <ErrorState
          title="Booking Not Found"
          message={
            detailsError?.message ||
            'The requested booking record could not be found. Please check your reservation ID or view your bookings.'
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col gap-6 text-left max-w-5xl mx-auto px-4 sm:px-6">
      {/* BREADCRUMBS */}
      <nav className="flex items-center gap-1.5 text-xs text-[#717171] font-medium flex-wrap">
        <Link to="/" className="hover:text-[#FF385C] flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/my-bookings" className="hover:text-[#FF385C] flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>My Bookings</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#222222] font-bold">Booking #{details.booking.id.substring(0, 8)}</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col gap-1 pb-3 border-b border-[#DDDDDD]">
        <h1 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
          Checkout & Reservation Summary
        </h1>
        <p className="text-xs sm:text-sm text-[#717171]">
          Review your reservation details, financial summary, and proceed with advance payment.
        </p>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT 2 COLS: SUMMARY & PAYMENT */}
        <main className="lg:col-span-2 flex flex-col gap-6">
          <BookingSummary details={details} />
          {summary && (
            <PaymentSection
              summary={summary}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </main>

        {/* RIGHT 1 COL: PRICE BREAKDOWN */}
        <aside className="lg:col-span-1 sticky top-24 flex flex-col gap-4">
          {summary && <PriceBreakdown summary={summary} />}

          <div className="p-4 bg-[#FFF0F3] rounded-2xl border border-[#FF385C]/20 flex flex-col gap-2 text-xs text-[#717171]">
            <span className="font-bold text-[#FF385C] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Venue Host Protection Guarantee
            </span>
            <span>
              Your reservation is backed by MarriageHall.com's instant vendor confirmation policy.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

