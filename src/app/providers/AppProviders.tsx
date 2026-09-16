import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryProvider>{children}</QueryProvider>
    </ErrorBoundary>
  );
};

