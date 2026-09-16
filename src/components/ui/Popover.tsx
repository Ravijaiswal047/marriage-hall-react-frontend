import {
  type FC,
  type ReactNode,
  useState,
  useRef,
  useEffect,
  useId,
} from 'react';
import { cn } from '@/lib/utils/cn';

export interface PopoverProps {
  trigger: (props: {
    isOpen: boolean;
    toggle: () => void;
    ariaProps: {
      'aria-expanded': boolean;
      'aria-haspopup': boolean;
      'aria-controls': string;
    };
  }) => ReactNode;
  children: (props: { close: () => void }) => ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export const Popover: FC<PopoverProps> = ({
  trigger,
  children,
  align = 'left',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const contentId = `${generatedId}-popover-content`;

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const alignStyles = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
    center: 'left-1/2 -translate-x-1/2 origin-top',
  };

  return (
    <div ref={popoverRef} className="relative inline-block text-left">
      {trigger({
        isOpen,
        toggle,
        ariaProps: {
          'aria-expanded': isOpen,
          'aria-haspopup': true,
          'aria-controls': contentId,
        },
      })}

      {isOpen ? (
        <div
          id={contentId}
          className={cn(
            'absolute top-full mt-2 z-40 bg-white rounded-2xl border border-[#DDDDDD] shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150',
            alignStyles[align],
            className
          )}
        >
          {children({ close })}
        </div>
      ) : null}
    </div>
  );
};

