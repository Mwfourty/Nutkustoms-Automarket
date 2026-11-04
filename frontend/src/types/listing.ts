export interface StoreListing {
  id: string;
  sellerId?: string;
  title: string;
  year: number;
  transmission: 'Manual' | 'Automatic' | '';
  mileageKm: number;
  price: number;
  imageUrl?: string;
  category: 'Cars' | 'Parts' | 'Wheels' | 'Engines' | 'Other';
  location: string;
  verifiedHistory: boolean;
  serviceRecords: number;
  likes?: number;
  sellerRating: number;
  listedDaysAgo: number;
  condition?: 'New' | 'Used' | 'Refurbished' | 'For parts';
  fitment?: string; // e.g. 'BMW E30' or 'Universal'
}
