import { CATEGORIES, type ListingDraft } from './listingDraft';

export const reviewRows = (draft: ListingDraft): [string, string][] => {
  const category = CATEGORIES.find((c) => c.key === draft.category)?.title ?? draft.category;
  const rows: [string, string][] = [
    ['Category', category],
    ['Title', draft.title],
  ];

  const fits = [draft.compatMake, draft.compatModel].filter(Boolean).join(' ');
  const years = [draft.compatYearFrom, draft.compatYearTo].filter(Boolean).join('–');
  const fitment = [fits, years].filter(Boolean).join(' · ');

  switch (draft.category) {
    case 'Vehicle':
      rows.push(
        ['Vehicle', `${draft.year} ${draft.make} ${draft.model}`],
        ['Engine', `${draft.engine} · ${draft.fuelType} · ${draft.drivetrain}`],
        ['Body / colour', `${draft.bodyType} · ${draft.colour}`],
        ['Transmission', draft.transmission],
        ['Mileage', `${Number(draft.mileage).toLocaleString('en-ZA')} km`],
        ['Condition', draft.condition],
        ['Service history', draft.serviceHistory],
        ['Documents', draft.documents.join(', ') || 'None'],
      );
      break;
    case 'Part':
      rows.push(
        ['Part', draft.itemName],
        ['Part number', draft.partNumber || 'Not specified'],
        ['Manufacturer', draft.brand || 'Not specified'],
        ['Condition', draft.itemCondition],
        ['Fits', fitment || 'Not specified'],
      );
      break;
    case 'Engine':
      rows.push(
        ['Engine', `${draft.brand} ${draft.itemName}`],
        ['Engine code', draft.engineCode || 'Not specified'],
        ['Fuel type', draft.fuelType],
        ['Condition', draft.itemCondition],
        ['Fits', fitment || 'Not specified'],
      );
      break;
    case 'Wheel':
      rows.push(
        ['Wheels', [draft.brand, draft.itemName].filter(Boolean).join(' ') || 'Not specified'],
        ['Size', `${draft.diameter}" x ${draft.width}"`],
        ['Quantity', draft.quantity],
        ['Condition', draft.itemCondition],
        ['Fits', fitment || 'Not specified'],
      );
      break;
    default:
      rows.push(['Condition', draft.itemCondition]);
  }

  rows.push(
    ['Location', draft.location || 'Not specified'],
    ['Photos', `${draft.photos.length}`],
    ['Price', `R ${Number(draft.price).toLocaleString('en-ZA')}${draft.negotiable ? ' (negotiable)' : ''}`],
  );

  return rows;
};
