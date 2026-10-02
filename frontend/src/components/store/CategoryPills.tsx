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

const CategoryPills = ({ active, onChange }: CategoryPillsProps) => {
  return (
    <div className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/8 bg-white/[0.03] p-1.5 backdrop-blur-xl light:border-black/10 light:bg-black/[0.03]">
      {CATEGORIES.map(({ label, icon: Icon }) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 font-display text-sm tracking-wide transition-colors ${
              isActive
                ? 'bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.15)] light:bg-neutral-900 light:text-white light:shadow-[0_4px_16px_rgba(0,0,0,0.15)]'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white light:text-neutral-500 light:hover:bg-black/5 light:hover:text-neutral-900'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;

