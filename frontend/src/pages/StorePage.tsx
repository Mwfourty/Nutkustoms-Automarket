import { Search as SearchIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import SearchBar from '../components/store/SearchBar';
import CategoryPills, { type Category } from '../components/store/CategoryPills';
import CarOfTheWeek from '../components/store/CarOfTheWeek';
import FilterBar from '../components/store/FilterBar';
import ListingCard from '../components/store/ListingCard';
import ListingRow from '../components/store/ListingRow';
import Pagination from '../components/store/Pagination';
import Footer from '../components/store/Footer';
import {
  DEFAULT_FILTERS,
  filterAndSort,
  hasActiveFilters,
  type SortKey,
  type StoreFilters,
  type ViewMode,
} from '../components/store/storeFilters';
import { useStoreListings } from '../hooks/useStoreListings';

const SECTIONS = ['Cars', 'Parts', 'Wheels', 'Engines', 'Other'] as const;

const StorePage = () => {
  const { listings: allListings, savedIds, loading, error, notice, toggleSave } =
    useStoreListings();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [filters, setFilters] = useState<StoreFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>('newest');
  const [view, setView] = useState<ViewMode>('grid');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const listings = useMemo(
    () => filterAndSort(allListings, { search, category, filters, sort }),
    [allListings, search, category, filters, sort],
  );

  const locations = useMemo(() => allListings.map((l) => l.location), [allListings]);

  const featured = useMemo(
    () =>
      allListings
        .filter((l) => l.verifiedHistory)
        .sort((a, b) => a.listedDaysAgo - b.listedDaysAgo)
        .slice(0, 8),
    [allListings],
  );

  const browsing = category !== 'All' || search.trim() !== '' || hasActiveFilters(filters);
  const totalPages = Math.max(1, Math.ceil(listings.length / pageSize));
  const pagedListings = listings.slice((page - 1) * pageSize, page * pageSize);

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const changeCategory = (value: Category) => {
    setCategory(value);
    setPage(1);
  };
  const changeFilters = (value: StoreFilters) => {
    setFilters(value);
    setPage(1);
  };
  const changeSort = (value: SortKey) => {
    setSort(value);
    setPage(1);
  };
  const changePageSize = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  return (
    <>
        <main className="mx-auto w-full max-w-[1700px] flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <section className={browsing ? 'mb-6' : 'mb-10 pt-6 text-center'}>
            {!browsing && (
              <>
                <h1 className="font-display text-4xl font-semibold tracking-wide text-white sm:text-5xl light:text-neutral-900">
                  Find your next build
                </h1>
                <p className="mx-auto mt-3 flex max-w-xl items-center justify-center gap-2 text-sm text-neutral-400 light:text-neutral-600">
                  <ShieldCheck size={15} className="text-amber-300 light:text-amber-600" />
                  Cars, parts, wheels and engines with verified garage history.
                </p>
              </>
            )}
            <div className={browsing ? '' : 'mx-auto mt-8 max-w-3xl text-left'}>
              <SearchBar value={search} onChange={changeSearch} />
            </div>
          </section>

          {!browsing && (
            <div className="mb-10">
              <CarOfTheWeek />
            </div>
          )}

          <div className="mb-4">
            <CategoryPills active={category} onChange={changeCategory} />
          </div>

          <div className="mb-8">
            <FilterBar
              filters={filters}
              onFiltersChange={changeFilters}
              onReset={() => changeFilters(DEFAULT_FILTERS)}
              sort={sort}
              onSortChange={changeSort}
              view={view}
              onViewChange={setView}
              pageSize={pageSize}
              onPageSizeChange={changePageSize}
              count={listings.length}
              locations={locations}
              showViewControls={browsing}
            />
          </div>

          {notice && (
            <p role="status" className="mb-4 text-sm text-amber-300 light:text-amber-700">
              {notice}
            </p>
          )}

          {loading ? (
            <p className="py-24 text-center text-sm text-neutral-500">Loading listings…</p>
          ) : error ? (
            <p className="py-24 text-center text-sm text-rose-400">{error}</p>
          ) : browsing ? (
            listings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-24 text-neutral-500">
                <SearchIcon size={28} strokeWidth={1.5} />
                <p className="text-sm">No listings match your search.</p>
              </div>
            ) : (
              <>
                <div
                  className={
                    view === 'grid'
                      ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                      : 'flex flex-col gap-4'
                  }
                >
                  {pagedListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      layout={view}
                      saved={savedIds.has(listing.id)}
                      onToggleSave={(next) => void toggleSave(listing, next)}
                    />
                  ))}
                </div>
                <div className="mt-10">
                  <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
              </>
            )
          ) : (
            <div className="flex flex-col gap-10">
              {allListings.length === 0 && (
                <p className="py-16 text-center text-sm text-neutral-500">
                  No listings yet. Be the first to sell something!
                </p>
              )}
              <ListingRow
                title="Featured"
                icon={Sparkles}
                listings={featured}
                savedIds={savedIds}
                onToggleSave={(l, next) => void toggleSave(l, next)}
              />
              {SECTIONS.map((section) => (
                <ListingRow
                  key={section}
                  title={section}
                  listings={listings.filter((l) => l.category === section).slice(0, 10)}
                  onSeeAll={section === 'Other' ? undefined : () => changeCategory(section)}
                  savedIds={savedIds}
                  onToggleSave={(l, next) => void toggleSave(l, next)}
                />
              ))}
            </div>
          )}
        </main>

        <Footer />
    </>
  );
};

export default StorePage;
