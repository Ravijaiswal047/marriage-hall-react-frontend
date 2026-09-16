import type { FC } from 'react';
import { User, ShieldCheck, Mail, Phone, Calendar, Hash } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export const CustomerProfilePage: FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-2 pb-3 border-b border-[#DDDDDD]">
        <User className="w-5 h-5 text-[#FF385C]" />
        <h1 className="text-xl font-bold text-[#222222]">My Profile Details</h1>
      </div>

      <Card className="p-6 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-6 shadow-xs">
        <div className="flex items-center gap-4 pb-4 border-b border-[#DDDDDD]">
          <Avatar src={user.avatarUrl} name={user.name} size="lg" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#222222]">{user.name}</h2>
              <Badge variant="primary" size="sm" className="rounded-full">
                {user.role}
              </Badge>
            </div>
            <span className="text-xs text-[#717171]">{user.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3 p-4 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
            <Mail className="w-5 h-5 text-[#FF385C]" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#717171]">Email Address</span>
              <span className="font-bold text-[#222222] text-sm">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
            <Phone className="w-5 h-5 text-[#FF385C]" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#717171]">Phone Number</span>
              <span className="font-bold text-[#222222] text-sm">
                {user.phone || 'Not Provided'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
            <Hash className="w-5 h-5 text-[#FF385C]" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#717171]">User Reference ID</span>
              <span className="font-mono font-bold text-[#222222] text-xs">
                {user.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
            <Calendar className="w-5 h-5 text-[#FF385C]" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#717171]">Account Type</span>
              <span className="font-bold text-[#222222] text-sm">Customer Portal Account</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#FFF0F3] rounded-xl border border-[#FF385C]/20 text-xs text-[#717171] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authentication credentials secured via microservices auth-service</span>
          </div>
          <Badge variant="success" size="sm" className="rounded-full">Active</Badge>
        </div>
      </Card>
    </div>
  );
};

