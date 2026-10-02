import { useEffect, useState, useRef } from 'react';
import type { FC } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useUIStore, type ToastMessage } from '@/store/ui.store';
import { cn } from '@/lib/utils/cn';

export const ToastItem: FC<{ toast: ToastMessage; onClose: (id: string) => void }> = ({
  toast,
  onClose,
}) => {
  const duration = toast.duration ?? 4000;
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      onClose(toast.id);
    }, remainingTimeRef.current);

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentRemaining = Math.max(0, remainingTimeRef.current - elapsed);
      const newProgress = (currentRemaining / duration) * 100;
      setProgress(newProgress);

      if (currentRemaining > 0 && !isHovered) {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    };
  }, [toast.id, duration, isHovered, onClose]);

  const iconBadgeMap = {
    success: (
      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs">
        <CheckCircle2 className="w-5 h-5" />
      </div>
    ),
    error: (
      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-xs">
        <AlertCircle className="w-5 h-5" />
      </div>
    ),
    info: (
      <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0 shadow-xs">
        <Info className="w-5 h-5" />
      </div>
    ),
    warning: (
      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 shadow-xs">
        <AlertTriangle className="w-5 h-5" />
      </div>
    ),
  };

  const progressBarColorMap = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-sky-500',
    warning: 'bg-amber-500',
  };

  return (
    <div
      role="alert"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex items-start gap-3.5 w-full max-w-md p-4 bg-white/95 backdrop-blur-md border border-[#EBEBEB] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] animate-in fade-in slide-in-from-bottom-5 zoom-in-95'
      )}
    >
      {/* STATUS ICON BADGE */}
      {iconBadgeMap[toast.type]}

      {/* CONTENT AREA */}
      <div className="flex-1 text-left min-w-0 pr-1">
        <h5 className="text-xs sm:text-sm font-bold text-[#222222] tracking-tight leading-snug">
          {toast.title}
        </h5>
        {toast.message ? (
          <p className="text-xs text-[#717171] mt-0.5 leading-relaxed break-words">
            {toast.message}
          </p>
        ) : null}

        {/* OPTIONAL INLINE ACTION BUTTON */}
        {toast.action ? (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              onClose(toast.id);
            }}
            className="mt-2 text-xs font-extrabold text-[#FF385C] hover:text-[#D90B3E] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{toast.action.label}</span>
          </button>
        ) : null}
      </div>

      {/* DISMISS BUTTON */}
      <button
        onClick={() => onClose(toast.id)}
        className="p-1.5 text-[#717171] hover:text-[#222222] rounded-full hover:bg-[#F7F7F7] transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer focus:outline-none"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* PROGRESS COUNTDOWN TIMER BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2F2F2] overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-75 ease-linear',
            progressBarColorMap[toast.type]
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2.5 max-w-md w-[calc(100%-2rem)] sm:w-auto items-center pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full sm:w-[400px]">
          <ToastItem toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};
