import {
  Calendar, Car, Gauge, Heart, Info, MapPin, Settings2,
  ShieldCheck, ShieldOff, Star, Tag, type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import BorderGlow from '../effects/BorderGlow';
import { useTheme } from '../../context/ThemeContext';
import type { StoreListing } from '../../types/listing';

interface ListingCardProps {
  listing: StoreListing;
  layout?: 'grid' | 'list';
}

type Spec = { icon: LucideIcon; label: string; full: string };
type SpecKey = 'year' | 'mileage' | 'transmission' | 'condition';

// Which specs each category shows, in order. Cells with no data are skipped.
const CATEGORY_SPECS: Record<StoreListing['category'], SpecKey[]> = {
  Cars: ['year', 'mileage', 'transmission'],
  Engines: ['year', 'mileage', 'condition'],
  Wheels: ['condition', 'year'],
  Parts: ['condition', 'year'],
};

const formatPrice = (price: number) => `R ${price.toLocaleString('en-ZA')}`;
const formatMileageFull = (km: number) => `${km.toLocaleString('en-ZA')} km`;

const formatMileageShort = (km: number) => {
  if (km < 1000) return `${km} km`;
  const k = km / 1000;
  const label = k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k).toString();
  return `${label}k km`;
};

const formatTransmission = (t: string) => (/^auto/i.test(t) ? 'Auto' : t);

const buildSpecs = (l: StoreListing): Spec[] => {
  const mileagePrefix = l.category === 'Engines' ? 'Engine mileage' : 'Mileage';

  const all: Record<SpecKey, Spec | null> = {
    year: { icon: Calendar, label: String(l.year), full: `Year: ${l.year}` },
    mileage:
      l.mileageKm > 0
        ? {
            icon: Gauge,
            label: formatMileageShort(l.mileageKm),
            full: `${mileagePrefix}: ${formatMileageFull(l.mileageKm)}`,
          }
        : null,
    transmission: l.transmission
      ? {
          icon: Settings2,
          label: formatTransmission(l.transmission),
          full: `Transmission: ${l.transmission}`,
        }
      : null,
    condition: l.condition
      ? { icon: Tag, label: l.condition, full: `Condition: ${l.condition}` }
      : null,
  };

  return CATEGORY_SPECS[l.category]
    .map((key) => all[key])
    .filter((s): s is Spec => s !== null);
};

type InfoLine = { icon: LucideIcon; text: string; tone: 'good' | 'neutral' | 'muted' };

const buildInfoLine = (l: StoreListing): InfoLine => {
  if (l.category === 'Cars' || l.category === 'Engines') {
    return l.verifiedHistory && l.serviceRecords > 0
      ? {
          icon: ShieldCheck,
          text: `${l.serviceRecords} service ${l.serviceRecords === 1 ? 'record' : 'records'} on file`,
          tone: 'good',
        }
      : { icon: ShieldOff, text: 'No service history', tone: 'muted' };
  }

  if (l.fitment) {
    return {
      icon: Car,
      text: l.fitment === 'Universal' ? 'Universal fit' : `Fits ${l.fitment}`,
      tone: 'neutral',
    };
  }
  return { icon: Info, text: 'Fitment not listed', tone: 'muted' };
};

const TONE_CLASS: Record<InfoLine['tone'], string> = {
  good: 'text-amber-300 light:text-amber-700',
  neutral: 'text-neutral-400 light:text-neutral-600',
  muted: 'text-neutral-600 light:text-neutral-400',
};

const ListingCard = ({ listing, layout = 'grid' }: ListingCardProps) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isList = layout === 'list';
  const [saved, setSaved] = useState(false);

  const specs = buildSpecs(listing);
  const info = buildInfoLine(listing);
  const InfoIcon = info.icon;

  return (
    <BorderGlow
      backgroundColor={isLight ? '#ffffff' : '#0a0a0a'}
      surfaceColor={isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.03)'}
      borderRadius={12}
      glowRadius={28}
      glowColor="45 90% 75%"
      glowIntensity={0.9}
      edgeSensitivity={35}
      coneSpread={22}
      colors={isLight ? ['#fbbf24', '#f59e0b', '#fde68a'] : ['#ffffff', '#fbbf24', '#fff7ed']}
      className="h-full w-full cursor-pointer transition-transform duration-300 hover:scale-99"
    >
      <div className={`h-full ${isList ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}>
        {/* Media */}
        <div
          className={`relative flex items-center justify-center overflow-hidden bg-white/[0.02] light:bg-black/[0.03] ${
            isList ? 'aspect-[16/10] sm:aspect-auto sm:w-64 sm:shrink-0' : 'aspect-[4/3]'
          }`}
        >
          {listing.imageUrl ? (
            <img src={listing.imageUrl} alt={listing.title} className="h-full w-full object-cover" />
          ) : (
            <Car size={44} className="text-neutral-700" strokeWidth={1.2} />
          )}

          {listing.verifiedHistory && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-amber-200 backdrop-blur-md light:bg-white/90 light:text-amber-700">
              <ShieldCheck size={12} />
              Verified
            </span>
          )}

          <button
            type="button"
            aria-label={saved ? 'Remove from saved' : 'Save listing'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved((s) => !s);
            }}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/50 backdrop-blur-md transition-colors hover:text-rose-400 light:border-black/10 light:bg-white/80 ${
              saved ? 'text-rose-400' : 'text-neutral-300 light:text-neutral-600'
            }`}
          >
            <Heart size={14} className={saved ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
          <div
            className={`flex min-w-0 flex-col gap-1 ${
              isList ? 'sm:flex-row sm:items-start sm:justify-between sm:gap-4' : ''
            }`}
          >
            <h3
              title={listing.title}
              className="truncate font-display text-base tracking-wide text-white light:text-neutral-900"
            >
              {listing.title}
            </h3>
            <p className="shrink-0 font-display text-xl text-white light:text-neutral-900">
              {formatPrice(listing.price)}
            </p>
          </div>

          {/* Spec strip: flex-1 cells so 2 or 3 specs both fill the row */}
          <ul
            className={`flex divide-x divide-white/10 rounded-lg border border-white/10 py-2 light:divide-black/10 light:border-black/10 ${
              isList ? 'sm:max-w-md' : ''
            }`}
          >
            {specs.map(({ icon: Icon, label, full }) => (
              <li
                key={full}
                title={full}
                aria-label={full}
                className="flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2 text-xs text-neutral-400 light:text-neutral-600"
              >
                <Icon size={13} className="shrink-0 text-neutral-500" />
                <span className="truncate">{label}</span>
              </li>
            ))}
          </ul>

          {/* Category-aware info line */}
          <p className={`flex items-center gap-1.5 text-xs ${TONE_CLASS[info.tone]}`}>
            <InfoIcon size={12} className="shrink-0" />
            <span className="truncate">{info.text}</span>
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-neutral-500 light:border-black/10">
            <span className="flex min-w-0 items-center gap-1">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{listing.location}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <Star size={12} className="fill-amber-300 text-amber-300" />
              {listing.sellerRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </BorderGlow>
  );
};

export default ListingCard;