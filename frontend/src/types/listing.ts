export interface StoreListing {
  id: string;
  title: string;
  year: number;
  transmission: 'Manual' | 'Automatic';
  mileageKm: number;
  price: number;
  imageUrl?: string;
  category: 'Cars' | 'Parts' | 'Wheels' | 'Engines';
}
