import { ArrowRight, Car, Heart, MessageCircle, Trophy, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Stars from '../common/Stars';
import { useMessageUser } from '../../hooks/useMessageUser';
import { getCarOfTheWeek, type CarOfTheWeekData } from '../../services/listingsApi';
import { getCurrentUser } from '../../services/authApi';
import { isLoggedIn } from '../../services/session';

const CarOfTheWeek = () => {
  const [data, setData] = useState<CarOfTheWeekData | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const { message, busy, error } = useMessageUser();

  useEffect(() => {
    let cancelled = false;
    getCarOfTheWeek()
      .then((result) => {
        if (!cancelled) setData(result ?? null);
      })
      .catch(() => {
        if (!cancelled) setData(null);
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
  }, []);

  if (!data) return null;

  const link =
    data.kind === 'listing'
      ? `/listings/${data.id}`
      : `/garages/${data.ownerId}?car=${data.id}`;
  const details = [
    data.year > 0 ? data.year : null,
    data.transmission,
    data.mileage > 0 ? `${data.mileage.toLocaleString('en-ZA')} km` : null,
  ].filter(Boolean);

  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl light:border-black/10 light:bg-white/80 light:shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-white/[0.02] lg:h-auto lg:min-h-72 lg:w-[45%] light:bg-black/[0.03]">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt={data.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <Car size={72} strokeWidth={1} className="text-neutral-700" />
          )}
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md bg-amber-300 px-2.5 py-1 font-display text-xs font-semibold uppercase tracking-widest text-black">
            <Trophy size={13} />
            Car of the week
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4 p-6 lg:p-10">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white light:text-neutral-900">{data.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{details.join(' • ')}</p>
          </div>

          <p className="text-sm text-neutral-400 light:text-neutral-600">
            The most loved car in the community, from {data.ownerName}&rsquo;s{' '}
            {data.kind === 'listing' ? 'listing' : 'garage'}.
          </p>

          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2 text-neutral-300 light:text-neutral-700">
              <Heart size={15} className="text-rose-400" /> {data.likeCount} {data.likeCount === 1 ? 'like' : 'likes'}
            </span>
            {data.mods.length > 0 && (
              <span className="flex items-center gap-2 text-neutral-300 light:text-neutral-700">
                <Wrench size={15} className="text-neutral-500" /> {data.mods.length}+ mods
              </span>
            )}
          </div>

          {data.mods.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.mods.map((m) => (
                <span key={m} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-neutral-300 light:border-black/10 light:text-neutral-700">
                  {m}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Stars rating={data.ownerRating} /> {data.ownerName} ({data.ownerReviewCount})
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to={link} className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-display text-sm text-black light:bg-neutral-900 light:text-white">
              {data.kind === 'listing' ? 'View listing' : 'View in garage'} <ArrowRight size={14} />
            </Link>
            {myId !== data.ownerId && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void message(data.ownerId)}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 font-display text-sm text-neutral-200 transition-colors hover:border-white/25 disabled:opacity-60 light:border-black/10 light:text-neutral-800 light:hover:border-black/25"
              >
                <MessageCircle size={14} /> Message owner
              </button>
            )}
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default CarOfTheWeek;
