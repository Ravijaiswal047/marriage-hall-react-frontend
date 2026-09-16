import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import type { Role } from '@/types/common';
import { ROUTES } from '@/lib/constants/routes';

export interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
}) => {
  const role = useAuthStore((state) => state.role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

