import type { FC, ReactNode } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-red-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    info: <Info className="w-6 h-6 text-sky-600" />,
  };

  const buttonVariantMap = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    info: 'bg-[#FF385C] hover:bg-[#E31C5F] text-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4 text-left pt-2">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-gray-100 rounded-2xl shrink-0">{iconMap[variant]}</div>
          <div className="flex flex-col gap-1 text-xs text-[#717171]">
            {typeof description === 'string' ? (
              <p className="text-sm font-medium text-[#222222]">{description}</p>
            ) : (
              description
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#DDDDDD]">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className={buttonVariantMap[variant]}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
