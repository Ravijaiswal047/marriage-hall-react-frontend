import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PageFallback } from '@/components/common/PageFallback';

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<PageFallback />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/login',
    element: (
      <Suspense fallback={<PageFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/signup',
    element: (
      <Suspense fallback={<PageFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
];
