import { Car, Cog, Disc, LayoutGrid, Wrench } from 'lucide-react';

const CATEGORIES = [
  { label: 'All', icon: LayoutGrid },
  { label: 'Cars', icon: Car },
  { label: 'Parts', icon: Wrench },
  { label: 'Wheels', icon: Disc },
  { label: 'Engines', icon: Cog },
] as const;

export type Category = (typeof CATEGORIES)[number]['label'];

interface CategoryPillsProps {
  active: Category;
  onChange: (category: Category) => void;
}

/**
 * Mobile: five equal cells, icon above label, all visible at once (no scrolling, no clipping).
 * sm and up: the original inline pill row.
 *
 * If you ever pass about six categories, the cells get too narrow on a 360px phone.
 * Switch the mobile layout to a horizontal scroll row at that point.
 */
const CategoryPills = ({ active, onChange }: CategoryPillsProps) => {
  return (
    <div
      role="group"
      aria-label="Category"
      className="grid w-full grid-cols-5 gap-1 rounded-2xl border border-white/8 bg-white/[0.03] p-1 backdrop-blur-xl sm:flex sm:w-fit sm:items-center sm:rounded-xl sm:p-1.5 light:border-black/10 light:bg-black/[0.03]"
    >
      {CATEGORIES.map(({ label, icon: Icon }) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(label)}
            className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-2 font-display text-[11px] tracking-wide transition-colors sm:shrink-0 sm:flex-row sm:gap-2 sm:rounded-lg sm:px-4 sm:text-sm ${
              isActive
                ? 'bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.15)] light:bg-neutral-900 light:text-white light:shadow-[0_4px_16px_rgba(0,0,0,0.15)]'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white light:text-neutral-500 light:hover:bg-black/5 light:hover:text-neutral-900'
            }`}
          >
            <Icon size={16} className="shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;