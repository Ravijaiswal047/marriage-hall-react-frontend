import type { FC, ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
  isLoading?: boolean;
}

export const Dialog: FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  const iconMap = {
    danger: <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />,
    primary: <CheckCircle2 className="w-6 h-6 text-[#FF385C] shrink-0" />,
  };

  const buttonVariant =
    variant === 'danger'
      ? 'danger'
      : variant === 'warning'
      ? 'primary'
      : 'primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="flex flex-col gap-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
          <div className="p-3 bg-[#F7F7F7] rounded-full shrink-0">
            {iconMap[variant]}
          </div>
          <div>
            <h4 className="text-base font-bold text-[#222222]">{title}</h4>
            <div className="text-xs text-[#717171] mt-1 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#DDDDDD]">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariant}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

