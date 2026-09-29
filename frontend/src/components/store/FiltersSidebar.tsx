import { ChevronDown, Car } from 'lucide-react';

const PAGE_SIZES = [20, 50, 100];

interface FiltersSidebarProps {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

const FiltersSidebar = ({ pageSize, onPageSizeChange }: FiltersSidebarProps) => {
  return (
    <aside className="flex w-full flex-col gap-4 lg:w-64 lg:shrink-0">
      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-xl">
        <p className="font-display text-sm tracking-wide text-neutral-200">
          Price range
        </p>
        <div className="mt-4 h-1 w-full rounded-full bg-white/10">
          <div className="relative h-1 w-3/5 rounded-full bg-amber-300/70">
            <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full border-2 border-black bg-white" />
            <span className="absolute -left-1.5 -top-1.5 h-4 w-4 rounded-full border-2 border-black bg-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
          <span>R30,000</span>
          <span>R450,000</span>
        </div>
      </div>

      <button
        type="button"
        className="flex items-center justify-between rounded-3xl border border-white/8 bg-white/[0.03] px-5 py-4 backdrop-blur-xl transition-colors hover:border-white/20"
      >
        <span className="font-display text-sm tracking-wide text-neutral-200">
          Year
        </span>
        <ChevronDown size={16} className="text-neutral-500" />
      </button>

      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-xl">
        <p className="font-display text-sm tracking-wide text-neutral-200">
          Transmission
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {['Manual', 'Automatic'].map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-sm text-neutral-300"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-transparent accent-amber-300"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="flex items-center justify-between rounded-3xl border border-white/8 bg-white/[0.03] px-5 py-4 backdrop-blur-xl transition-colors hover:border-white/20"
      >
        <span className="font-display text-sm tracking-wide text-neutral-200">
          Location
        </span>
        <ChevronDown size={16} className="text-neutral-500" />
      </button>

      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-xl">
        <p className="font-display text-sm tracking-wide text-neutral-200">
          Cards per page
        </p>
        <div className="mt-3 flex gap-2">
          {PAGE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onPageSizeChange(size)}
              className={`flex-1 rounded-full border px-3 py-1.5 font-display text-xs tracking-wide transition-colors ${
                size === pageSize
                  ? 'bg-white text-black'
                  : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 hidden items-center gap-2 text-xs text-neutral-600 lg:flex">
        <Car size={14} />
        Verified garage history on every listing
      </div>
    </aside>
  );
};

export default FiltersSidebar;
