import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { CustomerLayout } from '@/features/customer/components/CustomerLayout';
import { PageFallback } from '@/components/common/PageFallback';

const CustomerDashboardPage = lazy(() =>
  import('@/features/customer/pages/CustomerDashboardPage').then((m) => ({ default: m.CustomerDashboardPage }))
);
const CustomerProfilePage = lazy(() =>
  import('@/features/customer/pages/CustomerProfilePage').then((m) => ({ default: m.CustomerProfilePage }))
);
const CustomerBookingsPage = lazy(() =>
  import('@/features/customer/pages/CustomerBookingsPage').then((m) => ({ default: m.CustomerBookingsPage }))
);
const CustomerBookingDetailPage = lazy(() =>
  import('@/features/customer/pages/CustomerBookingDetailPage').then((m) => ({ default: m.CustomerBookingDetailPage }))
);
const CustomerFavoritesPage = lazy(() =>
  import('@/features/customer/pages/CustomerFavoritesPage').then((m) => ({ default: m.CustomerFavoritesPage }))
);
const CustomerReviewsPage = lazy(() =>
  import('@/features/customer/pages/CustomerReviewsPage').then((m) => ({ default: m.CustomerReviewsPage }))
);
const CustomerSettingsPage = lazy(() =>
  import('@/features/customer/pages/CustomerSettingsPage').then((m) => ({ default: m.CustomerSettingsPage }))
);
const BookingCheckoutPage = lazy(() =>
  import('@/features/booking/pages/BookingCheckoutPage').then((m) => ({ default: m.BookingCheckoutPage }))
);
const BookingConfirmationPage = lazy(() =>
  import('@/features/booking/pages/BookingConfirmationPage').then((m) => ({ default: m.BookingConfirmationPage }))
);

export const customerRoutes: RouteObject[] = [
  {
    path: '/account',
    element: (
      <AuthGuard>
        <Suspense fallback={<PageFallback />}>
          <CustomerLayout />
        </Suspense>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomerDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomerProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'bookings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomerBookingsPage />
          </Suspense>
        ),
      },
      {
        path: 'bookings/:bookingId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomerBookingDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'favorites',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomerFavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'reviews',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomerReviewsPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CustomerSettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/my-bookings',
    element: (
      <AuthGuard>
        <CustomerLayout>
          <Suspense fallback={<PageFallback />}>
            <CustomerBookingsPage />
          </Suspense>
        </CustomerLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/bookings/:bookingId',
    element: (
      <AuthGuard>
        <Suspense fallback={<PageFallback />}>
          <BookingCheckoutPage />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: '/bookings/:bookingId/confirmation',
    element: (
      <AuthGuard>
        <Suspense fallback={<PageFallback />}>
          <BookingConfirmationPage />
        </Suspense>
      </AuthGuard>
    ),
  },
];
