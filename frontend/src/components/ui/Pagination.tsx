import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageNumber,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  if (totalCount === 0) return null;

  const fromIndex = (pageNumber - 1) * pageSize + 1;
  const toIndex = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 rounded-b-xl">
      <div>
        Showing <span className="font-semibold text-slate-200">{fromIndex}</span> to{' '}
        <span className="font-semibold text-slate-200">{toIndex}</span> of{' '}
        <span className="font-semibold text-slate-200">{totalCount}</span> results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>

        <span className="px-2 text-slate-300 font-medium">
          Page {pageNumber} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
