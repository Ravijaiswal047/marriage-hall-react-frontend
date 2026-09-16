import type { FC } from 'react';
import { Spinner } from '@/components/ui/Spinner';

export const PageFallback: FC = () => {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center gap-3 p-6 text-center"
      role="status"
      aria-label="Loading page content"
    >
      <Spinner size="lg" variant="brand" />
      <span className="text-xs font-bold text-[#717171] uppercase tracking-wider animate-pulse">
        Loading...
      </span>
    </div>
  );
};

