import { ChevronDown, LayoutGrid, List, RotateCcw, ShieldCheck } from 'lucide-react';
import {
  LOCATION_OPTIONS,
  PAGE_SIZES,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  TRANSMISSION_OPTIONS,
  YEAR_OPTIONS,
  hasActiveFilters,
  type Option,
  type SortKey,
  type StoreFilters,
  type ViewMode,
} from './storeFilters';

const CHIP =
  'relative flex items-center rounded-lg border text-xs backdrop-blur-xl transition-colors';
const CHIP_IDLE =
  'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 light:border-black/10 light:bg-white/80 light:text-neutral-700 light:hover:border-black/25';
const CHIP_ACTIVE =
  'border-amber-300/50 bg-amber-300/10 text-amber-200 light:border-amber-500/50 light:bg-amber-100 light:text-amber-800';

interface ChipSelectProps {
  value: string;
  options: Option[];
  active?: boolean;
  label: string;
  onChange: (value: string) => void;
}

const ChipSelect = ({ value, options, active = false, label, onChange }: ChipSelectProps) => (
  <label className={`${CHIP} ${active ? CHIP_ACTIVE : CHIP_IDLE}`}>
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer appearance-none bg-transparent py-2 pl-3 pr-8 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="text-black">
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown size={12} className="pointer-events-none absolute right-2.5" />
  </label>
);

interface FilterBarProps {
  filters: StoreFilters;
  onFiltersChange: (filters: StoreFilters) => void;
  onReset: () => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  count: number;
  showViewControls: boolean;
}

const FilterBar = ({
  filters,
  onFiltersChange,
  onReset,
  sort,
  onSortChange,
  view,
  onViewChange,
  pageSize,
  onPageSizeChange,
  count,
  showViewControls,
}: FilterBarProps) => {
  const set = <K extends keyof StoreFilters>(key: K, value: StoreFilters[K]) =>
    onFiltersChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ChipSelect label="Price" value={filters.maxPrice} options={PRICE_OPTIONS} active={filters.maxPrice !== 'Any'} onChange={(v) => set('maxPrice', v)} />
      <ChipSelect label="Year" value={filters.yearFrom} options={YEAR_OPTIONS} active={filters.yearFrom !== 'Any'} onChange={(v) => set('yearFrom', v)} />
      <ChipSelect label="Transmission" value={filters.transmission} options={TRANSMISSION_OPTIONS} active={filters.transmission !== 'Any'} onChange={(v) => set('transmission', v)} />
      <ChipSelect label="Location" value={filters.location} options={LOCATION_OPTIONS} active={filters.location !== 'Any'} onChange={(v) => set('location', v)} />

      <button
        type="button"
        aria-pressed={filters.verifiedOnly}
        onClick={() => set('verifiedOnly', !filters.verifiedOnly)}
        className={`${CHIP} gap-1.5 px-3 py-2 ${filters.verifiedOnly ? CHIP_ACTIVE : CHIP_IDLE}`}
      >
        <ShieldCheck size={13} />
        Verified history only
      </button>

      {hasActiveFilters(filters) && (
        <button type="button" onClick={onReset} className="flex items-center gap-1 px-2 text-xs text-neutral-500 hover:text-neutral-200 light:hover:text-neutral-900">
          <RotateCcw size={12} /> Reset
        </button>
      )}

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <span className="text-xs text-neutral-500">{count} results</span>
        <ChipSelect
          label="Sort by"
          value={sort}
          options={SORT_OPTIONS}
          onChange={(v) => onSortChange(v as SortKey)}
        />
        {showViewControls && (
          <>
            <ChipSelect
              label="Cards per page"
              value={String(pageSize)}
              options={PAGE_SIZES.map((s) => ({ value: String(s), label: `Show ${s}` }))}
              onChange={(v) => onPageSizeChange(Number(v))}
            />
            <div className={`${CHIP} ${CHIP_IDLE} p-0.5`}>
              {(['grid', 'list'] as const).map((mode) => {
                const Icon = mode === 'grid' ? LayoutGrid : List;
                return (
                  <button
                    key={mode}
                    type="button"
                    aria-label={`${mode} view`}
                    aria-pressed={view === mode}
                    onClick={() => onViewChange(mode)}
                    className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                      view === mode ? 'bg-white text-black light:bg-neutral-900 light:text-white' : ''
                    }`}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
