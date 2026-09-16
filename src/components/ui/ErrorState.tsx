import type { FC } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorState: FC<ErrorStateProps> = ({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while connecting to the server.',
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-2xl border border-red-200">
      <div className="p-3 bg-red-100 rounded-full text-red-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-red-950 mb-1">{title}</h4>
      <p className="text-xs text-red-700 max-w-sm mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          isLoading={isRetrying}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      ) : null}
    </div>
  );
};

