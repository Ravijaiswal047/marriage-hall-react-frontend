import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { cn } from '@/lib/utils/cn';

export interface LogoutButtonProps {
  className?: string;
  variant?: 'outline' | 'ghost' | 'danger' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  showConfirmation?: boolean;
}

export const LogoutButton: FC<LogoutButtonProps> = ({
  className,
  variant = 'ghost',
  size = 'sm',
  showConfirmation = true,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setIsDialogOpen(false);
    navigate('/login', { replace: true });
  };

  const handleClick = () => {
    if (showConfirmation) {
      setIsDialogOpen(true);
    } else {
      handleConfirmLogout();
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        leftIcon={<LogOut className="w-4 h-4" />}
        className={cn('text-xs font-semibold', className)}
      >
        Log Out
      </Button>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out of your MarriageHall.com account?"
        confirmLabel="Log Out"
        cancelLabel="Stay Logged In"
        variant="danger"
      />
    </>
  );
};

