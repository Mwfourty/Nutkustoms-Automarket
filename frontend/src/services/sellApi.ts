import { apiRequest } from './apiClient';
import {
  BODY_TYPES,
  CATEGORIES,
  DRIVETRAINS,
  FUEL_TYPES,
  ITEM_CONDITIONS,
  type ListingDraft,
} from '../components/sell/listingDraft';

const CONDITION_USED = 2;

const text = (value: string) => value.trim() || null;
const num = (value: string) => (value.trim() === '' ? null : Number(value));
const enumValue = (options: readonly string[], value: string) => options.indexOf(value) + 1;

// Details the backend has no dedicated field for are kept in the description.
const buildDescription = (draft: ListingDraft) => {
  const isVehicle = draft.category === 'Vehicle';

  const extras = [
    isVehicle && `Condition: ${draft.condition}`,
    isVehicle && `Service history: ${draft.serviceHistory}`,
    isVehicle && draft.modifications.trim() && `Modifications: ${draft.modifications.trim()}`,
    isVehicle && draft.documents.length > 0 && `Documents: ${draft.documents.join(', ')}`,
    draft.negotiable && 'Price is negotiable',
  ].filter(Boolean);

  return [draft.description.trim(), ...extras].filter(Boolean).join('\n\n');
};

const compatibility = (draft: ListingDraft) => ({
  compatibleMake: text(draft.compatMake),
  compatibleModel: text(draft.compatModel),
  compatibleYearFrom: num(draft.compatYearFrom),
  compatibleYearTo: num(draft.compatYearTo),
});

const detailsFor = (draft: ListingDraft) => {
  const empty = { vehicle: null, part: null, engine: null, wheel: null };

  switch (draft.category) {
    case 'Vehicle':
      return {
        ...empty,
        vehicle: {
          make: draft.make,
          model: draft.model.trim(),
          year: Number(draft.year),
          mileage: Number(draft.mileage),
          engine: draft.engine.trim(),
          transmission: draft.transmission,
          kilowatts: null,
          drivetrain: enumValue(DRIVETRAINS, draft.drivetrain),
          fuelType: enumValue(FUEL_TYPES, draft.fuelType),
          bodyType: enumValue(BODY_TYPES, draft.bodyType),
          colour: draft.colour.trim(),
          vin: null,
        },
      };
    case 'Part':
      return {
        ...empty,
        part: {
          name: draft.itemName.trim(),
          partNumber: text(draft.partNumber),
          description: text(draft.description),
          manufacturer: text(draft.brand),
          condition: draft.itemCondition,
          ...compatibility(draft),
        },
      };
    case 'Engine':
      return {
        ...empty,
        engine: {
          manufacturer: draft.brand.trim(),
          model: draft.itemName.trim(),
          engineCode: text(draft.engineCode),
          displacement: num(draft.displacement),
          kilowatts: num(draft.kilowatts),
          fuelType: enumValue(FUEL_TYPES, draft.fuelType),
          mileage: num(draft.mileage),
          ...compatibility(draft),
        },
      };
    case 'Wheel':
      return {
        ...empty,
        wheel: {
          brand: text(draft.brand),
          model: text(draft.itemName),
          diameter: Number(draft.diameter),
          width: Number(draft.width),
          offset: num(draft.offset),
          boltPattern: text(draft.boltPattern),
          material: text(draft.material),
          colour: text(draft.colour),
          quantity: Number(draft.quantity),
          ...compatibility(draft),
        },
      };
    default:
      return empty;
  }
};

const createListing = (draft: ListingDraft) => {
  const category = CATEGORIES.find((c) => c.key === draft.category)!;
  const condition =
    draft.category === 'Vehicle' ? CONDITION_USED : enumValue(ITEM_CONDITIONS, draft.itemCondition);

  return apiRequest<{ listingId: string }>('/Listings', {
    method: 'POST',
    body: JSON.stringify({
      title: draft.title.trim(),
      description: buildDescription(draft),
      price: Number(draft.price),
      type: category.type,
      condition,
      location: text(draft.location),
      ...detailsFor(draft),
    }),
  });
};

const uploadPhoto = (listingId: string, file: File) => {
  const form = new FormData();
  form.append('file', file);

  return apiRequest(`/Listings/${listingId}/images/upload`, {
    method: 'POST',
    body: form,
  });
};

export interface PublishResult {
  listingId: string;
  failedPhotos: number;
}

// Creates the draft listing, uploads photos one by one, then publishes it.
export const publishListing = async (draft: ListingDraft): Promise<PublishResult> => {
  const { listingId } = await createListing(draft);

  let failedPhotos = 0;
  for (const photo of draft.photos) {
    try {
      await uploadPhoto(listingId, photo);
    } catch {
      failedPhotos += 1;
    }
  }

  await apiRequest(`/Listings/${listingId}/publish`, { method: 'PUT' });

  return { listingId, failedPhotos };
};
