import { ArrowRight, Car, Link2, MapPin, RotateCw, Search, Tag, User, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import GlowCard from '../components/common/Glowcard';
import { getGarageDirectory, type GarageDirectoryEntry } from '../services/garageApi';

const INPUT =
  'w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-amber-300/60 light:border-black/10 light:bg-white light:text-neutral-900';

// Same column steps as the store's listing grid, so the two pages feel like one product.
const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';

const MAX_TITLES = 2;

/** Mirrors ListingCard: media on top, title row, spec strip, info line, bordered footer. */
const GarageCard = ({ garage }: { garage: GarageDirectoryEntry }) => {
  const name = `${garage.firstName} ${garage.lastName}`.trim() || garage.username;
  const place = [garage.city, garage.province].filter(Boolean).join(', ');
  const titles = garage.vehicleTitles.slice(0, MAX_TITLES);
  const hiddenCount = Math.max(0, garage.vehicleCount - titles.length);
  const allTitles = garage.vehicleTitles.join(', ');
  const titleLine = titles.length
    ? `${titles.join(' \u00b7 ')}${hiddenCount > 0 ? ` +${hiddenCount}` : ''}`
    : 'No cars listed';

  const specs: { icon: LucideIcon; label: string }[] = [
    { icon: Car, label: `${garage.vehicleCount} ${garage.vehicleCount === 1 ? 'car' : 'cars'}` },
    { icon: Tag, label: `${garage.forSaleCount} for sale` },
  ];

  return (
    <Link
      to={`/garages/${garage.ownerId}`}
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60"
    >
      <GlowCard>
        <div className="flex h-full flex-col">
          {/* Media */}
          <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-white/[0.02] light:bg-black/[0.03]">
            {garage.coverImageUrl ? (
              <img src={garage.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <Car size={44} className="text-neutral-700" strokeWidth={1.2} />
            )}

            {garage.forSaleCount > 0 && (
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-amber-200 backdrop-blur-md light:bg-white/90 light:text-amber-700">
                <Tag size={12} />
                Has cars for sale
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-neutral-400 light:border-black/10 light:bg-black/5">
                {garage.profileImageUrl ? (
                  <img src={garage.profileImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </span>
              <div className="min-w-0">
                <h3 title={name} className="truncate font-display text-base tracking-wide text-white light:text-neutral-900">
                  {name}
                </h3>
                <p className="truncate text-xs text-neutral-500">@{garage.username}</p>
              </div>
            </div>

            {/* Spec strip */}
            <ul className="flex divide-x divide-white/10 rounded-lg border border-white/10 py-2 light:divide-black/10 light:border-black/10">
              {specs.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2 text-xs text-neutral-400 light:text-neutral-600"
                >
                  <Icon size={13} className="shrink-0 text-neutral-500" />
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>

            {/* Info line: what's in the garage. Always one line, so card heights match. */}
            <p
              title={allTitles || undefined}
              className={`flex items-center gap-1.5 text-xs ${
                titles.length ? 'text-neutral-400 light:text-neutral-600' : 'text-neutral-600 light:text-neutral-400'
              }`}
            >
              <Car size={12} className="shrink-0" />
              <span className="truncate">{titleLine}</span>
            </p>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-neutral-500 light:border-black/10">
              <span className="flex min-w-0 items-center gap-1">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">{place || 'Location not listed'}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-neutral-400 transition-colors group-hover:text-white light:text-neutral-500 light:group-hover:text-neutral-900">
                View garage <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
};

const SkeletonGrid = () => (
  <div aria-hidden className={GRID}>
    {Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="h-80 animate-pulse rounded-xl border border-white/10 bg-white/[0.03] light:border-black/10 light:bg-black/[0.03]"
      />
    ))}
  </div>
);

const Message = ({ icon: Icon, children, action }: { icon: LucideIcon; children: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center text-neutral-500">
    <Icon size={28} strokeWidth={1.5} />
    <p className="text-sm">{children}</p>
    {action}
  </div>
);

const GaragesPage = () => {
  const [search, setSearch] = useState('');
  const [forSaleOnly, setForSaleOnly] = useState(false);
  const [garages, setGarages] = useState<GarageDirectoryEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const firstLoad = useRef(true);

  useEffect(() => {
    let cancelled = false;

    // Debounced so typing doesn't fire a request per keystroke. The first load goes straight out.
    const delay = firstLoad.current ? 0 : 300;
    firstLoad.current = false;

    const timer = setTimeout(() => {
      setLoading(true);
      getGarageDirectory(search)
        .then((page) => {
          if (cancelled) return;
          setGarages(page.items);
          setError(null);
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load garages.');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, reloadKey]);

  const retry = () => {
    setError(null);
    setGarages(null);
    setReloadKey((k) => k + 1);
  };

  // Client-side, so it only filters the garages that are already loaded.
  const shown = garages && forSaleOnly ? garages.filter((g) => g.forSaleCount > 0) : garages;

  return (
    <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-5 px-4 pb-6 pt-2 sm:px-6 lg:px-10 lg:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block flex-1 sm:max-w-xl">
          <span className="sr-only">Search garages</span>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            className={INPUT}
            placeholder="Search by owner, city or car (e.g. Polo)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <button
            type="button"
            aria-pressed={forSaleOnly}
            onClick={() => setForSaleOnly((v) => !v)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              forSaleOnly
                ? 'border-transparent bg-white text-black light:bg-neutral-900 light:text-white'
                : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 light:border-black/10 light:bg-black/5 light:text-neutral-700'
            }`}
          >
            Has cars for sale
          </button>
          {shown && (
            <span aria-live="polite" className="text-xs text-neutral-500">
              {shown.length} {shown.length === 1 ? 'garage' : 'garages'}
            </span>
          )}
        </div>
      </div>

      {error ? (
        <Message
          icon={RotateCw}
          action={
            <button
              type="button"
              onClick={retry}
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-neutral-200 hover:bg-white/5 light:border-black/10 light:text-neutral-800"
            >
              Try again
            </button>
          }
        >
          {error}
        </Message>
      ) : shown === null ? (
        <SkeletonGrid />
      ) : shown.length === 0 ? (
        <Message icon={Search}>
          {search.trim() || forSaleOnly ? 'No garages match your search.' : 'No public garages yet.'}
        </Message>
      ) : (
        <div className={`${GRID} transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {shown.map((g) => (
            <GarageCard key={g.ownerId} garage={g} />
          ))}
        </div>
      )}

      {/* mt-auto pins the note to the bottom of the page, even when there are only a few garages */}
      <p className="mt-auto flex items-start gap-2 pt-4 text-xs text-neutral-500">
        <Link2 size={13} className="mt-0.5 shrink-0" />
        Private cars aren&apos;t listed here. If an owner shares a link to one, it opens like any other garage page.
      </p>
    </main>
  );
};

export default GaragesPage;