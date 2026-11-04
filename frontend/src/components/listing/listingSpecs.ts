import type { ListingDetail } from '../../services/listingsApi';

export const TYPE_LABEL: Record<number, string> = {
  1: 'Vehicle',
  2: 'Part',
  3: 'Engine',
  4: 'Wheel',
  5: 'Other',
};

export const CONDITION_LABEL: Record<number, string> = {
  1: 'New',
  2: 'Used',
  3: 'Refurbished',
  4: 'For parts',
};

export const STATUS_LABEL: Record<number, string> = {
  1: 'Draft',
  2: 'Active',
  3: 'Reserved',
  4: 'Sold',
  5: 'Removed',
};

const DRIVETRAIN: Record<number, string> = { 1: 'FWD', 2: 'RWD', 3: 'AWD', 4: '4WD' };
const FUEL: Record<number, string> = { 1: 'Petrol', 2: 'Diesel', 3: 'Hybrid', 4: 'Electric' };
const BODY: Record<number, string> = {
  1: 'Sedan', 2: 'Hatchback', 3: 'Coupe', 4: 'Convertible', 5: 'SUV',
  6: 'Bakkie', 7: 'Wagon', 8: 'Van', 9: 'Minibus',
};

type Row = [label: string, value: string | null | undefined];
type Fields = Record<string, string | number | null> | null;

const text = (v: string | number | null | undefined) =>
  v === null || v === undefined || v === '' ? null : String(v);
const lookup = (map: Record<number, string>, v: string | number | null | undefined) =>
  typeof v === 'number' ? (map[v] ?? null) : null;
const withUnit = (v: string | number | null | undefined, unit: string) =>
  v === null || v === undefined || v === '' ? null : `${Number(v).toLocaleString('en-ZA')} ${unit}`;

const fitment = (f: Fields) => {
  if (!f?.compatibleMake) return null;
  const years =
    f.compatibleYearFrom || f.compatibleYearTo
      ? ` (${f.compatibleYearFrom ?? ''}–${f.compatibleYearTo ?? ''})`
      : '';
  return `${f.compatibleMake} ${f.compatibleModel ?? ''}`.trim() + years;
};

export function buildSpecRows(l: ListingDetail): [string, string][] {
  const rows: Row[] = [
    ['Category', TYPE_LABEL[l.type]],
    ['Condition', CONDITION_LABEL[l.condition]],
  ];

  const v = l.vehicle;
  if (v) {
    rows.push(
      ['Make', text(v.make)],
      ['Model', text(v.model)],
      ['Year', text(v.year)],
      ['Mileage', withUnit(v.mileage, 'km')],
      ['Engine', text(v.engine)],
      ['Power', withUnit(v.kilowatts, 'kW')],
      ['Transmission', text(v.transmission)],
      ['Drivetrain', lookup(DRIVETRAIN, v.drivetrain)],
      ['Fuel', lookup(FUEL, v.fuelType)],
      ['Body', lookup(BODY, v.bodyType)],
      ['Colour', text(v.colour)],
      ['VIN', text(v.vin)],
    );
  }

  const p = l.part;
  if (p) {
    rows.push(
      ['Part', text(p.name)],
      ['Part number', text(p.partNumber)],
      ['Manufacturer', text(p.manufacturer)],
      ['Fits', fitment(p)],
    );
  }

  const e = l.engine;
  if (e) {
    rows.push(
      ['Manufacturer', text(e.manufacturer)],
      ['Model', text(e.model)],
      ['Engine code', text(e.engineCode)],
      ['Displacement', withUnit(e.displacement, 'L')],
      ['Power', withUnit(e.kilowatts, 'kW')],
      ['Fuel', lookup(FUEL, e.fuelType)],
      ['Mileage', withUnit(e.mileage, 'km')],
      ['Fits', fitment(e)],
    );
  }

  const w = l.wheel;
  if (w) {
    rows.push(
      ['Brand', text(w.brand)],
      ['Model', text(w.model)],
      ['Diameter', withUnit(w.diameter, 'in')],
      ['Width', withUnit(w.width, 'in')],
      ['Offset', text(w.offset)],
      ['Bolt pattern', text(w.boltPattern)],
      ['Material', text(w.material)],
      ['Colour', text(w.colour)],
      ['Fits', fitment(w)],
    );
  }

  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}
