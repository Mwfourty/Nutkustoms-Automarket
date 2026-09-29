import type { StoreListing } from '../types/listing';

const BASE_LISTINGS: Omit<StoreListing, 'id'>[] = [
  { title: 'Toyota Corolla GLi', year: 2019, transmission: 'Manual', mileageKm: 84000, price: 189900, category: 'Cars' },
  { title: 'VW Polo TSI', year: 2021, transmission: 'Automatic', mileageKm: 41200, price: 259500, category: 'Cars' },
  { title: 'BMW E36 328i', year: 1998, transmission: 'Manual', mileageKm: 212000, price: 145000, category: 'Cars' },
  { title: 'Ford Ranger XLT', year: 2020, transmission: 'Automatic', mileageKm: 63800, price: 412000, category: 'Cars' },
  { title: 'Mercedes W124 300E', year: 1993, transmission: 'Automatic', mileageKm: 230000, price: 98500, category: 'Cars' },
  { title: 'VW Golf Mk3 1.8', year: 1995, transmission: 'Manual', mileageKm: 180000, price: 64800, category: 'Cars' },
  { title: 'Audi A3 1.4T', year: 2018, transmission: 'Automatic', mileageKm: 95600, price: 229900, category: 'Cars' },
  { title: 'Nissan NP200', year: 2017, transmission: 'Manual', mileageKm: 121300, price: 119000, category: 'Cars' },
  { title: 'Toyota Hilux 2.4 GD-6', year: 2022, transmission: 'Automatic', mileageKm: 32000, price: 489000, category: 'Cars' },
  { title: 'Honda Civic Type R', year: 2017, transmission: 'Manual', mileageKm: 68000, price: 549000, category: 'Cars' },
  { title: 'Mazda MX-5 NB', year: 2001, transmission: 'Manual', mileageKm: 156000, price: 129900, category: 'Cars' },
  { title: 'Subaru Impreza WRX', year: 2005, transmission: 'Manual', mileageKm: 198000, price: 175000, category: 'Cars' },
  { title: 'BMW E30 325i', year: 1989, transmission: 'Manual', mileageKm: 245000, price: 210000, category: 'Cars' },
  { title: 'Golf GTI Mk5', year: 2007, transmission: 'Manual', mileageKm: 165000, price: 139000, category: 'Cars' },
  { title: 'Datsun 1200', year: 1978, transmission: 'Manual', mileageKm: 88000, price: 74000, category: 'Cars' },
  { title: 'Toyota Supra Mk4', year: 1997, transmission: 'Manual', mileageKm: 132000, price: 890000, category: 'Cars' },
  { title: 'K24 Engine Swap', year: 2016, transmission: 'Manual', mileageKm: 45000, price: 32000, category: 'Engines' },
  { title: 'B18C Type R Engine', year: 2000, transmission: 'Manual', mileageKm: 71000, price: 28500, category: 'Engines' },
  { title: 'LS3 6.2L V8', year: 2014, transmission: 'Automatic', mileageKm: 51000, price: 65000, category: 'Engines' },
  { title: '2JZ-GTE Twin Turbo', year: 1998, transmission: 'Manual', mileageKm: 102000, price: 78000, category: 'Engines' },
  { title: 'RB26DETT Engine', year: 1999, transmission: 'Manual', mileageKm: 89000, price: 92000, category: 'Engines' },
  { title: '18" BBS RS Wheels', year: 2020, transmission: 'Manual', mileageKm: 0, price: 15500, category: 'Wheels' },
  { title: '17" Rota Grid Set', year: 2019, transmission: 'Manual', mileageKm: 0, price: 6800, category: 'Wheels' },
  { title: 'OEM BMW Style 32', year: 2015, transmission: 'Manual', mileageKm: 0, price: 8200, category: 'Wheels' },
  { title: 'Volk TE37 Set', year: 2021, transmission: 'Manual', mileageKm: 0, price: 24500, category: 'Wheels' },
  { title: 'Enkei RPF1 17"', year: 2018, transmission: 'Manual', mileageKm: 0, price: 11200, category: 'Wheels' },
  { title: 'Brembo Brake Kit', year: 2020, transmission: 'Manual', mileageKm: 0, price: 9800, category: 'Parts' },
  { title: 'Coilover Suspension Kit', year: 2021, transmission: 'Manual', mileageKm: 0, price: 12500, category: 'Parts' },
  { title: 'Turbo Intercooler Kit', year: 2019, transmission: 'Manual', mileageKm: 0, price: 7400, category: 'Parts' },
  { title: 'Carbon Fiber Bonnet', year: 2022, transmission: 'Manual', mileageKm: 0, price: 18900, category: 'Parts' },
  { title: 'Exhaust Header Set', year: 2020, transmission: 'Manual', mileageKm: 0, price: 5600, category: 'Parts' },
];

export const mockListings: StoreListing[] = Array.from(
  { length: 48 },
  (_, index) => {
    const base = BASE_LISTINGS[index % BASE_LISTINGS.length];
    return {
      ...base,
      id: `${index + 1}`,
    };
  },
);

