import { useEffect, useMemo, useState } from 'react';
import LightRays from '../components/effects/LightRays';
import Navbar from '../components/store/Navbar';
import SearchBar from '../components/store/SearchBar';
import CategoryPills, {
  type Category,
} from '../components/store/CategoryPills';
import FiltersSidebar from '../components/store/FiltersSidebar';
import ListingCard from '../components/store/ListingCard';
import Pagination from '../components/store/Pagination';
import Footer from '../components/store/Footer';
import { mockListings } from '../lib/mockListings';

const StorePage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const listings = useMemo(() => {
    return mockListings.filter((listing) => {
      const matchesCategory =
        category === 'All' || listing.category === category;
      const matchesSearch = listing.title
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const totalPages = Math.max(1, Math.ceil(listings.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [category, search, pageSize]);

  const pagedListings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return listings.slice(start, start + pageSize);
  }, [listings, page, pageSize]);

  return (
    <div className="relative min-h-screen bg-black">
      <div className="pointer-events-none fixed inset-0 h-[70vh]">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fff3c4"
          raysSpeed={0.6}
          lightSpread={0.7}
          rayLength={1.8}
          followMouse
          mouseInfluence={0.08}
          fadeDistance={1.1}
          saturation={0.9}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto w-full max-w-[1700px] flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-6">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="mb-8">
            <CategoryPills active={category} onChange={setCategory} />
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <FiltersSidebar pageSize={pageSize} onPageSizeChange={setPageSize} />

            <div className="flex-1">
              <div className="max-h-[75vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {pagedListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};


export default StorePage;
