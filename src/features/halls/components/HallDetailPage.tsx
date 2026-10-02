import { useState } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Share2, MapPin, Check, Home, Building2 } from 'lucide-react';
import { useHallDetails } from '../hooks/useHallDetails';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { HallGallery } from './HallGallery';
import { HallOverview } from './HallOverview';
import { HallAmenities } from './HallAmenities';
import { HallBookingCard } from './HallBookingCard';
import { HallReviewsSection } from './HallReviewsSection';
import { HallLocationSection } from './HallLocationSection';
import { SimilarHallsSection } from './SimilarHallsSection';
import { Rating } from './Rating';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/store/ui.store';

export const HallDetailPage: FC = () => {
  const { hallId } = useParams<{ hallId: string }>();
  const { hall, isLoading, error } = useHallDetails(hallId);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    toast.success({
      title: 'Link copied to clipboard!',
      message: 'Share this wedding venue with your friends and family.',
    });
    setTimeout(() => setCopiedShare(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-6 flex flex-col gap-6 text-left max-w-7xl mx-auto px-4 sm:px-6">
        <Skeleton className="h-4 w-48 rounded-xs" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-2/3 rounded-md" />
          <Skeleton className="h-4 w-1/3 rounded-xs" />
        </div>
        <Skeleton className="w-full aspect-video md:aspect-[16/6] rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !hall) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4">
        <ErrorState
          title="Venue Not Found"
          message={
            error?.message ||
            'The requested wedding venue details could not be retrieved. It may have been removed or does not exist.'
          }
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col gap-6 text-left max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. BREADCRUMBS NAVIGATION */}
      <nav className="flex items-center gap-1.5 text-xs text-[#717171] font-medium flex-wrap">
        <Link to="/" className="hover:text-[#FF385C] flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/halls" className="hover:text-[#FF385C] flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" />
          <span>Venues</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#222222] font-bold truncate max-w-[200px] sm:max-w-none">
          {hall.name}
        </span>
      </nav>

      {/* 2. HEADER: TITLE, RATING, LOCATION, FAVORITE & SHARE */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-2 border-b border-[#DDDDDD]">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
            {hall.name}
          </h1>

          <div className="flex items-center gap-3 text-xs flex-wrap">
            <Rating hallId={hall.id} size="md" />

            <span className="text-[#717171]">•</span>

            <div className="flex items-center gap-1 text-[#717171] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
              <span>{hall.location}</span>
            </div>

            <Badge variant="secondary" size="sm" className="bg-[#FFF0F3] text-[#FF385C] border-none">
              {hall.city || 'Prime Location'}
            </Badge>
          </div>
        </div>

        {/* ACTIONS: SHARE & WISHLIST */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#DDDDDD] bg-white text-xs font-bold text-[#222222] hover:bg-[#F7F7F7] transition-all shadow-2xs"
          >
            {copiedShare ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4 text-[#FF385C]" />
            )}
            <span>{copiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>

          <FavoriteButton hallId={hall.id} hallName={hall.name} size="md" variant="inline" />
        </div>
      </div>

      {/* 3. IMAGE GALLERY */}
      <HallGallery
        images={hall.images}
        coverImageUrl={hall.coverImageUrl}
        hallName={hall.name}
      />

      {/* 4. MAIN TWO-COLUMN CONTENT & STICKY BOOKING CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-2">
        {/* LEFT COLUMN: OVERVIEW, AMENITIES, REVIEWS, LOCATION */}
        <main className="lg:col-span-2 flex flex-col gap-10">
          <HallOverview hall={hall} />
          <hr className="border-[#DDDDDD]" />
          <HallAmenities hall={hall} />
          <hr className="border-[#DDDDDD]" />
          <HallReviewsSection hallId={hall.id} />
          <hr className="border-[#DDDDDD]" />
          <HallLocationSection hall={hall} />
        </main>

        {/* RIGHT COLUMN: STICKY BOOKING WIDGET */}
        <div className="lg:col-span-1">
          <HallBookingCard hall={hall} />
        </div>
      </div>

      {/* 5. SIMILAR VENUES */}
      <hr className="border-[#DDDDDD] my-4" />
      <SimilarHallsSection
        currentHallId={hall.id}
        city={hall.city || hall.location.split(',')[0]}
      />
    </div>
  );
};

