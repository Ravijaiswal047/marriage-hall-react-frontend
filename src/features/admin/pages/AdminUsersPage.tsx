import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Mail, Phone, Info, Calendar } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { vendorApi } from '@/features/vendor/api/vendor.api';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '../components/StatusBadge';

export const AdminUsersPage: FC = () => {
  const { user } = useAuth();

  // Fetch Booking Host records as real customer contact evidence
  const { data: bookings = [] } = useQuery({
    queryKey: ['adminUserBookings'],
    queryFn: vendorApi.getVendorBookings,
  });

  // Extract distinct customers from bookings
  const customerMap = new Map<string, { name: string; phone: string; count: number }>();
  bookings.forEach((b) => {
    const existing = customerMap.get(b.customerName) || { name: b.customerName, phone: b.customerPhone, count: 0 };
    customerMap.set(b.customerName, { ...existing, count: existing.count + 1 });
  });
  const customersList = Array.from(customerMap.values());

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold text-[#222222]">User Governance & Directory</h1>
        </div>
      </div>

      {/* BACKEND DEFICIT DOCUMENTATION BANNER */}
      <div className="p-5 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3 text-xs text-sky-900 shadow-2xs">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <strong className="text-sm font-bold">Backend Architecture Specification Boundary</strong>
          <p className="leading-relaxed">
            User authentication and profile storage are embedded within <code>auth-service</code>. A standalone User Management microservice or public user directory endpoints (e.g. <code>GET /api/users</code> or admin role management) are <strong>BACKEND API NOT AVAILABLE</strong> in the current Spring Boot stack. Below is verified user data extracted from authenticated sessions and active booking records.
          </p>
        </div>
      </div>

      {/* ACTIVE ADMIN USER PROFILE */}
      <div className="p-6 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatarUrl} name={user?.name || 'Admin'} size="lg" />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#222222]">{user?.name}</h2>
              <StatusBadge status={user?.role || 'ADMIN'} type="role" />
            </div>
            <span className="text-xs text-[#717171] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF385C]" /> {user?.email}
            </span>
            {user?.phone && (
              <span className="text-xs text-[#717171] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#717171]" /> {user?.phone}
              </span>
            )}
          </div>
        </div>

        <Badge variant="secondary" size="sm" className="bg-[#F7F7F7] text-[#222222]">
          User Reference ID: {user?.id.substring(0, 8)}...
        </Badge>
      </div>

      {/* REAL CUSTOMER CONTACT EVIDENCE TABLE */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#222222] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-600" />
          Verified Reservation Customers ({customersList.length})
        </h2>

        {customersList.length === 0 ? (
          <div className="p-6 text-center bg-[#F7F7F7] rounded-2xl border border-[#DDDDDD] text-xs text-[#717171]">
            No booking customer records retrieved yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customersList.map((c, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[#222222] text-sm">{c.name}</span>
                  <span className="text-[#717171] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#FF385C]" /> {c.phone}
                  </span>
                </div>

                <Badge variant="secondary" size="sm" className="bg-[#FFF0F3] text-[#FF385C] border-none font-bold">
                  {c.count} Reservations
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

