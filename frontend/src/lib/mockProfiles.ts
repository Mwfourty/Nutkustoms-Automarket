export interface HistoryItem {
  id: string;
  title: string;
  kind: 'Sold' | 'Bought';
  date: string;
  price: number;
}

export interface Profile {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  memberSince: string;
  location: string;
  listingsSold: number;
  carsInGarage: number;
  history: HistoryItem[];
}

export const myProfile: Profile = {
  id: 'me',
  name: 'Musa Mndau',
  rating: 4.7,
  reviews: 17,
  memberSince: 'Jan 2023',
  location: 'Pretoria',
  listingsSold: 6,
  carsInGarage: 3,
  history: [
    { id: '1', title: 'VW Golf Mk3 1.8', kind: 'Sold', date: 'Aug 14, 2025', price: 64800 },
    { id: '2', title: 'Nissan NP200', kind: 'Bought', date: 'Mar 2, 2025', price: 119000 },
    { id: '3', title: 'Toyota Corolla GLi', kind: 'Sold', date: 'Nov 20, 2024', price: 168500 },
  ],
};

export const publicProfiles: Record<string, Profile> = {
  'alex-mechanic': {
    id: 'alex-mechanic',
    name: 'Alex Mechanic',
    rating: 3.4,
    reviews: 24,
    memberSince: 'Mar 2021',
    location: 'Pretoria',
    listingsSold: 14,
    carsInGarage: 4,
    history: [
      { id: '1', title: 'BMW E36 325i', kind: 'Sold', date: 'Jun 3, 2025', price: 9750 },
      { id: '2', title: 'Mercedes W124 300E', kind: 'Bought', date: 'Jan 18, 2025', price: 6200 },
      { id: '3', title: 'VW Golf Mk3 1.8', kind: 'Sold', date: 'Sep 9, 2024', price: 4800 },
    ],
  },
};
