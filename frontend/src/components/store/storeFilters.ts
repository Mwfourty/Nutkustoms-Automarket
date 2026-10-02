import type { Category } from './CategoryPills';
import { LOCATIONS } from '../../lib/mockListings';
import type { StoreListing } from '../../types/listing';

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'mileage-asc';
export type ViewMode = 'grid' | 'list';

export interface StoreFilters {
  transmission: string;
  location: string;
  yearFrom: string;
  maxPrice: string;
  verifiedOnly: boolean;
}

export const DEFAULT_FILTERS: StoreFilters = {
  transmission: 'Any',
  location: 'Any',
  yearFrom: 'Any',
  maxPrice: 'Any',
  verifiedOnly: false,
};

export interface Option {
  value: string;
  label: string;
}

export const TRANSMISSION_OPTIONS: Option[] = [
  { value: 'Any', label: 'Any transmission' },
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
];

export const LOCATION_OPTIONS: Option[] = [
  { value: 'Any', label: 'Any location' },
  ...LOCATIONS.map((l) => ({ value: l, label: l })),
];

export const YEAR_OPTIONS: Option[] = [
  { value: 'Any', label: 'Any year' },
  ...['2020', '2010', '2000', '1990'].map((y) => ({ value: y, label: `${y}+` })),
];

export const PRICE_OPTIONS: Option[] = [
  { value: 'Any', label: 'Any price' },
  ...[50000, 100000, 250000, 500000].map((p) => ({
    value: String(p),
    label: `Up to R${p.toLocaleString('en-ZA')}`,
  })),
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'mileage-asc', label: 'Lowest mileage' },
];

export const PAGE_SIZES = [20, 50, 100];

export const hasActiveFilters = (f: StoreFilters) =>
  f.verifiedOnly ||
  f.transmission !== 'Any' ||
  f.location !== 'Any' ||
  f.yearFrom !== 'Any' ||
  f.maxPrice !== 'Any';

interface Query {
  search: string;
  category: Category;
  filters: StoreFilters;
  sort: SortKey;
}

export const filterAndSort = (
  listings: StoreListing[],
  { search, category, filters, sort }: Query,
) => {
  const q = search.trim().toLowerCase();
  const result = listings.filter(
    (l) =>
      (category === 'All' || l.category === category) &&
      (!q || l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)) &&
      (filters.transmission === 'Any' || l.transmission === filters.transmission) &&
      (filters.location === 'Any' || l.location === filters.location) &&
      (filters.yearFrom === 'Any' || l.year >= Number(filters.yearFrom)) &&
      (filters.maxPrice === 'Any' || l.price <= Number(filters.maxPrice)) &&
      (!filters.verifiedOnly || l.verifiedHistory),
  );

  const compare: Record<SortKey, (a: StoreListing, b: StoreListing) => number> = {
    newest: (a, b) => a.listedDaysAgo - b.listedDaysAgo,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'mileage-asc': (a, b) => a.mileageKm - b.mileageKm,
  };
  return result.sort(compare[sort]);
};
