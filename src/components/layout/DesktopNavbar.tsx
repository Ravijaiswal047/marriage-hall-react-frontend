import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Heart } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { useFavoritesStore } from '@/features/favorites/hooks/useFavorites';
import { SearchCapsule } from './SearchCapsule';
import { AccountMenu } from './AccountMenu';
import { Badge } from '../ui/Badge';

export const DesktopNavbar: FC = () => {
  const navigate = useNavigate();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const favoriteCount = favoriteIds.length;

  return (
    <div className="hidden lg:flex items-center justify-between h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* BRAND LOGO */}
      <Link
        to={ROUTES.HOME}
        className="flex items-center gap-2 font-black text-2xl text-[#FF385C] tracking-tight shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C] focus-visible:rounded-lg"
      >
        <Building2 className="w-7 h-7 text-[#FF385C] transition-transform duration-200 group-hover:scale-110" />
        <span>MarriageHall</span>
      </Link>

      {/* SEARCH CAPSULE */}
      <div className="flex-1 flex justify-center max-w-2xl px-4">
        <SearchCapsule />
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={() => navigate('/auth/signup?role=VENDOR')}
          className="text-xs font-bold text-[#222222] hover:bg-[#F7F7F7] px-3.5 py-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]"
        >
          List your venue
        </button>

        <button
          type="button"
          onClick={() => navigate('/halls')}
          title="Saved Wishlist"
          aria-label={`Wishlist, ${favoriteCount} saved venues`}
          className="relative p-2 text-[#222222] hover:bg-[#F7F7F7] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]"
        >
          <Heart className="w-5 h-5" />
          {favoriteCount > 0 ? (
            <span className="absolute -top-1 -right-1">
              <Badge variant="primary" size="sm" className="px-1.5 py-0 text-[10px]">
                {favoriteCount}
              </Badge>
            </span>
          ) : null}
        </button>

        <AccountMenu />
      </div>
    </div>
  );
};

