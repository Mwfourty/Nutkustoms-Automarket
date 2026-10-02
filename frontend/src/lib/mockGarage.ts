import type { Garage, GarageCar, GarageOwner } from '../types/garage';

export const myGarage: Garage = {
  owner: { id: 'me', name: 'You', rating: 4, reviews: 9, memberSince: 'Jan 2023' },
  cars: [
    {
      id: 'e36',
      title: 'BMW E36 328i',
      year: 1998,
      transmission: 'Manual',
      mileageKm: 212000,
      views: 520,
      likes: 64,
      service: [
        { id: 's1', title: 'Major service', date: 'May 12, 2024', km: 212000 },
        { id: 's2', title: 'Oil change', date: 'Nov 3, 2023', km: 205300 },
      ],
      mods: [
        { id: 'm1', part: 'Suspension', detail: 'Lowering springs (32mm)' },
        { id: 'm2', part: 'Wheels', detail: '17" BBS RK wheels' },
      ],
      docs: [{ id: 'd1', name: 'Vehicle Title.pdf', meta: 'PDF \u2022 1.2 MB' }],
    },
    {
      id: 'polo',
      title: 'VW Polo TSI',
      year: 2021,
      transmission: 'Automatic',
      mileageKm: 41200,
      service: [{ id: 's1', title: 'Annual service', date: 'Jan 9, 2024', km: 38000 }],
      mods: [],
      docs: [],
    },
    {
      id: 'np200',
      title: 'Nissan NP200',
      year: 2017,
      transmission: 'Manual',
      mileageKm: 121300,
      service: [],
      mods: [{ id: 'm1', part: 'Canopy', detail: 'Fibreglass canopy' }],
      docs: [],
    },
  ],
};

export const publicGarages: Record<string, Garage> = {
  'alex-mechanic': {
    owner: { id: 'alex-mechanic', name: 'Alex Mechanic', rating: 3, reviews: 24, memberSince: 'Mar 2021' },
    cars: [
      {
        id: 'e36',
        title: 'BMW E36 328i',
        year: 1998,
        transmission: 'Manual',
        mileageKm: 212000,
        price: 12500,
        views: 1842,
        likes: 326,
        service: [
          { id: 's1', title: 'Major service', date: 'May 12, 2024', km: 212000 },
          { id: 's2', title: 'Oil change', date: 'Nov 3, 2023', km: 205300 },
          { id: 's3', title: 'Cooling system flush', date: 'Apr 18, 2023', km: 197800 },
          { id: 's4', title: 'Brake service', date: 'Oct 2, 2022', km: 189500 },
        ],
        mods: [
          { id: 'm1', part: 'Suspension', detail: 'Lowering springs (32mm)' },
          { id: 'm2', part: 'Wheels', detail: '17" BBS RK wheels' },
          { id: 'm3', part: 'Exhaust', detail: 'Stainless cat-back' },
          { id: 'm4', part: 'Interior', detail: 'M-Tech steering wheel' },
        ],
        docs: [
          { id: 'd1', name: 'Vehicle Title.pdf', meta: 'PDF \u2022 1.2 MB' },
          { id: 'd2', name: 'Service Records.pdf', meta: 'PDF \u2022 2.4 MB' },
          { id: 'd3', name: 'Emissions Certificate.pdf', meta: 'PDF \u2022 850 KB' },
        ],
      },
      {
        id: 'e36-325i',
        title: 'BMW E36 325i',
        year: 1996,
        transmission: 'Manual',
        mileageKm: 198000,
        price: 9750,
        views: 640,
        likes: 88,
        service: [{ id: 's1', title: 'Oil change', date: 'Feb 2, 2024', km: 196500 }],
        mods: [],
        docs: [],
      },
      {
        id: 'golf',
        title: 'VW Golf Mk3 1.8',
        year: 1995,
        transmission: 'Manual',
        mileageKm: 180000,
        price: 4800,
        views: 410,
        likes: 52,
        service: [],
        mods: [{ id: 'm1', part: 'Wheels', detail: '15" Hartge alloys' }],
        docs: [],
      },
      {
        id: 'w124',
        title: 'Mercedes W124 300E',
        year: 1993,
        transmission: 'Auto',
        mileageKm: 230000,
        price: 6900,
        views: 905,
        likes: 141,
        service: [{ id: 's1', title: 'Gearbox service', date: 'Aug 21, 2023', km: 226000 }],
        mods: [],
        docs: [],
      },
    ],
  },
};

export interface CarOfTheWeekResult {
  car: GarageCar;
  owner: GarageOwner;
  link: string;
}

// Likes are weighted higher than views.
const popularity = (car: GarageCar) => (car.views ?? 0) + (car.likes ?? 0) * 5;

export const getCarOfTheWeek = (): CarOfTheWeekResult => {
  const entries = [myGarage, ...Object.values(publicGarages)].flatMap((garage) =>
    garage.cars.map((car) => ({
      car,
      owner: garage.owner,
      link:
        garage === myGarage
          ? `/garage?car=${car.id}`
          : `/garage/${garage.owner.id}?car=${car.id}`,
    })),
  );
  return entries.reduce((best, entry) => (popularity(entry.car) > popularity(best.car) ? entry : best));
};
