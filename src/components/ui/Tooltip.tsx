import { type FC, type ReactNode, useState, useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const handleMouseEnter = () => {
    const t = setTimeout(() => setIsVisible(true), delay);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  const positionStyles = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsVisible(true)}
      aria-describedby={isVisible ? tooltipId : undefined}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content ? (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1.5 text-[11px] font-semibold text-white bg-[#222222] rounded-lg shadow-md whitespace-nowrap pointer-events-none animate-in fade-in duration-150',
            positionStyles[position],
            className
          )}
        >
          {content}
        </div>
      ) : null}
    </div>
  );
};

