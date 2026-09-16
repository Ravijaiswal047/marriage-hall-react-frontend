import type { FC, ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  MessageSquare,
  DollarSign,
  Users,
  Server,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface AdminLayoutProps {
  children?: ReactNode;
}

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Venues Catalog', path: '/admin/halls', icon: Building2, end: false },
  { label: 'Platform Bookings', path: '/admin/bookings', icon: Calendar, end: false },
  { label: 'Customer Reviews', path: '/admin/reviews', icon: MessageSquare, end: false },
  { label: 'Financials & Revenue', path: '/admin/payments', icon: DollarSign, end: false },
  { label: 'User Governance', path: '/admin/users', icon: Users, end: false },
  { label: 'System Monitor', path: '/admin/system', icon: Server, end: false },
];

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="py-6 flex flex-col gap-6 text-left max-w-7xl mx-auto px-4 sm:px-6">
      {/* ADMIN TOP HEADER BANNER */}
      <div className="p-6 bg-white border border-[#DDDDDD] rounded-3xl shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatarUrl} name={user?.name || 'Platform Administrator'} size="lg" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight">
                Platform Administration
              </h1>
              <Badge variant="danger" size="sm" className="font-bold">
                ADMIN ROLE
              </Badge>
            </div>
            <span className="text-xs text-[#717171] font-medium">
              Signed in as: <strong className="text-[#222222]">{user?.email}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Gateway Operational (:8081)
          </div>
          <LogoutButton variant="outline" size="sm" />
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP SIDEBAR / MOBILE NAVIGATION TABS */}
        <aside className="lg:col-span-1 bg-white border border-[#DDDDDD] rounded-2xl p-3 shadow-xs sticky top-24">
          <div className="text-[10px] font-bold text-[#717171] uppercase px-3 py-1.5 mb-1 hidden lg:block">
            Admin Console
          </div>
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
                        ? 'bg-red-50 text-red-600 shadow-2xs'
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
