import {
  type FC,
  type ReactNode,
  useState,
  useRef,
  useEffect,
  useId,
} from 'react';
import { cn } from '@/lib/utils/cn';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: (props: {
    isOpen: boolean;
    toggle: () => void;
    ariaProps: {
      'aria-expanded': boolean;
      'aria-haspopup': boolean;
      'aria-controls': string;
    };
  }) => ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const menuId = `${generatedId}-dropdown-menu`;

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
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

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {trigger({
        isOpen,
        toggle,
        ariaProps: {
          'aria-expanded': isOpen,
          'aria-haspopup': true,
          'aria-controls': menuId,
        },
      })}

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          tabIndex={-1}
          className={cn(
            'absolute top-full mt-1.5 z-40 w-48 bg-white rounded-xl border border-[#DDDDDD] shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150',
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            className
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                if (item.onClick) item.onClick();
                close();
              }}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-left transition-colors',
                item.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-[#222222] hover:bg-[#F7F7F7]',
                item.disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : '',
                'focus-visible:outline-none focus-visible:bg-[#F7F7F7]'
              )}
            >
              {item.icon ? (
                <span className="inline-flex shrink-0 text-[#717171]">
                  {item.icon}
                </span>
              ) : null}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

