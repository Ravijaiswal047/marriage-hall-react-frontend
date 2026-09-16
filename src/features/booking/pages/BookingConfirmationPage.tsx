import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useBookingDetails } from '../hooks/useBookingDetails';
import { BookingConfirmation } from '../components/BookingConfirmation';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export const BookingConfirmationPage: FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { details, summary, isLoadingDetails, detailsError, refetch } =
    useBookingDetails(bookingId);

  if (isLoadingDetails) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4">
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (detailsError || !details) {
    return (
      <div className="py-12 max-w-md mx-auto px-4">
        <ErrorState
          title="Confirmation Details Unavailable"
          message={
            detailsError?.message ||
            'Unable to load the requested booking confirmation. Please verify your reservation ID.'
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6">
      <BookingConfirmation details={details} summary={summary} />
    </div>
  );
};

