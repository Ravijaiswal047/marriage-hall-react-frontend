import { type FC, useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  showStatus = false,
  isOnline = false,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n?: string) => {
    if (!n) return '';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizeMap = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const initials = getInitials(name);

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden bg-[#F7F7F7] text-[#222222] border border-[#DDDDDD] font-semibold select-none',
          sizeMap[size],
          className
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name || 'User avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <UserIcon className="w-1/2 h-1/2 text-[#717171]" />
        )}
      </div>

      {showStatus ? (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            statusSizeMap[size],
            isOnline ? 'bg-emerald-500' : 'bg-gray-400'
          )}
          aria-label={isOnline ? 'Online' : 'Offline'}
        />
      ) : null}
    </div>
  );
};

