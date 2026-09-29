import { Car, Heart } from 'lucide-react';
import BorderGlow from '../effects/BorderGlow';
import type { StoreListing } from '../../types/listing';

interface ListingCardProps {
  listing: StoreListing;
}

const formatPrice = (price: number) =>
  `R ${price.toLocaleString('en-ZA')}`;

const formatMileage = (mileage: number) =>
  `${mileage.toLocaleString('en-ZA')} km`;

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <BorderGlow
      backgroundColor="#0a0a0a"
      borderRadius={24}
      glowRadius={28}
      glowColor="45 90% 75%"
      glowIntensity={0.9}
      edgeSensitivity={35}
      coneSpread={22}
      colors={['#ffffff', '#fbbf24', '#fff7ed']}
      className="w-full cursor-pointer transition-transform duration-300 hover:scale-99"
    >
      <div className="relative flex h-44 items-center justify-center bg-white/[0.02]">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Car size={40} className="text-neutral-700" strokeWidth={1.2} />
        )}
        <button
          type="button"
          aria-label="Save listing"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-neutral-300 backdrop-blur-md transition-colors hover:text-rose-400"
        >
          <Heart size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-1 px-5 py-5">
        <h3 className="font-display text-base tracking-wide text-white">
          {listing.title}
        </h3>
        <p className="text-xs text-neutral-500">
          {listing.year} &bull; {listing.transmission} &bull;{' '}
          {formatMileage(listing.mileageKm)}
        </p>
        <p className="mt-1 font-display text-lg text-white/200">
          {formatPrice(listing.price)}
        </p>
      </div>
    </BorderGlow>
  );
};

export default ListingCard;
