import { apiRequest } from './apiClient';
import type { PublicProfile } from './usersApi';

export const MOD_CATEGORY = {
  Engine: 1,
  Drivetrain: 2,
  Suspension: 3,
  Brakes: 4,
  WheelsAndTyres: 5,
  Exhaust: 6,
  Exterior: 7,
  Interior: 8,
  Electronics: 9,
  Other: 10,
} as const;

export const MOD_CATEGORY_LABEL: Record<number, string> = {
  1: 'Engine',
  2: 'Drivetrain',
  3: 'Suspension',
  4: 'Brakes',
  5: 'Wheels & tyres',
  6: 'Exhaust',
  7: 'Exterior',
  8: 'Interior',
  9: 'Electronics',
  10: 'Other',
};

export interface GarageDirectoryEntry {
  ownerId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  city: string | null;
  province: string | null;
  isVerified: boolean;
  vehicleCount: number;
  forSaleCount: number;
  coverImageUrl: string | null;
  vehicleTitles: string[];
  lastUpdatedAt: string;
}

export interface GarageDirectoryPage {
  items: GarageDirectoryEntry[];
  totalCount: number;
}

/** A vehicle normalised from the three different API shapes (mine, public, single). */
export interface GarageCar {
  id: string;
  ownerId: string | null;
  make: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string | null;
  engineDetails: string | null;
  color: string | null;
  isPublic: boolean;
  imageUrl: string | null;
  listingId: string | null;
  price: number | null;
  /** Fields the UI doesn't edit, kept so a PUT doesn't wipe them. */
  kilowatts: number | null;
  drivetrain: number | null;
  fuelType: number | null;
  bodyType: number | null;
  vin: string | null;
}

export interface ServiceRecord {
  id: string;
  title: string;
  description: string | null;
  serviceDate: string;
  mileage: number;
}

export interface Modification {
  id: string;
  name: string;
  category: number;
  brand: string | null;
  description: string | null;
}

export interface CarPayload {
  make: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string | null;
  engineDetails: string | null;
  color: string | null;
}

interface RawCar {
  id: string;
  ownerId?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string | null;
  engineDetails: string | null;
  color: string | null;
  isPublic?: boolean;
  primaryImageUrl?: string | null;
  marketplaceListingId?: string | null;
  marketplacePrice?: number | null;
  kilowatts?: number | null;
  drivetrain?: number | null;
  fuelType?: number | null;
  bodyType?: number | null;
  vin?: string | null;
}

const toCar = (raw: RawCar, ownerId: string | null, isPublic: boolean): GarageCar => ({
  id: raw.id,
  ownerId: raw.ownerId ?? ownerId,
  make: raw.make,
  model: raw.model,
  year: raw.year,
  mileage: raw.mileage,
  transmission: raw.transmission,
  engineDetails: raw.engineDetails,
  color: raw.color,
  isPublic: raw.isPublic ?? isPublic,
  imageUrl: raw.primaryImageUrl ?? null,
  listingId: raw.marketplaceListingId ?? null,
  price: raw.marketplacePrice ?? null,
  kilowatts: raw.kilowatts ?? null,
  drivetrain: raw.drivetrain ?? null,
  fuelType: raw.fuelType ?? null,
  bodyType: raw.bodyType ?? null,
  vin: raw.vin ?? null,
});

export const carTitle = (c: Pick<GarageCar, 'make' | 'model'>) => `${c.make} ${c.model}`;

export const getGarageDirectory = (search: string, page = 1) => {
  const query = new URLSearchParams({ page: String(page), pageSize: '24' });
  if (search.trim()) query.set('search', search.trim());
  return apiRequest<GarageDirectoryPage>(`/Garage/directory?${query}`);
};

export const getMyGarage = async (ownerId: string) => {
  const raw = await apiRequest<RawCar[]>('/Garage/mine');
  return raw.map((r) => toCar(r, ownerId, false));
};

export const getPublicGarage = async (userId: string) => {
  const result = await apiRequest<{ owner: PublicProfile; vehicles: RawCar[] }>(
    `/Garage/users/${userId}`
  );
  return {
    owner: result.owner,
    cars: result.vehicles.map((r) => toCar(r, userId, true)),
  };
};

/** Works for private vehicles too: private means unlisted, not secret. */
export const getVehicle = async (id: string) => {
  const raw = await apiRequest<RawCar>(`/Garage/vehicles/${id}`);
  const images = await apiRequest<{ url: string; isPrimary: boolean }[]>(
    `/Garage/vehicles/${id}/images`
  ).catch(() => []);
  const car = toCar(raw, null, false);
  car.imageUrl = images.find((i) => i.isPrimary)?.url ?? images[0]?.url ?? null;
  return car;
};

export const getServiceRecords = (carId: string) =>
  apiRequest<ServiceRecord[]>(`/Garage/vehicles/${carId}/service-records`);

export const getModifications = (carId: string) =>
  apiRequest<Modification[]>(`/Garage/vehicles/${carId}/modifications`);

export const createCar = async (payload: CarPayload, isPublic: boolean, ownerId: string) => {
  const raw = await apiRequest<RawCar>('/Garage/vehicles', {
    method: 'POST',
    body: JSON.stringify({ ...payload, isPublic }),
  });
  return toCar(raw, ownerId, isPublic);
};

export const updateCar = (car: GarageCar, payload: CarPayload) =>
  apiRequest<void>(`/Garage/vehicles/${car.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...payload,
      kilowatts: car.kilowatts,
      drivetrain: car.drivetrain,
      fuelType: car.fuelType,
      bodyType: car.bodyType,
      vin: car.vin,
    }),
  });

export const deleteCar = (id: string) =>
  apiRequest<void>(`/Garage/vehicles/${id}`, { method: 'DELETE' });

export const uploadCarPhoto = async (id: string, file: File) => {
  const form = new FormData();
  form.append('file', file);
  const { imageUrl } = await apiRequest<{ imageUrl: string }>(`/Garage/vehicles/${id}/photo`, {
    method: 'POST',
    body: form,
  });
  return imageUrl;
};

export const removeCarPhoto = (id: string) =>
  apiRequest<void>(`/Garage/vehicles/${id}/photo`, { method: 'DELETE' });

export const setCarVisibility = (id: string, isPublic: boolean) =>
  apiRequest<void>(`/Garage/vehicles/${id}/visibility`, {
    method: 'PUT',
    body: JSON.stringify({ isPublic }),
  });

export interface CarLikeStatus {
  count: number;
  liked: boolean;
}

export const getCarLikes = (id: string) =>
  apiRequest<CarLikeStatus>(`/Garage/vehicles/${id}/likes`);

export const likeCar = (id: string) =>
  apiRequest<void>(`/Garage/vehicles/${id}/likes`, { method: 'PUT' });

export const unlikeCar = (id: string) =>
  apiRequest<void>(`/Garage/vehicles/${id}/likes`, { method: 'DELETE' });

export const addServiceRecord = (
  carId: string,
  payload: { title: string; serviceDate: string; mileage: number }
) =>
  apiRequest<ServiceRecord>(`/Garage/vehicles/${carId}/service-records`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const addModification = (
  carId: string,
  payload: { name: string; category: number; description: string | null }
) =>
  apiRequest<Modification>(`/Garage/vehicles/${carId}/modifications`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

