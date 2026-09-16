import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { PageFallback } from '@/components/common/PageFallback';

const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminHallsPage = lazy(() =>
  import('@/features/admin/pages/AdminHallsPage').then((m) => ({ default: m.AdminHallsPage }))
);
const CreateHallPage = lazy(() =>
  import('@/features/vendor/pages/CreateHallPage').then((m) => ({ default: m.CreateHallPage }))
);
const EditHallPage = lazy(() =>
  import('@/features/vendor/pages/EditHallPage').then((m) => ({ default: m.EditHallPage }))
);
const AdminBookingsPage = lazy(() =>
  import('@/features/admin/pages/AdminBookingsPage').then((m) => ({ default: m.AdminBookingsPage }))
);
const AdminBookingDetailPage = lazy(() =>
  import('@/features/admin/pages/AdminBookingDetailPage').then((m) => ({ default: m.AdminBookingDetailPage }))
);
const AdminReviewsPage = lazy(() =>
  import('@/features/admin/pages/AdminReviewsPage').then((m) => ({ default: m.AdminReviewsPage }))
);
const AdminPaymentsPage = lazy(() =>
  import('@/features/admin/pages/AdminPaymentsPage').then((m) => ({ default: m.AdminPaymentsPage }))
);
const AdminUsersPage = lazy(() =>
  import('@/features/admin/pages/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage }))
);
const AdminSystemPage = lazy(() =>
  import('@/features/admin/pages/AdminSystemPage').then((m) => ({ default: m.AdminSystemPage }))
);

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['ADMIN']}>
          <Suspense fallback={<PageFallback />}>
            <AdminLayout />
          </Suspense>
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'halls',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminHallsPage />
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
        path: 'halls/:hallId/edit',
        element: (
          <Suspense fallback={<PageFallback />}>
            <EditHallPage />
          </Suspense>
        ),
      },
      {
        path: 'bookings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminBookingsPage />
          </Suspense>
        ),
      },
      {
        path: 'bookings/:bookingId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminBookingDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'reviews',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminReviewsPage />
          </Suspense>
        ),
      },
      {
        path: 'payments',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminPaymentsPage />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
      {
        path: 'system',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminSystemPage />
          </Suspense>
        ),
      },
    ],
  },
];
