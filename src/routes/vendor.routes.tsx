import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { VendorLayout } from '@/features/vendor/components/VendorLayout';
import { PageFallback } from '@/components/common/PageFallback';

const VendorDashboardPage = lazy(() =>
  import('@/features/vendor/pages/VendorDashboardPage').then((m) => ({ default: m.VendorDashboardPage }))
);
const VendorHallsPage = lazy(() =>
  import('@/features/vendor/pages/VendorHallsPage').then((m) => ({ default: m.VendorHallsPage }))
);
const CreateHallPage = lazy(() =>
  import('@/features/vendor/pages/CreateHallPage').then((m) => ({ default: m.CreateHallPage }))
);
const EditHallPage = lazy(() =>
  import('@/features/vendor/pages/EditHallPage').then((m) => ({ default: m.EditHallPage }))
);
const HallAvailabilityPage = lazy(() =>
  import('@/features/vendor/pages/HallAvailabilityPage').then((m) => ({ default: m.HallAvailabilityPage }))
);
const VendorBookingsPage = lazy(() =>
  import('@/features/vendor/pages/VendorBookingsPage').then((m) => ({ default: m.VendorBookingsPage }))
);
const VendorBookingDetailPage = lazy(() =>
  import('@/features/vendor/pages/VendorBookingDetailPage').then((m) => ({ default: m.VendorBookingDetailPage }))
);
const VendorReviewsPage = lazy(() =>
  import('@/features/vendor/pages/VendorReviewsPage').then((m) => ({ default: m.VendorReviewsPage }))
);
const VendorPaymentsPage = lazy(() =>
  import('@/features/vendor/pages/VendorPaymentsPage').then((m) => ({ default: m.VendorPaymentsPage }))
);
const VendorProfilePage = lazy(() =>
  import('@/features/vendor/pages/VendorProfilePage').then((m) => ({ default: m.VendorProfilePage }))
);

export const vendorRoutes: RouteObject[] = [
  {
    path: '/vendor',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['VENDOR', 'ADMIN']}>
          <Suspense fallback={<PageFallback />}>
            <VendorLayout />
          </Suspense>
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/vendor/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageFallback />}>
            <VendorDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'halls',
        element: (
          <Suspense fallback={<PageFallback />}>
            <VendorHallsPage />
          </Suspense>
        ),
      },
      {
        path: 'halls/new',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CreateHallPage />
          </Suspense>
        ),
      },
      {
        path: 'halls/create',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CreateHallPage />
          </Suspense>
        ),
      },
      {
        path: 'halls/:hallId/edit',
        element: (
          <Suspense fallback={<PageFallback />}>
            <EditHallPage />
          </Suspense>
        ),
      },
      {
        path: 'halls/:hallId/availability',
        element: (
          <Suspense fallback={<PageFallback />}>
            <HallAvailabilityPage />
          </Suspense>
        ),
      },
      {
        path: 'bookings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <VendorBookingsPage />
          </Suspense>
        ),
      },
      {
        path: 'bookings/:bookingId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <VendorBookingDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'reviews',
        element: (
          <Suspense fallback={<PageFallback />}>
            <VendorReviewsPage />
          </Suspense>
        ),
      },
      {
        path: 'payments',
        element: (
          <Suspense fallback={<PageFallback />}>
            <VendorPaymentsPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageFallback />}>
            <VendorProfilePage />
          </Suspense>
        ),
      },
    ],
  },
];
