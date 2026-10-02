import { Car, Heart, MapPin, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';
import BorderGlow from '../effects/BorderGlow';
import { useTheme } from '../../context/ThemeContext';
import type { StoreListing } from '../../types/listing';

interface ListingCardProps {
  listing: StoreListing;
  layout?: 'grid' | 'list';
}

const formatPrice = (price: number) => `R ${price.toLocaleString('en-ZA')}`;
const formatMileage = (mileage: number) => `${mileage.toLocaleString('en-ZA')} km`;

const ListingCard = ({ listing, layout = 'grid' }: ListingCardProps) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isList = layout === 'list';
  const [saved, setSaved] = useState(false);

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
      className="w-full cursor-pointer transition-transform duration-300 hover:scale-99"
    >
      <div className={isList ? 'flex flex-col sm:flex-row' : 'flex flex-col'}>
        <div
          className={`relative flex items-center justify-center bg-white/[0.02] light:bg-black/[0.03] ${
            isList ? 'h-44 sm:h-auto sm:min-h-40 sm:w-60 sm:shrink-0' : 'h-52'
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
              Verified history
            </span>
          )}

          <button
            type="button"
            aria-label={saved ? 'Remove from saved' : 'Save listing'}
            onClick={() => setSaved((s) => !s)}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/50 backdrop-blur-md transition-colors hover:text-rose-400 light:border-black/10 light:bg-white/80 ${
              saved ? 'text-rose-400' : 'text-neutral-300 light:text-neutral-600'
            }`}
          >
            <Heart size={14} className={saved ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 px-5 py-5">
          <h3 className="font-display text-base tracking-wide text-white light:text-neutral-900">
            {listing.title}
          </h3>
          <p className="text-xs text-neutral-500">
            {listing.year} &bull; {listing.transmission} &bull; {formatMileage(listing.mileageKm)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
            <MapPin size={11} />
            {listing.location}
            {listing.verifiedHistory && <> &bull; {listing.serviceRecords} service records</>}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-lg text-white light:text-neutral-900">
              {formatPrice(listing.price)}
            </p>
            <span className="flex items-center gap-1 text-xs text-neutral-500">
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
