import type { FC } from 'react';
import { Mail, Phone, ShieldCheck, Hash, UserCheck } from 'lucide-react';
import type { User } from '@/types/common';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export interface CustomerProfileCardProps {
  user: User | null;
  className?: string;
}

export const CustomerProfileCard: FC<CustomerProfileCardProps> = ({
  user,
  className,
}) => {
  if (!user) return null;

  return (
    <Card
      className={cn(
        'p-6 bg-white border border-[#DDDDDD] rounded-2xl shadow-xs flex flex-col gap-5 text-left',
        className
      )}
    >
      <div className="flex items-center gap-4 pb-4 border-b border-[#DDDDDD]">
        <Avatar src={user.avatarUrl} name={user.name} size="lg" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#222222]">{user.name}</h3>
            <Badge variant="primary" size="sm" className="rounded-full">
              {user.role}
            </Badge>
          </div>
          <span className="text-xs text-[#717171]">{user.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 p-3 bg-[#F7F7F7] rounded-xl">
          <Mail className="w-4 h-4 text-[#FF385C]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#717171] uppercase font-bold">Email Address</span>
            <span className="font-semibold text-[#222222]">{user.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-[#F7F7F7] rounded-xl">
          <Phone className="w-4 h-4 text-[#FF385C]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#717171] uppercase font-bold">Phone Contact</span>
            <span className="font-semibold text-[#222222]">
              {user.phone || 'Not Provided'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-[#F7F7F7] rounded-xl">
          <Hash className="w-4 h-4 text-[#FF385C]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#717171] uppercase font-bold">Account ID</span>
            <span className="font-mono font-semibold text-[#222222] truncate max-w-[150px]">
              {user.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-[#F7F7F7] rounded-xl">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#717171] uppercase font-bold">Status</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Member
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

