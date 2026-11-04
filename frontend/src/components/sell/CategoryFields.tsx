import { MAKES } from './makes';
import { SelectField, TextField } from './fields';
import {
  BODY_TYPES,
  CATEGORIES,
  CONDITIONS,
  DRIVETRAINS,
  FUEL_TYPES,
  ITEM_CONDITIONS,
  TRANSMISSIONS,
  YEARS,
  type CategoryKey,
  type ListingDraft,
} from './listingDraft';

type Update = <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) => void;

interface StepProps {
  draft: ListingDraft;
  update: Update;
}

const digits = (value: string) => value.replace(/\D/g, '');
const decimal = (value: string) => value.replace(/[^\d.]/g, '');

export const CategoryStep = ({
  selected,
  onSelect,
}: {
  selected: CategoryKey;
  onSelect: (category: CategoryKey) => void;
}) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {CATEGORIES.map((category) => {
      const active = category.key === selected;
      return (
        <button
          key={category.key}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect(category.key)}
          className={`flex flex-col rounded-xl border px-4 py-4 text-left transition-colors ${
            active
              ? 'border-amber-300/60 bg-amber-300/10'
              : 'border-white/10 bg-white/[0.03] hover:border-white/25 light:border-black/10 light:bg-white light:hover:border-black/30'
          }`}
        >
          <span className="font-display text-sm text-white light:text-neutral-900">{category.title}</span>
          <span className="mt-0.5 text-xs text-neutral-500">{category.blurb}</span>
        </button>
      );
    })}
  </div>
);

const CompatibilityFields = ({ draft, update }: StepProps) => (
  <>
    <TextField label="Fits make (optional)" value={draft.compatMake} placeholder="e.g. BMW" onChange={(v) => update('compatMake', v)} />
    <TextField label="Fits model (optional)" value={draft.compatModel} placeholder="e.g. E36" onChange={(v) => update('compatModel', v)} />
    <TextField label="Fits from year (optional)" value={draft.compatYearFrom} inputMode="numeric" placeholder="e.g. 1992" onChange={(v) => update('compatYearFrom', digits(v).slice(0, 4))} />
    <TextField label="Fits to year (optional)" value={draft.compatYearTo} inputMode="numeric" placeholder="e.g. 1999" onChange={(v) => update('compatYearTo', digits(v).slice(0, 4))} />
  </>
);

const LocationField = ({ draft, update }: StepProps) => (
  <TextField label="Location" value={draft.location} placeholder="e.g. Cape Town" onChange={(v) => update('location', v)} />
);

export const DetailsStep = ({ draft, update }: StepProps) => {
  const grid = 'grid grid-cols-1 gap-4 md:grid-cols-2';

  switch (draft.category) {
    case 'Vehicle':
      return (
        <div className={grid}>
          <SelectField label="Make" value={draft.make} options={MAKES} onChange={(v) => update('make', v)} />
          <TextField label="Model" value={draft.model} placeholder="e.g. E36 328i" onChange={(v) => update('model', v)} />
          <SelectField label="Year" value={draft.year} options={YEARS} onChange={(v) => update('year', v)} />
          <SelectField label="Transmission" value={draft.transmission} options={TRANSMISSIONS} onChange={(v) => update('transmission', v)} />
          <TextField label="Mileage (km)" value={draft.mileage} inputMode="numeric" placeholder="e.g. 212000" onChange={(v) => update('mileage', digits(v))} />
          <SelectField label="Condition" value={draft.condition} options={CONDITIONS} onChange={(v) => update('condition', v)} />
          <TextField label="Engine" value={draft.engine} placeholder="e.g. 2.8L inline-6" onChange={(v) => update('engine', v)} />
          <SelectField label="Drivetrain" value={draft.drivetrain} options={DRIVETRAINS} onChange={(v) => update('drivetrain', v)} />
          <SelectField label="Fuel type" value={draft.fuelType} options={FUEL_TYPES} onChange={(v) => update('fuelType', v)} />
          <SelectField label="Body type" value={draft.bodyType} options={BODY_TYPES} onChange={(v) => update('bodyType', v)} />
          <TextField label="Colour" value={draft.colour} placeholder="e.g. Estoril Blue" onChange={(v) => update('colour', v)} />
          <LocationField draft={draft} update={update} />
        </div>
      );
    case 'Part':
      return (
        <div className={grid}>
          <TextField label="Part name" value={draft.itemName} placeholder="e.g. Front brake discs" onChange={(v) => update('itemName', v)} />
          <TextField label="Part number (optional)" value={draft.partNumber} onChange={(v) => update('partNumber', v)} />
          <TextField label="Manufacturer (optional)" value={draft.brand} placeholder="e.g. Brembo" onChange={(v) => update('brand', v)} />
          <SelectField label="Condition" value={draft.itemCondition} options={ITEM_CONDITIONS} onChange={(v) => update('itemCondition', v)} />
          <CompatibilityFields draft={draft} update={update} />
          <LocationField draft={draft} update={update} />
        </div>
      );
    case 'Engine':
      return (
        <div className={grid}>
          <TextField label="Manufacturer" value={draft.brand} placeholder="e.g. BMW" onChange={(v) => update('brand', v)} />
          <TextField label="Engine model" value={draft.itemName} placeholder="e.g. M52B28" onChange={(v) => update('itemName', v)} />
          <TextField label="Engine code (optional)" value={draft.engineCode} onChange={(v) => update('engineCode', v)} />
          <TextField label="Displacement in litres (optional)" value={draft.displacement} inputMode="numeric" placeholder="e.g. 2.8" onChange={(v) => update('displacement', decimal(v))} />
          <TextField label="Power in kW (optional)" value={draft.kilowatts} inputMode="numeric" onChange={(v) => update('kilowatts', digits(v))} />
          <SelectField label="Fuel type" value={draft.fuelType} options={FUEL_TYPES} onChange={(v) => update('fuelType', v)} />
          <TextField label="Mileage in km (optional)" value={draft.mileage} inputMode="numeric" onChange={(v) => update('mileage', digits(v))} />
          <SelectField label="Condition" value={draft.itemCondition} options={ITEM_CONDITIONS} onChange={(v) => update('itemCondition', v)} />
          <CompatibilityFields draft={draft} update={update} />
          <LocationField draft={draft} update={update} />
        </div>
      );
    case 'Wheel':
      return (
        <div className={grid}>
          <TextField label="Brand (optional)" value={draft.brand} placeholder="e.g. BBS" onChange={(v) => update('brand', v)} />
          <TextField label="Model (optional)" value={draft.itemName} onChange={(v) => update('itemName', v)} />
          <TextField label="Diameter (inches)" value={draft.diameter} inputMode="numeric" placeholder="e.g. 17" onChange={(v) => update('diameter', decimal(v))} />
          <TextField label="Width (inches)" value={draft.width} inputMode="numeric" placeholder="e.g. 8" onChange={(v) => update('width', decimal(v))} />
          <TextField label="Offset (optional)" value={draft.offset} inputMode="numeric" placeholder="e.g. 35" onChange={(v) => update('offset', digits(v))} />
          <TextField label="Bolt pattern (optional)" value={draft.boltPattern} placeholder="e.g. 5x120" onChange={(v) => update('boltPattern', v)} />
          <TextField label="Material (optional)" value={draft.material} placeholder="e.g. Alloy" onChange={(v) => update('material', v)} />
          <TextField label="Colour (optional)" value={draft.colour} onChange={(v) => update('colour', v)} />
          <TextField label="Quantity" value={draft.quantity} inputMode="numeric" onChange={(v) => update('quantity', digits(v))} />
          <SelectField label="Condition" value={draft.itemCondition} options={ITEM_CONDITIONS} onChange={(v) => update('itemCondition', v)} />
          <CompatibilityFields draft={draft} update={update} />
          <LocationField draft={draft} update={update} />
        </div>
      );
    default:
      return (
        <div className={grid}>
          <SelectField label="Condition" value={draft.itemCondition} options={ITEM_CONDITIONS} onChange={(v) => update('itemCondition', v)} />
          <LocationField draft={draft} update={update} />
        </div>
      );
  }
};
