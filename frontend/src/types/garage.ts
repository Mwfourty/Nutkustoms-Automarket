export interface ServiceRecord {
  id: string;
  title: string;
  date: string;
  km: number;
}

export interface Modification {
  id: string;
  part: string;
  detail: string;
}

export interface GarageDocument {
  id: string;
  name: string;
  meta: string;
}

export interface GarageCar {
  id: string;
  title: string;
  year: number;
  transmission: string;
  mileageKm: number;
  price?: number;
  views?: number;
  likes?: number;
  service: ServiceRecord[];
  mods: Modification[];
  docs: GarageDocument[];
}

export interface GarageOwner {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  memberSince: string;
}

export interface Garage {
  owner: GarageOwner;
  cars: GarageCar[];
}
