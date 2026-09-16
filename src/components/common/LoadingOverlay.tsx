import React from 'react';
import { Spinner } from '../ui/Spinner';

export interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <Spinner size="lg" className="mb-4" />
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
};

