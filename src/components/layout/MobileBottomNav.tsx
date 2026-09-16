import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Heart, Calendar, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/store/auth.store';
import { useFavoritesStore } from '@/features/favorites/hooks/useFavorites';
import { cn } from '@/lib/utils/cn';

export const MobileBottomNav: FC = () => {
  const { isAuthenticated, role } = useAuthStore();
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);

  const isVendorOrAdmin = role === 'VENDOR' || role === 'ADMIN';

  const navItems = [
    { label: 'Explore', to: ROUTES.HALLS, icon: Search },
    {
      label: 'Wishlist',
      to: ROUTES.HALLS,
      icon: Heart,
      badge: favoriteCount > 0 ? favoriteCount : undefined,
    },
    {
      label: 'Bookings',
      to: isAuthenticated ? ROUTES.MY_BOOKINGS : ROUTES.LOGIN,
      icon: Calendar,
    },
    ...(isVendorOrAdmin
      ? [{ label: 'Vendor', to: ROUTES.VENDOR_DASHBOARD, icon: LayoutDashboard }]
      : [{ label: 'Profile', to: isAuthenticated ? ROUTES.MY_BOOKINGS : ROUTES.LOGIN, icon: UserIcon }]),
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDDDDD] h-16 flex items-center justify-around px-2 select-none shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.to === ROUTES.HALLS}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-0.5 w-full py-1 text-[10px] font-bold transition-colors relative',
              isActive ? 'text-[#FF385C]' : 'text-[#717171] hover:text-[#222222]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]'
            )
          }
        >
          <div className="relative">
            <item.icon className="w-5 h-5" />
            {item.badge ? (
              <span className="absolute -top-1.5 -right-2.5 bg-[#FF385C] text-white text-[9px] font-extrabold px-1 rounded-full">
                {item.badge}
              </span>
            ) : null}
          </div>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

