import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Phone, ShieldCheck, Building2, Calendar, Info } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { hallsApi } from '@/features/halls/api/halls.api';
import { useVendorDashboard } from '../hooks/useVendorDashboard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export const VendorProfilePage: FC = () => {
  const { user } = useAuth();
  const { bookings } = useVendorDashboard();

  const { data: halls = [] } = useQuery({
    queryKey: ['vendorHalls', user?.id],
    queryFn: () => hallsApi.getVendorHalls(user?.id || ''),
    enabled: Boolean(user?.id),
  });

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-[#FF385C]" />
          <h1 className="text-xl font-bold text-[#222222]">Vendor Business Profile</h1>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="p-6 bg-white border border-[#DDDDDD] rounded-3xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatarUrl} name={user?.name || 'Vendor Owner'} size="xl" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#222222]">{user?.name}</h2>
              <Badge variant="secondary" size="sm" className="bg-[#FFF0F3] text-[#FF385C] border-none font-bold">
                {user?.role || 'VENDOR'}
              </Badge>
            </div>
            <span className="text-xs text-[#717171] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF385C]" />
              {user?.email}
            </span>
            {user?.phone && (
              <span className="text-xs text-[#717171] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FF385C]" />
                {user?.phone}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F7F7F7] px-4 py-2.5 rounded-2xl border border-[#DDDDDD] w-full md:w-auto">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex flex-col text-xs">
            <span className="font-bold text-[#222222]">Verified Marketplace Partner</span>
            <span className="text-[10px] text-[#717171]">Authorized venue listing provider</span>
          </div>
        </div>
      </div>

      {/* PERFORMANCE OVERVIEW SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#717171] uppercase tracking-wider">
              Active Venues
            </span>
            <span className="text-2xl font-black text-[#222222]">
              {halls.length}
            </span>
            <span className="text-[11px] text-[#717171]">Listed on MarriageHall.com</span>
          </div>
          <div className="p-3 bg-[#FFF0F3] rounded-2xl">
            <Building2 className="w-6 h-6 text-[#FF385C]" />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#717171] uppercase tracking-wider">
              Total Reservations
            </span>
            <span className="text-2xl font-black text-[#222222]">
              {bookings.length}
            </span>
            <span className="text-[11px] text-[#717171]">Customer venue requests</span>
          </div>
          <div className="p-3 bg-[#FFF0F3] rounded-2xl">
            <Calendar className="w-6 h-6 text-[#FF385C]" />
          </div>
        </div>
      </div>

      {/* PROFILE MANAGEMENT CONTRACT NOTICE */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3 text-xs text-sky-900">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <strong className="font-bold">Account & Business Profile Info</strong>
          <span>
            Your account credentials and business contact information are synchronized with the central Authentication Service. Account security updates or email modifications can be performed via support requests.
          </span>
        </div>
      </div>
    </div>
  );
};

