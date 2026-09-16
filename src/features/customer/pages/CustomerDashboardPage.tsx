import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useMyBookings } from '@/features/booking/hooks/useMyBookings';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { CustomerProfileCard } from '../components/CustomerProfileCard';
import { CustomerStatsGrid } from '../components/CustomerStatsGrid';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const CustomerDashboardPage: FC = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading: isLoadingBookings } = useMyBookings();
  const { favoriteIds } = useFavorites();

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const upcomingBookings = bookings.filter(
    (b) => b.status !== 'CANCELLED' && new Date(b.bookingDate) >= new Date()
  );

  const statusVariantMap = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
  } as const;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* 1. STATS GRID */}
      <CustomerStatsGrid
        totalBookings={totalBookings}
        confirmedBookings={confirmedBookings}
        totalFavorites={favoriteIds.length}
        totalReviews={0}
      />

      {/* 2. UPCOMING BOOKINGS SECTION */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF385C]" />
            <h2 className="text-lg font-bold text-[#222222]">Upcoming Reservations</h2>
          </div>
          <Link to="/account/bookings">
            <Button variant="ghost" size="sm" className="text-xs text-[#FF385C] font-semibold">
              View All Bookings ({totalBookings})
            </Button>
          </Link>
        </div>

        {isLoadingBookings ? (
          <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ) : upcomingBookings.length === 0 ? (
          <div className="p-6 text-center bg-[#F7F7F7] rounded-2xl border border-[#DDDDDD] flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-[#717171]" />
            <h3 className="text-sm font-bold text-[#222222]">No Upcoming Events</h3>
            <p className="text-xs text-[#717171] max-w-sm">
              You don't have any upcoming hall reservations scheduled.
            </p>
            <Link to="/halls" className="mt-1">
              <Button size="sm" className="text-xs">
                Find Wedding Venues
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingBookings.slice(0, 2).map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariantMap[booking.status] || 'neutral'} size="sm">
                      {booking.status}
                    </Badge>
                    <span className="text-xs font-bold text-[#222222]">
                      {booking.eventType}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#222222] flex items-center gap-1.5 mt-1">
                    <Building2 className="w-4 h-4 text-[#FF385C]" />
                    {booking.customerName}'s Reservation
                  </span>
                  <span className="text-xs text-[#717171]">
                    Date: <strong className="text-[#222222]">{booking.bookingDate}</strong> ({booking.slot})
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm font-black text-[#FF385C]">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                  <Link to={`/account/bookings/${booking.id}`}>
                    <Button size="sm" variant="outline" className="text-xs font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. PROFILE DETAILS SUMMARY */}
      <div className="flex flex-col gap-3 pt-2">
        <h2 className="text-lg font-bold text-[#222222]">Profile Summary</h2>
        <CustomerProfileCard user={user} />
      </div>

      {/* 4. SAVED FAVORITES PREVIEW */}
      {favoriteIds.length > 0 && (
        <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#222222]">Saved Wishlist Venues</h3>
              <p className="text-xs text-[#717171]">
                You have {favoriteIds.length} saved wedding halls in your favorites.
              </p>
            </div>
          </div>
          <Link to="/account/favorites">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              View Wishlist
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

