import { DEFAULT_MAKE } from './makes';
export const TRANSMISSIONS = ['Manual', 'Automatic'] as const;
export const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Project'] as const;
export const SERVICE_HISTORY = ['Full service history', 'Partial service history', 'No service history'] as const;
export const DRIVETRAINS = ['FWD', 'RWD', 'AWD', '4WD'] as const;
export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'] as const;
export const BODY_TYPES = ['Sedan', 'Hatchback', 'Coupe', 'Convertible', 'SUV', 'Bakkie', 'Wagon', 'Van', 'Minibus'] as const;
export const DOCUMENTS = ['Service book', 'Registration papers', 'Roadworthy certificate', 'Original invoices'] as const;
// Order matches the backend ListingCondition enum (1-based), used for non-vehicle listings.
export const ITEM_CONDITIONS = ['New', 'Used', 'Refurbished', 'For parts'] as const;

// `type` matches the backend ListingType enum.
export const CATEGORIES = [
  { key: 'Vehicle', title: 'Vehicle', blurb: 'A complete car or bakkie', type: 1 },
  { key: 'Part', title: 'Part', blurb: 'Body, brakes, suspension, interior…', type: 2 },
  { key: 'Engine', title: 'Engine', blurb: 'Complete engines and long blocks', type: 3 },
  { key: 'Wheel', title: 'Wheels', blurb: 'Rims, with or without tyres', type: 4 },
  { key: 'Other', title: 'Other', blurb: 'Anything else car-related', type: 5 },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 50 }, (_, i) => String(CURRENT_YEAR - i));

export const MAX_PHOTOS = 20;

export interface ListingDraft {
  category: CategoryKey;
  // Vehicle
  make: string;
  model: string;
  year: string;
  transmission: string;
  mileage: string;
  condition: string;
  engine: string;
  drivetrain: string;
  fuelType: string;
  bodyType: string;
  colour: string;
  serviceHistory: string;
  modifications: string;
  documents: string[];
  // Part / engine / wheel
  itemCondition: string;
  brand: string;
  itemName: string;
  partNumber: string;
  engineCode: string;
  displacement: string;
  kilowatts: string;
  diameter: string;
  width: string;
  offset: string;
  boltPattern: string;
  material: string;
  quantity: string;
  compatMake: string;
  compatModel: string;
  compatYearFrom: string;
  compatYearTo: string;
  // Shared
  location: string;
  photos: File[];
  price: string;
  negotiable: boolean;
  title: string;
  description: string;
}

export const emptyDraft: ListingDraft = {
  category: 'Vehicle',
  make: DEFAULT_MAKE,
  model: '',
  year: YEARS[0],
  transmission: TRANSMISSIONS[0],
  mileage: '',
  condition: CONDITIONS[1],
  engine: '',
  drivetrain: DRIVETRAINS[0],
  fuelType: FUEL_TYPES[0],
  bodyType: BODY_TYPES[0],
  colour: '',
  serviceHistory: SERVICE_HISTORY[0],
  modifications: '',
  documents: [],
  itemCondition: ITEM_CONDITIONS[1],
  brand: '',
  itemName: '',
  partNumber: '',
  engineCode: '',
  displacement: '',
  kilowatts: '',
  diameter: '',
  width: '',
  offset: '',
  boltPattern: '',
  material: '',
  quantity: '4',
  compatMake: '',
  compatModel: '',
  compatYearFrom: '',
  compatYearTo: '',
  location: '',
  photos: [],
  price: '',
  negotiable: true,
  title: '',
  description: '',
};

export type StepKey = 'category' | 'details' | 'photos' | 'history' | 'price' | 'review';

export interface StepMeta {
  key: StepKey;
  title: string;
  subtitle: string;
}

const DETAILS: Record<CategoryKey, { title: string; subtitle: string }> = {
  Vehicle: { title: 'Vehicle details', subtitle: 'Make, model, year' },
  Part: { title: 'Part details', subtitle: 'What it is and what it fits' },
  Engine: { title: 'Engine details', subtitle: 'Specs and compatibility' },
  Wheel: { title: 'Wheel details', subtitle: 'Size, fitment and quantity' },
  Other: { title: 'Item details', subtitle: 'Where the item is' },
};

export const stepsFor = (category: CategoryKey): StepMeta[] => [
  { key: 'category', title: 'Category', subtitle: 'What are you selling?' },
  { key: 'details', ...DETAILS[category] },
  { key: 'photos', title: 'Photos', subtitle: `Up to ${MAX_PHOTOS} images` },
  ...(category === 'Vehicle'
    ? [{ key: 'history' as const, title: 'Condition & history', subtitle: 'Service, mods, docs' }]
    : []),
  { key: 'price', title: 'Price & description', subtitle: 'Set your ask' },
  { key: 'review', title: 'Review & publish', subtitle: 'Check and go live' },
];

const positive = (value: string) => Number(value) > 0;

const yearRangeValid = (draft: ListingDraft) =>
  (draft.compatYearFrom === '' || positive(draft.compatYearFrom)) &&
  (draft.compatYearTo === '' || positive(draft.compatYearTo)) &&
  (draft.compatYearFrom === '' ||
    draft.compatYearTo === '' ||
    Number(draft.compatYearFrom) <= Number(draft.compatYearTo));

const detailsValid = (draft: ListingDraft) => {
  switch (draft.category) {
    case 'Vehicle':
      return (
        draft.model.trim() !== '' &&
        draft.engine.trim() !== '' &&
        draft.colour.trim() !== '' &&
        draft.mileage !== '' &&
        Number(draft.mileage) >= 0
      );
    case 'Part':
      return draft.itemName.trim() !== '' && yearRangeValid(draft);
    case 'Engine':
      return draft.brand.trim() !== '' && draft.itemName.trim() !== '' && yearRangeValid(draft);
    case 'Wheel':
      return (
        positive(draft.diameter) &&
        positive(draft.width) &&
        Number.isInteger(Number(draft.quantity)) &&
        positive(draft.quantity) &&
        yearRangeValid(draft)
      );
    default:
      return true;
  }
};

export const isStepValid = (step: StepKey, draft: ListingDraft) => {
  switch (step) {
    case 'details':
      return detailsValid(draft);
    case 'photos':
      return draft.photos.length > 0;
    case 'price':
      return Number(draft.price) > 0 && draft.title.trim() !== '';
    default:
      return true;
  }
};
