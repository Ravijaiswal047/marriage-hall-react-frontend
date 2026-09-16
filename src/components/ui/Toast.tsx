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
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-200',
    error: 'border-red-200',
    info: 'border-blue-200',
    warning: 'border-amber-200',
  };

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 w-full max-w-sm p-4 bg-white border rounded-2xl shadow-xl transition-all duration-200 animate-in slide-in-from-bottom-5',
        borderMap[toast.type]
      )}
    >
      {iconMap[toast.type]}
      <div className="flex-1 text-left">
        <h5 className="text-xs font-bold text-[#222222]">{toast.title}</h5>
        {toast.message ? (
          <p className="text-xs text-[#717171] mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        ) : null}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 text-[#717171] hover:text-[#222222] rounded-full hover:bg-[#F7F7F7] transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full">
          <ToastItem toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};

