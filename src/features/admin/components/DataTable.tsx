import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No Records Found',
  emptyDescription = 'There are no items matching the current filter criteria.',
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  className,
}: DataTableProps<T>): React.ReactElement {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-[#DDDDDD] rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white border border-[#DDDDDD] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2 shadow-2xs">
        <div className="p-3 bg-[#F7F7F7] rounded-full text-[#717171] mb-1">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#222222]">{emptyTitle}</h3>
        <p className="text-xs text-[#717171] max-w-sm">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full bg-white border border-[#DDDDDD] rounded-2xl overflow-x-auto shadow-2xs',
        className
      )}
    >
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[#DDDDDD] bg-[#F7F7F7] text-[#717171] font-bold uppercase tracking-wider text-[11px]">
            {columns.map((col) => {
              const isSorted = sortColumn === col.key;
              const isLeft = !col.align || col.align === 'left';
              const isCenter = col.align === 'center';
              const isRight = col.align === 'right';

              return (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                  className={cn(
                    'p-3.5 select-none',
                    col.sortable && 'cursor-pointer hover:text-[#222222]',
                    isLeft && 'text-left',
                    isCenter && 'text-center',
                    isRight && 'text-right',
                    col.className
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-1.5',
                      isCenter && 'justify-center',
                      isRight && 'justify-end'
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[#717171]">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#FF385C]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#FF385C]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDDDDD]">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              className={cn(
                'hover:bg-[#F7F7F7]/60 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((col) => {
                const isLeft = !col.align || col.align === 'left';
                const isCenter = col.align === 'center';
                const isRight = col.align === 'right';

                return (
                  <td
                    key={col.key}
                    className={cn(
                      'p-3.5 text-[#222222] align-middle font-medium',
                      isLeft && 'text-left',
                      isCenter && 'text-center',
                      isRight && 'text-right',
                      col.className
                    )}
                  >
                    {col.accessor
                      ? col.accessor(item)
                      : (item as Record<string, unknown>)[col.key] !== undefined
                      ? String((item as Record<string, unknown>)[col.key])
                      : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

