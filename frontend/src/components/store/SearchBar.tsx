import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 backdrop-blur-xl transition-colors focus-within:border-amber-200/40">
        <Search size={18} className="text-neutral-500" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by make, model, or keyword"
          className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
        />
      </div>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-neutral-200 backdrop-blur-xl transition-colors hover:border-amber-200/40 hover:bg-white/[0.06]"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>
    </div>
  );
};

export default SearchBar;
