import type { FC, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const DetailDrawer: FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className={cn(
          'w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-[#DDDDDD] flex items-center justify-between bg-[#F7F7F7]">
          <div className="flex flex-col text-left">
            <h3 className="text-base font-bold text-[#222222]">{title}</h3>
            {subtitle && <span className="text-xs text-[#717171]">{subtitle}</span>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#717171] hover:text-[#222222] hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 flex-1 overflow-y-auto text-left flex flex-col gap-4">
          {children}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-[#DDDDDD] bg-[#F7F7F7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#DDDDDD] rounded-xl text-xs font-bold text-[#222222] hover:bg-gray-100"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};

