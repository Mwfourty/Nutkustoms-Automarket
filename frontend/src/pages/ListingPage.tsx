import {
  ArrowLeft, BadgeCheck, Car, ChevronLeft, ChevronRight, Heart, MapPin,
  MessageCircle, User, Wrench, X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Stars from '../components/common/Stars';
import {
  buildSpecRows,
  CONDITION_LABEL,
  STATUS_LABEL,
} from '../components/listing/listingSpecs';
import { useMessageUser } from '../hooks/useMessageUser';
import { ApiError } from '../services/apiClient';
import { getCurrentUser } from '../services/authApi';
import { isLoggedIn } from '../services/session';
import { getListing, type ListingDetail } from '../services/listingsApi';
import { saveListing, unsaveListing } from '../services/usersApi';

const PANEL =
  'rounded-2xl border border-white/10 bg-white/[0.03] p-5 light:border-black/10 light:bg-white/80';

const ListingPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { message, busy, error: messageError } = useMessageUser();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getListing(id)
      .then((result) => {
        if (!cancelled) {
          setListing(result);
          setError('');
          setActive(0);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError && err.status === 404
            ? 'This listing could not be found.'
            : 'Could not load this listing.'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    if (isLoggedIn()) {
      getCurrentUser()
        .then((me) => {
          if (!cancelled) setMyId(me.userId);
        })
        .catch(() => undefined);
    }
    return () => {
      cancelled = true;
    };
  }, [id]);

  const images = listing?.images ?? [];
  const step = (delta: number) =>
    setActive((i) => (images.length ? (i + delta + images.length) % images.length : 0));

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (loading) {
    return <p className="py-32 text-center text-sm text-neutral-500">Loading listing…</p>;
  }
  if (error || !listing) {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-neutral-400">
        <p className="text-sm">{error || 'Listing not found.'}</p>
        <Link to="/" className="text-sm text-amber-300 hover:underline">Back to browse</Link>
      </div>
    );
  }

  const isOwner = myId !== null && myId === listing.sellerId;
  const seller = listing.seller;
  const sellerName = `${seller.firstName} ${seller.lastName}`.trim() || seller.username;
  const specs = buildSpecRows(listing);
  const current = images[active];
  const [saved, likes] = [listing.isSaved, listing.likeCount];

  const toggleSave = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    if (isOwner) return;
    const next = !saved;
    const apply = (isSaved: boolean, delta: number) =>
      setListing((l) =>
        l ? { ...l, isSaved, likeCount: Math.max(0, l.likeCount + delta) } : l
      );
    apply(next, next ? 1 : -1);
    try {
      if (next) await saveListing(listing.id);
      else await unsaveListing(listing.id);
    } catch {
      apply(!next, next ? -1 : 1);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1300px] flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-neutral-400 hover:text-white light:hover:text-neutral-900"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] light:border-black/10 light:bg-black/[0.03]">
            {current ? (
              <button
                type="button"
                aria-label="Open full-size image"
                onClick={() => setLightbox(true)}
                className="h-full w-full cursor-zoom-in"
              >
                <img src={current.url} alt={listing.title} className="h-full w-full object-cover" />
              </button>
            ) : (
              <Car size={72} strokeWidth={1} className="text-neutral-700" />
            )}
            {images.length > 1 && (
              <>
                <button type="button" aria-label="Previous image" onClick={() => step(-1)} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" aria-label="Next image" onClick={() => step(1)} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                  <ChevronRight size={18} />
                </button>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                  {active + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-10">
              {images.map((img, i) => (
                <li key={img.id}>
                  <button
                    type="button"
                    aria-label={`Show image ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`block aspect-square w-full overflow-hidden rounded-lg border-2 ${
                      i === active ? 'border-amber-300' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className={`${PANEL} mt-6`}>
            <h2 className="mb-3 font-display text-lg text-white light:text-neutral-900">Description</h2>
            <p className="whitespace-pre-line text-sm text-neutral-300 light:text-neutral-700">
              {listing.description || 'No description provided.'}
            </p>
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <div className={PANEL}>
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl text-white light:text-neutral-900">{listing.title}</h1>
              <button
                type="button"
                aria-pressed={saved}
                aria-label={saved ? 'Remove from saved' : 'Save listing'}
                onClick={() => void toggleSave()}
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-sm tabular-nums transition-colors hover:text-rose-400 light:border-black/10 ${
                  saved ? 'text-rose-400' : 'text-neutral-300 light:text-neutral-600'
                }`}
              >
                <Heart size={16} className={saved ? 'fill-current' : ''} /> {likes}
              </button>
            </div>
            <p className="mt-2 font-display text-3xl text-amber-300 light:text-amber-600">
              R {listing.price.toLocaleString('en-ZA')}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
              <span>{CONDITION_LABEL[listing.condition]}</span>
              <span>{STATUS_LABEL[listing.status]}</span>
              {listing.location && (
                <span className="flex items-center gap-1"><MapPin size={12} /> {listing.location}</span>
              )}
              <span>Listed {new Date(listing.createdAt).toLocaleDateString('en-ZA')}</span>
            </div>

            {!isOwner && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void message(listing.sellerId)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 font-display text-sm text-black disabled:opacity-60 light:bg-neutral-900 light:text-white"
              >
                <MessageCircle size={15} /> Message owner
              </button>
            )}
            {messageError && <p className="mt-2 text-xs text-rose-400">{messageError}</p>}
          </div>

          <div className={PANEL}>
            <h2 className="mb-3 font-display text-lg text-white light:text-neutral-900">Owner</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
                {seller.profileImageUrl ? (
                  <img src={seller.profileImageUrl} alt={sellerName} className="h-full w-full object-cover" />
                ) : (
                  <User size={20} className="text-neutral-500" />
                )}
              </div>
              <div className="min-w-0">
                <Link to={`/profile/${seller.id}`} className="flex items-center gap-1 truncate text-sm font-medium text-white hover:underline light:text-neutral-900">
                  {sellerName}
                  {seller.isVerified && <BadgeCheck size={14} className="text-amber-300" />}
                </Link>
                <p className="text-xs text-neutral-500">@{seller.username}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                  <Stars rating={seller.averageRating} /> ({seller.reviewCount})
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Member since {new Date(seller.memberSince).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' })}
            </p>
            {listing.sourceGarageVehicleId && (
              <Link
                to={`/garages/${listing.sellerId}?car=${listing.sourceGarageVehicleId}`}
                className="mt-3 flex items-center gap-2 text-sm text-amber-300 hover:underline"
              >
                <Wrench size={14} /> View service history in garage
              </Link>
            )}
          </div>

          {specs.length > 0 && (
            <div className={PANEL}>
              <h2 className="mb-3 font-display text-lg text-white light:text-neutral-900">Details</h2>
              <dl className="divide-y divide-white/10 text-sm light:divide-black/10">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2">
                    <dt className="text-neutral-500">{label}</dt>
                    <dd className="text-right text-neutral-200 light:text-neutral-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
      </div>

      {lightbox && current && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button type="button" aria-label="Close" className="absolute right-4 top-4 text-white" onClick={() => setLightbox(false)}>
            <X size={26} />
          </button>
          {images.length > 1 && (
            <>
              <button type="button" aria-label="Previous image" className="absolute left-4 text-white" onClick={(e) => { e.stopPropagation(); step(-1); }}>
                <ChevronLeft size={36} />
              </button>
              <button type="button" aria-label="Next image" className="absolute right-4 text-white" onClick={(e) => { e.stopPropagation(); step(1); }}>
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <img
            src={current.url}
            alt={listing.title}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
};

export default ListingPage;
