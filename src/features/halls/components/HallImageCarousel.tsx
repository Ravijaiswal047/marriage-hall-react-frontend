import { useState } from 'react';
import type { FC, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface HallImageCarouselProps {
  images?: string[];
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  children?: React.ReactNode;
}

export const DEFAULT_HALL_IMAGE =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';

export const HallImageCarousel: FC<HallImageCarouselProps> = ({
  images,
  alt,
  className,
  aspectRatio = 'video',
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const displayImages =
    images && images.length > 0 ? images : [DEFAULT_HALL_IMAGE];
  const hasMultiple = displayImages.length > 1;

  const handlePrev = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
    setImgError(false);
  };

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
    setImgError(false);
  };

  const handleDotClick = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(index);
    setImgError(false);
  };

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[16/10]',
    auto: 'h-full w-full',
  };

  const currentSrc = displayImages[currentIndex] || DEFAULT_HALL_IMAGE;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100 group select-none',
        aspectClasses[aspectRatio],
        className
      )}
    >
      {/* IMAGE OR FALLBACK */}
      {imgError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-[#717171] p-4 text-center">
          <ImageIcon className="w-8 h-8 mb-1 text-gray-400" />
          <span className="text-xs">{alt || 'Venue Image'}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={`${alt} ${currentIndex + 1}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      )}

      {/* OVERLAY CHILDREN (e.g. badges, wishlist icon) */}
      {children && (
        <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-10">
          {children}
        </div>
      )}

      {/* NAV ARROWS */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 text-[#222222] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-md z-20 pointer-events-auto"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 text-[#222222] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-md z-20 pointer-events-auto"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* DOT INDICATORS */}
      {hasMultiple && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-auto">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleDotClick(e, idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                'rounded-full transition-all duration-300',
                idx === currentIndex
                  ? 'w-4 h-1.5 bg-white shadow-xs'
                  : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
