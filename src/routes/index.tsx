import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { publicRoutes } from './public.routes';
import { authRoutes } from './auth.routes';
import { customerRoutes } from './customers.routes';
import { vendorRoutes } from './vendor.routes';
import { adminRoutes } from './admin.routes';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      ...publicRoutes,
      ...authRoutes,
      ...customerRoutes,
      ...vendorRoutes,
      ...adminRoutes,
    ],
  },
]);

