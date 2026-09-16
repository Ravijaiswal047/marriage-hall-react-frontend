import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Sparkles } from 'lucide-react';
import { HERO_CONTENT } from '../constants/marketing.content';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/Button';
import { SearchCapsule } from '@/components/layout/SearchCapsule';

export const HeroSection: FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-[#222222] text-white my-4 shadow-xl">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_CONTENT.bgImage}
          alt="Luxury wedding venue backdrop"
          className="w-full h-full object-cover opacity-35 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-[#222222]/60 to-transparent" />
      </div>

      {/* HERO CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 md:py-28 text-center flex flex-col items-center gap-6">
        {/* BRAND TAG BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-[#FF385C]" />
          <span>India's Premier Wedding Venue Marketplace</span>
        </div>

        {/* HERO TITLE */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.15]">
          {HERO_CONTENT.title}
        </h1>

        {/* HERO SUBTITLE */}
        <p className="text-base sm:text-lg text-gray-200 max-w-2xl font-normal leading-relaxed">
          {HERO_CONTENT.subtitle}
        </p>

        {/* EMBEDDED SEARCH CAPSULE (DESKTOP / TABLET) */}
        <div className="w-full max-w-3xl my-4 hidden sm:block">
          <SearchCapsule />
        </div>

        {/* CTAS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(ROUTES.HALLS)}
            leftIcon={<Search className="w-5 h-5" />}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {HERO_CONTENT.primaryCta}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/auth/signup?role=VENDOR')}
            leftIcon={<Building2 className="w-5 h-5" />}
            className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white min-w-[200px]"
          >
            {HERO_CONTENT.secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  );
};

