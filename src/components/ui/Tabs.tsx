import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Badge } from './Badge';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 overflow-x-auto scrollbar-none',
        variant === 'underline'
          ? 'border-b border-[#DDDDDD] pb-px'
          : 'bg-[#F7F7F7] p-1 rounded-xl',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        if (variant === 'pills') {
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shrink-0',
                isActive
                  ? 'bg-white text-[#222222] shadow-xs'
                  : 'text-[#717171] hover:text-[#222222] hover:bg-white/50',
                tab.disabled ? 'opacity-40 cursor-not-allowed' : '',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]'
              )}
            >
              {tab.icon ? <span className="inline-flex">{tab.icon}</span> : null}
              <span>{tab.label}</span>
              {tab.badge !== undefined ? (
                <Badge
                  variant={isActive ? 'primary' : 'neutral'}
                  size="sm"
                >
                  {tab.badge}
                </Badge>
              ) : null}
            </button>
          );
        }

        // Underline variant
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors border-b-2 shrink-0 -mb-px',
              isActive
                ? 'border-[#222222] text-[#222222]'
                : 'border-transparent text-[#717171] hover:text-[#222222] hover:border-[#DDDDDD]',
              tab.disabled ? 'opacity-40 cursor-not-allowed' : '',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]'
            )}
          >
            {tab.icon ? <span className="inline-flex">{tab.icon}</span> : null}
            <span>{tab.label}</span>
            {tab.badge !== undefined ? (
              <Badge
                variant={isActive ? 'primary' : 'neutral'}
                size="sm"
              >
                {tab.badge}
              </Badge>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

