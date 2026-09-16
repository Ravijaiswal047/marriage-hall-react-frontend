import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-300">
      <PackageOpen className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description ? (
        <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </div>
  );
};

