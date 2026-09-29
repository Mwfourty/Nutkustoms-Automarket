import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  const maxVisible = 4;
  const start = Math.max(1, Math.min(page - 1, totalPages - maxVisible + 1));
  const pages = Array.from(
    { length: Math.min(maxVisible, totalPages) },
    (_, index) => start + index,
  );
  const showLast = pages.length > 0 && pages[pages.length - 1] < totalPages;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => onChange(Math.max(1, page - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 transition-colors hover:border-white/25"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-sm transition-colors ${
            p === page
              ? 'bg-white text-black'
              : 'border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25'
          }`}
        >
          {p}
        </button>
      ))}

      {showLast && (
        <>
          <span className="px-1 text-neutral-500">…</span>
          <button
            type="button"
            onClick={() => onChange(totalPages)}
            className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-sm transition-colors ${
              page === totalPages
                ? 'bg-white text-black'
                : 'border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25'
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 transition-colors hover:border-white/25"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
