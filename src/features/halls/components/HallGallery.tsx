import { useState, useEffect, useCallback } from 'react';
import type { FC, MouseEvent } from 'react';
import { Grid, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DEFAULT_HALL_IMAGE, HallImageCarousel } from './HallImageCarousel';
import { cn } from '@/lib/utils/cn';

export interface HallGalleryProps {
  images?: string[];
  coverImageUrl?: string;
  hallName: string;
  className?: string;
}

export const HallGallery: FC<HallGalleryProps> = ({
  images: rawImages,
  coverImageUrl,
  hallName,
  className,
}) => {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Combine images logically
  const allImages = useCallback(() => {
    const list: string[] = [];
    if (coverImageUrl) list.push(coverImageUrl);
    if (rawImages && rawImages.length > 0) {
      rawImages.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : [DEFAULT_HALL_IMAGE];
  }, [coverImageUrl, rawImages])();

  const handleOpenFullscreen = (index: number) => {
    setActiveImageIndex(index);
    setIsFullscreenOpen(true);
  };

  const handlePrev = useCallback((e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback((e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isFullscreenOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullscreenOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen, handlePrev, handleNext]);

  const displayGridImages = allImages.slice(0, 5);
  const totalCount = allImages.length;

  return (
    <div className={cn('relative', className)}>
      {/* 1. MOBILE VIEW (SWIPER CAROUSEL) */}
      <div className="md:hidden rounded-2xl overflow-hidden shadow-xs">
        <HallImageCarousel images={allImages} alt={hallName} aspectRatio="wide">
          <div className="flex justify-end w-full pointer-events-none">
            <button
              type="button"
              onClick={() => handleOpenFullscreen(0)}
              className="px-3 py-1 bg-black/70 backdrop-blur-md text-white rounded-full text-xs font-semibold pointer-events-auto flex items-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>1 / {totalCount}</span>
            </button>
          </div>
        </HallImageCarousel>
      </div>

      {/* 2. DESKTOP VIEW (5-IMAGE COLLAGE GRID) */}
      <div className="hidden md:grid grid-cols-4 gap-2 rounded-2xl overflow-hidden relative group max-h-[420px]">
        {/* MAIN HERO IMAGE (SPAN 2 COLS, SPAN 2 ROWS) */}
        <div
          onClick={() => handleOpenFullscreen(0)}
          className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden bg-gray-100 h-[420px]"
        >
          <img
            src={displayGridImages[0] || DEFAULT_HALL_IMAGE}
            alt={`${hallName} Main`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* 4 SECONDARY GRID IMAGES */}
        {displayGridImages.slice(1, 5).map((imgUrl, idx) => {
          const actualIndex = idx + 1;
          return (
            <div
              key={idx}
              onClick={() => handleOpenFullscreen(actualIndex)}
              className="relative cursor-pointer overflow-hidden bg-gray-100 h-[206px]"
            >
              <img
                src={imgUrl}
                alt={`${hallName} Photo ${actualIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          );
        })}

        {/* SHOW ALL PHOTOS OVERLAY BUTTON */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenFullscreen(0)}
          leftIcon={<Grid className="w-4 h-4 text-[#222222]" />}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-[#222222] hover:bg-white font-bold border-[#DDDDDD] shadow-md transition-transform hover:scale-105"
        >
          Show all photos ({totalCount})
        </Button>
      </div>

      {/* 3. FULLSCREEN LIGHTBOX MODAL */}
      <Modal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        maxWidth="full"
        showCloseButton={false}
      >
        <div className="flex flex-col h-full bg-[#111111] text-white -m-6 p-4 sm:p-6 relative select-none">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white/90">{hallName}</span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/70">
                Photo {activeImageIndex + 1} of {totalCount}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreenOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* MAIN LIGHTBOX IMAGE DISPLAY */}
          <div className="flex-1 flex items-center justify-center relative min-h-[300px] my-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={allImages[activeImageIndex] || DEFAULT_HALL_IMAGE}
              alt={`${hallName} Lightbox ${activeImageIndex + 1}`}
              className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
            />

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* BOTTOM THUMBNAIL STRIP */}
          {totalCount > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 border-t border-white/10 shrink-0 max-w-4xl mx-auto">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    'w-16 h-12 rounded-md overflow-hidden shrink-0 transition-all border-2',
                    index === activeImageIndex
                      ? 'border-[#FF385C] scale-105 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  )}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

