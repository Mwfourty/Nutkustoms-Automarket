export const MAKES = ['BMW', 'Toyota', 'Honda', 'Nissan', 'Volkswagen', 'Mazda', 'Subaru', 'Other'] as const;
export const TRANSMISSIONS = ['Manual', 'Automatic'] as const;
export const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Project'] as const;
export const SERVICE_HISTORY = ['Full service history', 'Partial service history', 'No service history'] as const;
export const DOCUMENTS = ['Service book', 'Registration papers', 'Roadworthy certificate', 'Original invoices'] as const;

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 50 }, (_, i) => String(CURRENT_YEAR - i));

export const MAX_PHOTOS = 20;

export interface ListingDraft {
  make: string;
  model: string;
  year: string;
  transmission: string;
  mileage: string;
  condition: string;
  photos: File[];
  serviceHistory: string;
  modifications: string;
  documents: string[];
  price: string;
  negotiable: boolean;
  title: string;
  description: string;
}

export const emptyDraft: ListingDraft = {
  make: MAKES[0],
  model: '',
  year: YEARS[0],
  transmission: TRANSMISSIONS[0],
  mileage: '',
  condition: CONDITIONS[1],
  photos: [],
  serviceHistory: SERVICE_HISTORY[0],
  modifications: '',
  documents: [],
  price: '',
  negotiable: true,
  title: '',
  description: '',
};

export interface StepMeta {
  title: string;
  subtitle: string;
}

export const STEPS: StepMeta[] = [
  { title: 'Vehicle details', subtitle: 'Make, model, year' },
  { title: 'Photos', subtitle: `Up to ${MAX_PHOTOS} images` },
  { title: 'Condition & history', subtitle: 'Service, mods, docs' },
  { title: 'Price & description', subtitle: 'Set your ask' },
  { title: 'Review & publish', subtitle: 'Check and go live' },
];

export const isStepValid = (step: number, draft: ListingDraft) => {
  switch (step) {
    case 0:
      return draft.model.trim() !== '' && Number(draft.mileage) >= 0 && draft.mileage !== '';
    case 1:
      return draft.photos.length > 0;
    case 3:
      return Number(draft.price) > 0 && draft.title.trim() !== '';
    default:
      return true;
  }
};
