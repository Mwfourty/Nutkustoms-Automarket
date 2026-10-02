import { ArrowRight, Car, Eye, Heart, MessageCircle, Trophy, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Stars from '../common/Stars';
import { getCarOfTheWeek } from '../../lib/mockGarage';

const { car, owner, link } = getCarOfTheWeek();

const compact = (n: number) =>
  new Intl.NumberFormat('en-ZA', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

const CarOfTheWeek = () => (
  <section className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl light:border-black/10 light:bg-white/80 light:shadow-sm">
    <div className="flex flex-col lg:flex-row">
      <div className="relative flex h-64 items-center justify-center bg-white/[0.02] lg:h-auto lg:min-h-72 lg:w-[45%] light:bg-black/[0.03]">
        <Car size={72} strokeWidth={1} className="text-neutral-700" />
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md bg-amber-300 px-2.5 py-1 font-display text-xs font-semibold uppercase tracking-widest text-black">
          <Trophy size={13} />
          Car of the week
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 p-6 lg:p-10">
        <div>
          <h2 className="font-display text-3xl font-semibold text-white light:text-neutral-900">{car.title}</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {car.year} &bull; {car.transmission} &bull; {car.mileageKm.toLocaleString('en-ZA')} km
          </p>
        </div>

        <p className="text-sm text-neutral-400 light:text-neutral-600">
          The most loved build in the community this week, from {owner.name}&rsquo;s garage.
        </p>

        <div className="flex flex-wrap gap-6 text-sm">
          <span className="flex items-center gap-2 text-neutral-300 light:text-neutral-700">
            <Eye size={15} className="text-neutral-500" /> {compact(car.views ?? 0)} views
          </span>
          <span className="flex items-center gap-2 text-neutral-300 light:text-neutral-700">
            <Heart size={15} className="text-rose-400" /> {compact(car.likes ?? 0)} likes
          </span>
          <span className="flex items-center gap-2 text-neutral-300 light:text-neutral-700">
            <Wrench size={15} className="text-neutral-500" /> {car.mods.length} mods
          </span>
        </div>

        {car.mods.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {car.mods.slice(0, 4).map((m) => (
              <span key={m.id} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-neutral-300 light:border-black/10 light:text-neutral-700">
                {m.detail}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Stars rating={owner.rating} /> {owner.name} ({owner.reviews})
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={link} className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-display text-sm text-black light:bg-neutral-900 light:text-white">
            View in garage <ArrowRight size={14} />
          </Link>
          <Link to="/messages" className="flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 font-display text-sm text-neutral-200 transition-colors hover:border-white/25 light:border-black/10 light:text-neutral-800 light:hover:border-black/25">
            <MessageCircle size={14} /> Message owner
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CarOfTheWeek;
