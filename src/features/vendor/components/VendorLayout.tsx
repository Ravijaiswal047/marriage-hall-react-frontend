import type { FC, ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  MessageSquare,
  DollarSign,
  User,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export interface VendorLayoutProps {
  children?: ReactNode;
}

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard, end: true },
  { label: 'My Venues', path: '/vendor/halls', icon: Building2, end: false },
  { label: 'Vendor Bookings', path: '/vendor/bookings', icon: Calendar, end: false },
  { label: 'Venue Reviews', path: '/vendor/reviews', icon: MessageSquare, end: false },
  { label: 'Financials & Revenue', path: '/vendor/payments', icon: DollarSign, end: false },
  { label: 'Business Profile', path: '/vendor/profile', icon: User, end: false },
];

export const VendorLayout: FC<VendorLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="py-6 flex flex-col gap-6 text-left max-w-7xl mx-auto px-4 sm:px-6">
      {/* VENDOR PORTAL TOP HEADER */}
      <div className="p-6 bg-white border border-[#DDDDDD] rounded-3xl shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatarUrl} name={user?.name || 'Vendor Owner'} size="lg" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight">
                {user?.name || 'Vendor Portal'}
              </h1>
              <Badge variant="secondary" size="sm" className="bg-[#FFF0F3] text-[#FF385C] border-none font-bold">
                Vendor Account
              </Badge>
            </div>
            <span className="text-xs text-[#717171] font-medium">{user?.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/vendor/halls/new">
            <Button size="sm" className="text-xs font-bold" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Add New Venue
            </Button>
          </NavLink>
          <LogoutButton variant="outline" size="sm" />
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP SIDEBAR / MOBILE NAVIGATION TABS */}
        <aside className="lg:col-span-1 bg-white border border-[#DDDDDD] rounded-2xl p-3 shadow-xs sticky top-24">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 select-none">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0',
                      isActive
                        ? 'bg-[#FFF0F3] text-[#FF385C] shadow-2xs'
                        : 'text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* MAIN OUTLET CONTENT */}
        <main className="lg:col-span-3 min-w-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

