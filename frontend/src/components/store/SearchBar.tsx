import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl transition-colors focus-within:border-amber-200/40 light:border-black/10 light:bg-black/[0.03]">
        <Search size={18} className="text-neutral-500" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by make, model, or keyword"
          className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none light:text-neutral-900"
        />
      </div>
    </div>
  );
};

export default SearchBar;
