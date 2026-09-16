import type { FC } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';

export interface HallCardSkeletonProps {
  className?: string;
}

export const HallCardSkeleton: FC<HallCardSkeletonProps> = ({ className }) => {
  return (
    <Card className={cn('h-full flex flex-col overflow-hidden', className)}>
      {/* MEDIA PLACEHOLDER */}
      <Skeleton className="w-full aspect-video rounded-none" />

      {/* CONTENT PLACEHOLDER */}
      <CardContent className="flex-1 flex flex-col p-4 gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-3/4 rounded-sm" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>

        <Skeleton className="h-3 w-1/2 rounded-sm mb-1" />

        {/* AMENITIES BADGES */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      </CardContent>

      {/* FOOTER PLACEHOLDER */}
      <CardFooter className="p-4 border-t border-[#DDDDDD] bg-[#F7F7F7]/40 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-2.5 w-16 rounded-xs" />
          <Skeleton className="h-4 w-24 rounded-xs" />
        </div>
        <Skeleton className="h-4 w-20 rounded-xs" />
      </CardFooter>
    </Card>
  );
};

export const HallGridSkeleton: FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <HallCardSkeleton key={idx} />
      ))}
    </div>
  );
};

