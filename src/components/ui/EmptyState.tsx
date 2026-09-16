import type { FC, ReactNode } from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  icon = <SearchX className="w-10 h-10 text-[#717171]" />,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#F7F7F7] rounded-2xl border border-dashed border-[#DDDDDD]">
      <div className="p-4 bg-white rounded-full shadow-xs mb-4">
        {icon}
      </div>
      <h3 className="text-base font-bold text-[#222222] mb-1">{title}</h3>
      {description ? (
        <p className="text-xs text-[#717171] max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="flex items-center gap-3">
          {secondaryActionLabel && onSecondaryAction ? (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          ) : null}
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

