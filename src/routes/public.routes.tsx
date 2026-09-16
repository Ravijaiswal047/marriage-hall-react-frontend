import { lazy, Suspense } from 'react';
import type { FC } from 'react';
import type { RouteObject } from 'react-router-dom';
import { HeroSection } from '@/features/halls/components/HeroSection';
import { DestinationSection } from '@/features/halls/components/DestinationSection';
import { CategorySection } from '@/features/halls/components/CategorySection';
import { FeaturedHallSection } from '@/features/halls/components/FeaturedHallSection';
import { TrustSection } from '@/features/halls/components/TrustSection';
import { VendorCTA } from '@/features/halls/components/VendorCTA';
import { PageFallback } from '@/components/common/PageFallback';

const HallsPage = lazy(() =>
  import('@/features/halls/components/HallsPage').then((m) => ({ default: m.HallsPage }))
);
const HallDetailPage = lazy(() =>
  import('@/features/halls/components/HallDetailPage').then((m) => ({ default: m.HallDetailPage }))
);

const HomePage: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <HeroSection />
      <DestinationSection />
      <CategorySection />
      <FeaturedHallSection
        title="Featured Wedding Venues"
        subtitle="Handpicked, top-rated halls ready for instant booking."
        badgeText="Handpicked"
        filterParams={{ size: 6, sortBy: 'createdAt' }}
      />
      <FeaturedHallSection
        title="Popular Banquets & Lawns"
        subtitle="Frequently booked venues with high customer demand."
        badgeText="Most Popular"
        filterParams={{ size: 6, sortBy: 'capacity' }}
      />
      <FeaturedHallSection
        title="Luxury Palaces & 5-Star Venues"
        subtitle="Exquisite high-end venues offering royal hospitality."
        badgeText="Five Star"
        filterParams={{ minPrice: 100000, size: 6 }}
      />
      <FeaturedHallSection
        title="Venues in Mumbai"
        subtitle="Sea-facing banquets and prime wedding halls in Mumbai."
        badgeText="Mumbai Spotlight"
        filterParams={{ city: 'Mumbai', size: 6 }}
      />
      <TrustSection />
      <VendorCTA />
    </div>
  );
};

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  {
    path: '/halls',
    element: (
      <Suspense fallback={<PageFallback />}>
        <HallsPage />
      </Suspense>
    ),
  },
  {
    path: '/halls/:hallId',
    element: (
      <Suspense fallback={<PageFallback />}>
        <HallDetailPage />
      </Suspense>
    ),
  },
];
