import type { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements?: number;
  pageSize?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
  className?: string;
}

export const AdminPagination: FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize = 12,
  onPageChange,
  onPageSizeChange,
  className,
}) => {
  if (totalPages <= 1 && totalElements === undefined) return null;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#717171] pt-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {totalElements !== undefined && (
          <span>
            Showing <strong className="text-[#222222]">{Math.min(currentPage * pageSize + 1, totalElements)}</strong> to{' '}
            <strong className="text-[#222222]">{Math.min((currentPage + 1) * pageSize, totalElements)}</strong> of{' '}
            <strong className="text-[#222222]">{totalElements}</strong> items
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-[#DDDDDD] rounded-lg text-xs font-bold text-[#222222]"
            >
              {[10, 12, 20, 50].map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage <= 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 text-xs font-bold"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="px-3 font-bold text-[#222222]">
          Page {currentPage + 1} of {Math.max(1, totalPages)}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 text-xs font-bold"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

