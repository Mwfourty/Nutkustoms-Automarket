import { apiRequest } from './apiClient';
import type { ApiListing } from './usersApi';

const PAGE_SIZE = 100;
const MAX_PAGES = 5;

interface ListingsPage {
  items: ApiListing[];
  totalPages: number;
}

export const getAllListings = async (): Promise<ApiListing[]> => {
  const all: ApiListing[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const result = await apiRequest<ListingsPage>(
      `/Listings?page=${page}&pageSize=${PAGE_SIZE}`
    );
    all.push(...result.items);
    if (page >= result.totalPages) break;
  }
  return all;
};

export interface ListingImage {
  id: string;
  url: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ListingSeller {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl: string | null;
  isVerified: boolean;
  memberSince: string;
  averageRating: number;
  reviewCount: number;
}

export interface ListingDetail {
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
  sourceGarageVehicleId: string | null;
  likeCount: number;
  isSaved: boolean;
  vehicle: Record<string, string | number | null> | null;
  part: Record<string, string | number | null> | null;
  engine: Record<string, string | number | null> | null;
  wheel: Record<string, string | number | null> | null;
  images: ListingImage[];
  seller: ListingSeller;
}

export const getListing = (id: string) =>
  apiRequest<ListingDetail>(`/Listings/${id}`);

export interface CarOfTheWeekData {
  kind: 'listing' | 'garage';
  id: string;
  garageVehicleId: string | null;
  title: string;
  year: number;
  mileage: number;
  transmission: string | null;
  price: number | null;
  imageUrl: string | null;
  likeCount: number;
  mods: string[];
  ownerId: string;
  ownerUsername: string;
  ownerName: string;
  ownerProfileImageUrl: string | null;
  ownerRating: number;
  ownerReviewCount: number;
}

export const getCarOfTheWeek = () =>
  apiRequest<CarOfTheWeekData | undefined>('/Listings/car-of-the-week');
