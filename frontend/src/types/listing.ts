export interface StoreListing {
  id: string;
  title: string;
  year: number;
  transmission: 'Manual' | 'Automatic';
  mileageKm: number;
  price: number;
  imageUrl?: string;
  category: 'Cars' | 'Parts' | 'Wheels' | 'Engines';
  location: string;
  verifiedHistory: boolean;
  serviceRecords: number;
  sellerRating: number;
  listedDaysAgo: number;
}
