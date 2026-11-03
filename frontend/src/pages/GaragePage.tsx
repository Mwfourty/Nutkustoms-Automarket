import {
  ArrowRight,
  Calendar,
  Camera,
  Car,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Gauge,
  Home,
  MessageCircle,
  Pencil,
  Plus,
  Settings2,
  Share2,
  ShieldCheck,
  Tag,
  User,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Stars from '../components/common/Stars';
import { AddRow, BTN, PANEL, Panel, Row } from '../components/garage/Panel';
import { myGarage, publicGarages } from '../lib/mockGarage';
import type { Garage, GarageCar } from '../types/garage';

type TabKey = 'service' | 'mods' | 'docs';

const formatKm = (km: number) => `${km.toLocaleString('en-ZA')} km`;
const formatPrice = (price: number) => `R${price.toLocaleString('en-ZA')}`;

// Same short form as the listing card: 8500 -> "8.5k km", 245000 -> "245k km".
// Worth moving into lib/format.ts and sharing between the two.
const formatKmShort = (km: number) => {
  if (km < 1000) return `${km} km`;
  const k = km / 1000;
  const label = k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k).toString();
  return `${label}k km`;
};

// crypto.randomUUID only exists on https / localhost.
const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const SEGMENT_ACTIVE = 'bg-white text-black light:bg-neutral-900 light:text-white';
const PRIMARY_BTN =
  'flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-display text-sm text-black light:bg-neutral-900 light:text-white';
const LINK_PANEL = `${PANEL} flex items-center justify-center gap-2 px-4 py-3 font-display text-sm text-neutral-200 light:text-neutral-800`;
const SCROLL_ROW =
  '-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const GaragePage = () => {
  const { garageId } = useParams();
  const [searchParams] = useSearchParams();
  const isOwn = garageId === undefined;
  const initial: Garage | undefined = isOwn ? myGarage : publicGarages[garageId];

  if (!initial) return <GarageNotFound />;
  return (
    <GarageView
      key={garageId ?? 'own'}
      initial={initial}
      isOwn={isOwn}
      initialCarId={searchParams.get('car')}
    />
  );
};

const GarageNotFound = () => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-black text-neutral-400 light:bg-[#f7f5f0]">
    <p>Garage not found.</p>
    <Link to="/" className="text-amber-300 light:text-amber-600">
      Back to browse
    </Link>
  </div>
);

const GarageView = ({
  initial,
  isOwn,
  initialCarId,
}: {
  initial: Garage;
  isOwn: boolean;
  initialCarId: string | null;
}) => {
  const [garage, setGarage] = useState(initial);
  const [selectedId, setSelectedId] = useState(
    initial.cars.find((c) => c.id === initialCarId)?.id ?? initial.cars[0].id,
  );
  const [tab, setTab] = useState<TabKey>('service');
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);

  const { owner, cars } = garage;
  const car = cars.find((c) => c.id === selectedId) ?? cars[0];
  const otherCars = cars.filter((c) => c.id !== car.id);

  const updateCar = (patch: (c: GarageCar) => GarageCar) =>
    setGarage((g) => ({ ...g, cars: g.cars.map((c) => (c.id === car.id ? patch(c) : c)) }));

  const share = async () => {
    const url = window.location.href;
    // Native share sheet on phones, clipboard everywhere else.
    const useSheet = typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches;
    try {
      if (useSheet) {
        await navigator.share({ title: car.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Share sheet dismissed, or clipboard unavailable on an insecure origin.
    }
  };

  const specs = [
    { icon: Calendar, label: String(car.year), full: `Year: ${car.year}` },
    { icon: Gauge, label: formatKmShort(car.mileageKm), full: `Mileage: ${formatKm(car.mileageKm)}` },
    { icon: Settings2, label: car.transmission, full: `Transmission: ${car.transmission}` },
  ];

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'service', label: 'Service', count: car.service.length },
    { key: 'mods', label: 'Mods', count: car.mods.length },
    { key: 'docs', label: 'Docs', count: car.docs.length },
  ];

  // Below lg only the selected tab's panel shows; from lg up all three stack.
  const panelVisibility = (key: TabKey) => `${tab === key ? 'block' : 'hidden'} lg:block`;

  const viewAll = (
    <button type="button" className="flex items-center gap-1 text-xs font-medium text-neutral-300 light:text-neutral-700">
      View all <ArrowRight size={12} />
    </button>
  );

  return (
    <>
        <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-5 px-4 pb-6 pt-2 sm:px-6 lg:flex-row lg:px-10 lg:py-8">
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
            {/* Hero */}
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] sm:aspect-[16/7] lg:aspect-auto lg:h-64 light:border-black/10 light:bg-black/[0.04]">
              <Car size={64} strokeWidth={1} className="text-neutral-600" />
              <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/50 text-neutral-300 light:border-black/10 light:bg-white/80 light:text-neutral-600">
                <Camera size={14} />
              </span>
            </div>

            {/* Car switcher (mobile). The desktop equivalent lives in the sidebar. */}
            {(cars.length > 1 || isOwn) && (
              <div className={`${SCROLL_ROW} lg:hidden`}>
                {cars.map((c) => {
                  const active = c.id === car.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedId(c.id)}
                      className={`w-44 shrink-0 snap-start rounded-xl border p-3 text-left transition-colors ${
                        active
                          ? 'border-amber-200/50 bg-white/10 light:border-amber-500/60 light:bg-black/5'
                          : 'border-white/10 bg-white/[0.03] light:border-black/10'
                      }`}
                    >
                      <p className="truncate font-display text-sm text-white light:text-neutral-900">{c.title}</p>
                      <p className="mt-0.5 truncate text-xs text-neutral-500">
                        {c.year}
                        {c.price !== undefined && <> &bull; {formatPrice(c.price)}</>}
                      </p>
                    </button>
                  );
                })}
                {isOwn && (
                  <button
                    type="button"
                    className="flex w-28 shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 p-3 text-xs text-neutral-400 light:border-black/20 light:text-neutral-600"
                  >
                    <Plus size={16} />
                    Add car
                  </button>
                )}
              </div>
            )}

            {/* Title, price, specs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="font-display text-xl font-semibold text-white lg:text-2xl light:text-neutral-900">
                    {car.title}
                  </h1>
                  {car.price !== undefined && (
                    <p className="mt-1 font-display text-lg text-white light:text-neutral-900">
                      {formatPrice(car.price)}
                    </p>
                  )}
                </div>
                {!isOwn && (
                  <span className={`${BTN} pointer-events-none hidden shrink-0 sm:flex`}>
                    <ShieldCheck size={13} /> Public Garage
                  </span>
                )}
              </div>

              <ul className="grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 py-2 lg:max-w-md light:divide-black/10 light:border-black/10">
                {specs.map(({ icon: Icon, label, full }) => (
                  <li
                    key={full}
                    title={full}
                    className="flex min-w-0 items-center justify-center gap-1.5 px-2 text-xs text-neutral-400 light:text-neutral-600"
                  >
                    <Icon size={13} className="shrink-0 text-neutral-500" />
                    <span className="truncate">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Owner strip (mobile, public garages). The desktop card is in the sidebar. */}
            {!isOwn && (
              <Link to={`/profile/${owner.id}`} className={`${PANEL} flex items-center gap-3 p-3 lg:hidden`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-neutral-400 light:bg-black/5">
                  <User size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-semibold text-white light:text-neutral-900">
                    {owner.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Stars rating={owner.rating} /> ({owner.reviews}) &bull; Since {owner.memberSince}
                  </span>
                </span>
                <ArrowRight size={14} className="shrink-0 text-neutral-500" />
              </Link>
            )}

            {/* Actions: equal-width on mobile, compact on desktop */}
            <div className={`grid gap-2 lg:flex ${isOwn ? 'grid-cols-3' : 'grid-cols-[2fr_1fr]'}`}>
              {isOwn ? (
                <>
                  <button type="button" className={`${BTN} w-full justify-center lg:w-auto`}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic((p) => !p)}
                    className={`${BTN} w-full justify-center lg:w-auto`}
                  >
                    {isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
                    {isPublic ? 'Public' : 'Private'}
                  </button>
                </>
              ) : (
                <button type="button" className={`${PRIMARY_BTN} !py-2.5 text-xs font-medium lg:w-auto`}>
                  <MessageCircle size={13} /> Message owner
                </button>
              )}
              <button type="button" onClick={share} className={`${BTN} w-full justify-center lg:w-auto`}>
                <Share2 size={13} /> {copied ? 'Copied' : 'Share'}
              </button>
            </div>

            {/* Section switcher (mobile only) */}
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/5 p-1 lg:hidden light:border-black/10 light:bg-black/5">
              {tabs.map(({ key, label, count }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={tab === key}
                  onClick={() => setTab(key)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors ${
                    tab === key ? SEGMENT_ACTIVE : 'text-neutral-400 light:text-neutral-500'
                  }`}
                >
                  {label}
                  <span className="text-[10px] opacity-60">{count}</span>
                </button>
              ))}
            </div>

            <div className={panelVisibility('service')}>
              <Panel icon={CheckCircle2} title="Service history" action={viewAll}>
                {car.service.map((s) => (
                  <Row
                    key={s.id}
                    icon={CheckCircle2}
                    primary={s.title}
                    secondary={s.date}
                    trailing={<span className="whitespace-nowrap text-xs text-neutral-500">{formatKm(s.km)}</span>}
                  />
                ))}
                {car.service.length === 0 && !isOwn && <p className="py-3 text-sm text-neutral-500">No records yet.</p>}
                {isOwn && (
                  <AddRow
                    label="Add service record"
                    primaryPlaceholder="Service, e.g. Oil change"
                    secondaryPlaceholder="Mileage (km)"
                    onAdd={(title, km) =>
                      updateCar((c) => ({
                        ...c,
                        service: [
                          {
                            id: newId(),
                            title,
                            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            km: Number(km.replace(/\D/g, '')) || c.mileageKm,
                          },
                          ...c.service,
                        ],
                      }))
                    }
                  />
                )}
              </Panel>
            </div>

            <div className={panelVisibility('mods')}>
              <Panel icon={Wrench} title="Modifications">
                {car.mods.map((m) => (
                  <Row key={m.id} icon={Wrench} primary={m.part} secondary={m.detail} />
                ))}
                {car.mods.length === 0 && !isOwn && <p className="py-3 text-sm text-neutral-500">No modifications listed.</p>}
                {isOwn && (
                  <AddRow
                    label="Add modification"
                    primaryPlaceholder="Part, e.g. Exhaust"
                    secondaryPlaceholder="Details"
                    onAdd={(part, detail) => updateCar((c) => ({ ...c, mods: [...c.mods, { id: newId(), part, detail }] }))}
                  />
                )}
              </Panel>
            </div>

            <div className={panelVisibility('docs')}>
              <Panel icon={FolderOpen} title="Documents" action={viewAll}>
                {car.docs.map((d) => (
                  <Row
                    key={d.id}
                    icon={FileText}
                    primary={d.name}
                    secondary={d.meta}
                    trailing={<Download size={14} className="text-neutral-500" />}
                  />
                ))}
                {car.docs.length === 0 && !isOwn && <p className="py-3 text-sm text-neutral-500">No documents shared.</p>}
                {isOwn && (
                  <AddRow
                    label="Upload document"
                    primaryPlaceholder="File name, e.g. Invoice.pdf"
                    secondaryPlaceholder="Notes (optional)"
                    onAdd={(name, meta) =>
                      updateCar((c) => ({ ...c, docs: [...c.docs, { id: newId(), name, meta: meta || 'PDF' }] }))
                    }
                  />
                )}
              </Panel>
            </div>
          </div>

          {/* On mobile the owner and car switcher are above, so the sidebar is just the CTAs */}
          <aside className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
            <section className={`${PANEL} hidden flex-col items-center p-5 text-center lg:flex`}>
              <h2 className="mb-4 flex items-center gap-2 self-start font-display text-xs font-semibold uppercase tracking-widest text-neutral-200 light:text-neutral-900">
                <User size={14} /> {isOwn ? 'My profile' : 'Owner'}
              </h2>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-neutral-400 light:bg-black/5">
                <User size={22} />
              </span>
              <p className="mt-3 font-display text-sm font-semibold text-white light:text-neutral-900">{owner.name}</p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                <Stars rating={owner.rating} /> ({owner.reviews})
              </div>
              <p className="mt-1 text-xs text-neutral-500">Member since {owner.memberSince}</p>
              <Link
                to={isOwn ? '/profile' : `/profile/${owner.id}`}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-neutral-200 light:text-neutral-800"
              >
                {isOwn ? 'Edit profile' : 'View full profile'} <ArrowRight size={12} />
              </Link>
            </section>

            <div className="hidden lg:block">
              <Panel icon={Home} title={isOwn ? 'My other cars' : 'More from this garage'} action={!isOwn ? viewAll : undefined}>
                {otherCars.map((c) => (
                  <button key={c.id} type="button" onClick={() => setSelectedId(c.id)} className="text-left">
                    <Row
                      icon={Car}
                      primary={c.title}
                      secondary={`${c.year} \u2022 ${c.transmission} \u2022 ${formatKm(c.mileageKm)}`}
                      trailing={
                        isOwn ? (
                          <Pencil size={13} className="text-neutral-500" />
                        ) : (
                          c.price !== undefined && (
                            <span className="text-xs font-semibold text-white light:text-neutral-900">{formatPrice(c.price)}</span>
                          )
                        )
                      }
                    />
                  </button>
                ))}
                {otherCars.length === 0 && <p className="py-3 text-sm text-neutral-500">No other cars.</p>}
              </Panel>
            </div>

            {isOwn ? (
              <>
                <button type="button" className={`${PRIMARY_BTN} hidden lg:flex`}>
                  + Add car to garage
                </button>
                <Link to="/sell" className={LINK_PANEL}>
                  <Tag size={14} /> Sell this car
                </Link>
              </>
            ) : (
              <Link to="/" className={LINK_PANEL}>
                Browse garage listings <ArrowRight size={14} />
              </Link>
            )}
          </aside>
        </main>

        <div className="mx-auto mb-6 w-full max-w-[1700px] px-4 sm:px-6 lg:px-10">
          <div className={`${PANEL} flex flex-col items-start justify-between gap-3 px-5 py-3 text-xs text-neutral-500 sm:flex-row sm:items-center`}>
            <span className="flex items-start gap-2">
              {!isOwn && <ShieldCheck size={13} className="mt-0.5 shrink-0" />}
              {isOwn
                ? 'Please ensure that all information is accurate.'
                : 'All information is provided by the owner. Verify details and inspect any vehicle before purchase.'}
            </span>
            {isOwn ? (
              <Link to="/garage/alex-mechanic" className={BTN}>
                <Eye size={13} /> Public Garage
              </Link>
            ) : (
              <span>Nutkustoms Automarket &bull; Private &amp; Public Garages</span>
            )}
          </div>
        </div>
    </>
  );
};

export default GaragePage;