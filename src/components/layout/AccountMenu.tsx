import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  LogOut,
  Building2,
  Calendar,
  LayoutDashboard,
  PlusCircle,
  Heart,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/lib/constants/routes';
import { Dropdown, type DropdownItem } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';

export const AccountMenu: FC = () => {
  const { user, isAuthenticated, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getMenuItems = (): DropdownItem[] => {
    if (!isAuthenticated) {
      return [
        {
          id: 'login',
          label: 'Log In',
          onClick: () => navigate(ROUTES.LOGIN),
        },
        {
          id: 'signup',
          label: 'Sign Up',
          onClick: () => navigate(ROUTES.SIGNUP),
        },
        {
          id: 'list-venue',
          label: 'List Your Venue',
          icon: <Building2 className="w-4 h-4" />,
          onClick: () => navigate('/auth/signup?role=VENDOR'),
        },
      ];
    }

    const items: DropdownItem[] = [
      {
        id: 'account-dashboard',
        label: 'My Account',
        icon: <User className="w-4 h-4" />,
        onClick: () => navigate(ROUTES.ACCOUNT),
      },
      {
        id: 'my-bookings',
        label: 'My Bookings',
        icon: <Calendar className="w-4 h-4" />,
        onClick: () => navigate(ROUTES.ACCOUNT_BOOKINGS),
      },
      {
        id: 'favorites',
        label: 'Saved Wishlist',
        icon: <Heart className="w-4 h-4" />,
        onClick: () => navigate(ROUTES.ACCOUNT_FAVORITES),
      },
    ];

    if (role === 'VENDOR' || role === 'ADMIN') {
      items.push(
        {
          id: 'vendor-dashboard',
          label: 'Vendor Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          onClick: () => navigate(ROUTES.VENDOR_DASHBOARD),
        },
        {
          id: 'vendor-halls',
          label: 'My Venues',
          icon: <Building2 className="w-4 h-4" />,
          onClick: () => navigate(ROUTES.VENDOR_HALLS),
        },
        {
          id: 'create-hall',
          label: 'Add New Venue',
          icon: <PlusCircle className="w-4 h-4" />,
          onClick: () => navigate(ROUTES.CREATE_HALL),
        }
      );
    } else {
      items.push({
        id: 'list-venue',
        label: 'List Your Venue',
        icon: <Building2 className="w-4 h-4" />,
        onClick: () => navigate('/auth/signup?role=VENDOR'),
      });
    }

    items.push({
      id: 'logout',
      label: 'Log Out',
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: handleLogout,
    });

    return items;
  };

  return (
    <Dropdown
      align="right"
      trigger={({ toggle, ariaProps }) => (
        <button
          type="button"
          onClick={toggle}
          {...ariaProps}
          aria-label="User menu"
          className="flex items-center gap-2 p-1.5 pl-3 border border-[#DDDDDD] rounded-full hover:shadow-md transition-all duration-150 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]"
        >
          <Menu className="w-4 h-4 text-[#222222]" />
          <Avatar
            src={user?.avatarUrl}
            name={user?.name}
            size="sm"
          />
        </button>
      )}
      items={getMenuItems()}
    />
  );
};
