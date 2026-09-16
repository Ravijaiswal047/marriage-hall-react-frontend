import { type FC, useEffect, type ReactNode, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}) => {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store triggering element to restore focus on close
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Prevent body background scrolling
    document.body.style.overflow = 'hidden';

    // Auto-focus dialog container or close button
    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Keyboard Focus Trap (Tab & Shift+Tab)
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'));

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to saved element
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 motion-reduce:animate-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] focus:outline-none',
          maxWidthMap[maxWidth]
        )}
      >
        {title || showCloseButton ? (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDDDDD] bg-white sticky top-0 z-10 shrink-0">
            <div>
              {title ? (
                <h3
                  id={titleId}
                  className="text-lg font-bold text-[#222222] tracking-tight"
                >
                  {title}
                </h3>
              ) : null}
              {subtitle ? (
                <p className="text-xs text-[#717171] mt-0.5">{subtitle}</p>
              ) : null}
            </div>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 text-[#222222] rounded-full hover:bg-[#F7F7F7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C]"
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
