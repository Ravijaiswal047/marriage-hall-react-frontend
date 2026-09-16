import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../constants/marketing.content';
import { useSearchStore } from '@/store/search.store';
import { ROUTES } from '@/lib/constants/routes';
import { useCities } from '../hooks/useCities';
import { Badge } from '@/components/ui/Badge';

export const DestinationSection: FC = () => {
  const navigate = useNavigate();
  const setFilter = useSearchStore((state) => state.setFilter);
  const { data: apiCities } = useCities();

  const handleCityClick = (city: string) => {
    setFilter('city', city);
    navigate(ROUTES.HALLS);
  };

  return (
    <section className="py-12 sm:py-16 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <Badge variant="primary" size="sm" className="mb-2">
            Top Destinations
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
            Popular Wedding Cities
          </h2>
          <p className="text-sm text-[#717171] mt-1">
            Explore verified banquets and wedding halls across India's top wedding hubs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.HALLS)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF385C] hover:text-[#E31C5F] group"
        >
          <span>View All Cities</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* DESTINATION CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_DESTINATIONS.map((item) => {
          const isBackendAvailable = apiCities?.some(
            (c) => c.toLowerCase() === item.city.toLowerCase()
          );

          return (
            <div
              key={item.id}
              onClick={() => handleCityClick(item.city)}
              className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[4/3] bg-[#222222]"
            >
              <img
                src={item.image}
                alt={`${item.city} wedding venues`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-black tracking-tight text-white group-hover:text-[#FF385C] transition-colors">
                    {item.city}
                  </h3>
                  {isBackendAvailable ? (
                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-gray-300 line-clamp-1 mb-3">
                  {item.tagline}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.venueCountText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

