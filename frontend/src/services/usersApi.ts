import { apiRequest } from './apiClient';
import type { StoreListing } from '../types/listing';

export interface MyProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  listingsSold: number;
  carsInGarage: number;
  averageRating: number;
  reviewCount: number;
  city: string | null;
  province: string | null;
  profileVisibility: number;
  allowMessages: boolean;
  usernameChangedAt: string | null;
}

export const PROFILE_VISIBILITY = { Public: 1, Private: 2 } as const;

export interface PublicProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  city: string | null;
  province: string | null;
  profileImageUrl: string | null;
  isVerified: boolean;
  memberSince: string;
  averageRating: number;
  reviewCount: number;
}

export interface SavedContact {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  isVerified: boolean;
  savedAt: string;
}

export interface ApiListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  type: number;
  condition: number;
  status: number;
  location: string | null;
  createdAt: string;
  primaryImageUrl: string | null;
  sourceGarageVehicleId?: string | null;
  likeCount?: number;
  sellerRating?: number;
  vehicle: {
    make?: string;
    model?: string;
    year: number;
    mileage: number;
    transmission: string | null;
  } | null;
  part?: Compatibility | null;
  engine?: Compatibility | null;
  wheel?: Compatibility | null;
}

interface Compatibility {
  compatibleMake?: string | null;
  compatibleModel?: string | null;
}

interface ListingsPage {
  items: ApiListing[];
}

export const LISTING_STATUS = { Active: 2, Sold: 4 } as const;

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  username?: string;
  city?: string | null;
  province?: string | null;
}

export const getMyProfile = () => apiRequest<MyProfile>('/Users/me');

export const getPublicProfile = (id: string) =>
  apiRequest<PublicProfile>(`/Users/${id}/public`);

export const updateMyProfile = (payload: UpdateProfilePayload) =>
  apiRequest<void>('/Users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const uploadAvatar = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return apiRequest<{ profileImageUrl: string }>('/Users/me/avatar', {
    method: 'POST',
    body: form,
  });
};

export const removeAvatar = () =>
  apiRequest<void>('/Users/me/avatar', { method: 'DELETE' });

export const updatePrivacy = (payload: {
  profileVisibility: number;
  allowMessages: boolean;
}) =>
  apiRequest<void>('/Users/me/privacy', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const changePassword = (payload: {
  currentPassword: string;
  newPassword: string;
}) =>
  apiRequest<void>('/Users/me/change-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const deactivateAccount = (password: string) =>
  apiRequest<void>('/Users/me/deactivate', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });

export const getMyListings = async (status?: number) => {
  const query = status ? `&status=${status}` : '';
  const page = await apiRequest<ListingsPage>(
    `/Listings/mine?page=1&pageSize=100${query}`
  );
  return page.items;
};

export const getSellerListings = async (sellerId: string) => {
  const page = await apiRequest<ListingsPage>(
    `/Listings?page=1&pageSize=100&sellerId=${sellerId}`
  );
  return page.items;
};

export const getSavedListings = () =>
  apiRequest<ApiListing[]>('/Users/me/saved-listings');

export const getSavedListingIds = () =>
  apiRequest<string[]>('/Users/me/saved-listings/ids');

export const saveListing = (id: string) =>
  apiRequest<void>(`/Users/me/saved-listings/${id}`, { method: 'PUT' });

export const unsaveListing = (id: string) =>
  apiRequest<void>(`/Users/me/saved-listings/${id}`, { method: 'DELETE' });

export const getSavedContacts = () =>
  apiRequest<SavedContact[]>('/Users/me/saved-contacts');

export const saveContact = (id: string) =>
  apiRequest<void>(`/Users/me/saved-contacts/${id}`, { method: 'PUT' });

export const removeContact = (id: string) =>
  apiRequest<void>(`/Users/me/saved-contacts/${id}`, { method: 'DELETE' });

const CATEGORY: Record<number, StoreListing['category']> = {
  1: 'Cars',
  2: 'Parts',
  3: 'Engines',
  4: 'Wheels',
  5: 'Other',
};

const CONDITION: Record<number, StoreListing['condition']> = {
  1: 'New',
  2: 'Used',
  3: 'Refurbished',
  4: 'For parts',
};

export function toStoreListing(l: ApiListing): StoreListing {
  const days = Math.floor(
    (Date.now() - new Date(l.createdAt).getTime()) / 86_400_000
  );

  const compat = l.part ?? l.engine ?? l.wheel;
  const fitment = compat?.compatibleMake
    ? `${compat.compatibleMake} ${compat.compatibleModel ?? ''}`.trim()
    : l.type === 1
      ? undefined
      : 'Universal';
  const transmission = l.vehicle?.transmission;

  return {
    id: l.id,
    sellerId: l.sellerId,
    title: l.title,
    year: l.vehicle?.year ?? 0,
    transmission: !transmission
      ? ''
      : transmission.toLowerCase().startsWith('auto')
        ? 'Automatic'
        : 'Manual',
    mileageKm: l.vehicle?.mileage ?? 0,
    price: l.price,
    imageUrl: l.primaryImageUrl ?? undefined,
    category: CATEGORY[l.type] ?? 'Other',
    location: l.location ?? '',
    verifiedHistory: Boolean(l.sourceGarageVehicleId),
    serviceRecords: 0,
    likes: l.likeCount ?? 0,
    sellerRating: l.sellerRating ?? 0,
    listedDaysAgo: Math.max(0, days),
    condition: CONDITION[l.condition],
    fitment,
  };
}
