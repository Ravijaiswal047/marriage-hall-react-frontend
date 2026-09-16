import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, PlusCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

export const Sidebar: FC = () => {
  const navItems = [
    { label: 'Overview', to: ROUTES.VENDOR_DASHBOARD, icon: LayoutDashboard },
    { label: 'My Halls', to: ROUTES.VENDOR_HALLS, icon: Building2 },
    { label: 'Add New Hall', to: ROUTES.CREATE_HALL, icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#DDDDDD] min-h-[calc(100vh-4rem)] p-4 text-left">
      <div className="text-xs font-bold text-[#717171] uppercase tracking-wider mb-4 px-3">
        Vendor Portal
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors',
                isActive
                  ? 'bg-[#FFF0F3] text-[#FF385C]'
                  : 'text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]'
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
