import { ArrowRight, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import ListingCard from './ListingCard';
import type { StoreListing } from '../../types/listing';

interface ListingRowProps {
  title: string;
  icon?: LucideIcon;
  listings: StoreListing[];
  onSeeAll?: () => void;
}

const ListingRow = ({ title, icon: Icon, listings, onSeeAll }: ListingRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (listings.length === 0) return null;

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg text-white light:text-neutral-900">
          {Icon && <Icon size={18} className="text-amber-300 light:text-amber-600" />}
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {onSeeAll && (
            <button
              type="button"
              onClick={onSeeAll}
              className="flex items-center gap-1 text-xs font-medium text-neutral-300 hover:text-white light:text-neutral-600 light:hover:text-neutral-900"
            >
              See all <ArrowRight size={12} />
            </button>
          )}
          {(['Scroll left', 'Scroll right'] as const).map((label, i) => {
            const Icon = i === 0 ? ChevronLeft : ChevronRight;
            return (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => scrollBy(i === 0 ? -1 : 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 transition-colors hover:border-white/25 light:border-black/10 light:bg-white/80 light:text-neutral-600 light:hover:border-black/25"
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>
      </div>
      <div ref={scrollRef} className="-mx-2 -mt-4 flex snap-x gap-5 overflow-x-auto overflow-y-hidden px-2 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {listings.map((listing) => (
          <div key={listing.id} className="w-72 shrink-0 snap-start">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListingRow;
