import type { FC, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'flat' | 'outline';
  interactive?: boolean;
}

export const Card: FC<CardProps> = ({
  children,
  variant = 'default',
  interactive = false,
  className,
  onClick,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white border border-[#DDDDDD] shadow-xs hover:shadow-md transition-all duration-200',
    flat: 'bg-[#F7F7F7] border border-transparent',
    outline: 'bg-white border border-[#DDDDDD]',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl overflow-hidden flex flex-col text-left',
        variantStyles[variant],
        interactive || onClick
          ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
          : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardMedia: FC<{
  src: string;
  alt?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  children?: ReactNode;
  className?: string;
}> = ({ src, alt = '', aspectRatio = 'video', children, className }) => {
  const aspectMap = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[16/9]',
  };

  return (
    <div className={cn('relative w-full overflow-hidden bg-[#F7F7F7]', aspectMap[aspectRatio], className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      {children ? <div className="absolute inset-0 p-3 pointer-events-none">{children}</div> : null}
    </div>
  );
};

export const CardHeader: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('p-4 sm:p-5 border-b border-[#DDDDDD]', className)}>{children}</div>;

export const CardContent: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('p-4 sm:p-5 flex-1', className)}>{children}</div>;

export const CardFooter: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('p-4 sm:p-5 border-t border-[#DDDDDD] bg-[#F7F7F7]/50 mt-auto', className)}>
    {children}
  </div>
);
