import {
  ArrowRight,
  Camera,
  Car,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Home,
  MessageCircle,
  Pencil,
  Share2,
  ShieldCheck,
  Tag,
  User,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import LightRays from '../components/effects/LightRays';
import Navbar from '../components/store/Navbar';
import Footer from '../components/store/Footer';
import Stars from '../components/common/Stars';
import { AddRow, BTN, PANEL, Panel, Row } from '../components/garage/Panel';
import { useTheme } from '../context/ThemeContext';
import { myGarage, publicGarages } from '../lib/mockGarage';
import type { Garage, GarageCar } from '../types/garage';

const formatKm = (km: number) => `${km.toLocaleString('en-ZA')} km`;
const formatPrice = (price: number) => `R${price.toLocaleString('en-ZA')}`;
const carMeta = (car: GarageCar) =>
  `${car.year} \u2022 ${car.transmission} \u2022 ${formatKm(car.mileageKm)}`;

const GaragePage = () => {
  const { garageId } = useParams();
  const [searchParams] = useSearchParams();
  const isOwn = garageId === undefined;
  const initial: Garage | undefined = isOwn ? myGarage : publicGarages[garageId];

  if (!initial) return <GarageNotFound />;
  return <GarageView key={garageId ?? 'own'} initial={initial} isOwn={isOwn} initialCarId={searchParams.get('car')} />;
};

const GarageNotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black text-neutral-400 light:bg-[#f7f5f0]">
    <p>Garage not found.</p>
    <Link to="/" className="text-amber-300 light:text-amber-600">
      Back to browse
    </Link>
  </div>
);

const GarageView = ({ initial, isOwn, initialCarId }: { initial: Garage; isOwn: boolean; initialCarId: string | null }) => {
  const { theme } = useTheme();
  const [garage, setGarage] = useState(initial);
  const [selectedId, setSelectedId] = useState(
    initial.cars.find((c) => c.id === initialCarId)?.id ?? initial.cars[0].id,
  );
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);

  const { owner, cars } = garage;
  const car = cars.find((c) => c.id === selectedId) ?? cars[0];
  const otherCars = cars.filter((c) => c.id !== car.id);

  const updateCar = (patch: (c: GarageCar) => GarageCar) =>
    setGarage((g) => ({ ...g, cars: g.cars.map((c) => (c.id === car.id ? patch(c) : c)) }));

  const newId = () => crypto.randomUUID();

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const viewAll = (
    <button type="button" className="flex items-center gap-1 text-xs font-medium text-neutral-300 light:text-neutral-700">
      View all <ArrowRight size={12} />
    </button>
  );

  return (
    <div className="relative min-h-screen bg-black transition-colors light:bg-[#f7f5f0]">
      <div className="pointer-events-none fixed inset-0 h-screen">
        <LightRays raysOrigin="top-center" raysColor="#fff3c4" raysSpeed={0.6} lightSpread={0.7} rayLength={1.8} followMouse mouseInfluence={0.08} fadeDistance={1.1} saturation={0.9} lightMode={theme === 'light'} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-10">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] sm:h-56 light:border-black/10 light:bg-black/[0.04]">
              <Car size={64} strokeWidth={1} className="text-neutral-600" />
              <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/50 text-neutral-300 light:border-black/10 light:bg-white/80 light:text-neutral-600">
                <Camera size={14} />
              </span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-semibold text-white light:text-neutral-900">{car.title}</h1>
                <p className="mt-1 text-xs text-neutral-500">
                  {carMeta(car)}
                  {car.price !== undefined && <> &bull; {formatPrice(car.price)}</>}
                </p>
              </div>
              {isOwn ? (
                <button type="button" onClick={() => setIsPublic((p) => !p)} className={BTN}>
                  {isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
                  {isPublic ? 'Public' : 'Private'}
                </button>
              ) : (
                <span className={`${BTN} pointer-events-none`}>
                  <ShieldCheck size={13} /> Public Garage
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {isOwn ? (
                <button type="button" className={BTN}>
                  <Pencil size={13} /> Edit
                </button>
              ) : (
                <button type="button" className={BTN}>
                  <MessageCircle size={13} /> Message Owner
                </button>
              )}
              <button type="button" onClick={share} className={BTN}>
                <Share2 size={13} /> {copied ? 'Link copied' : 'Share'}
              </button>
            </div>

            <Panel icon={CheckCircle2} title="Service history" action={viewAll}>
              {car.service.map((s) => (
                <Row key={s.id} icon={CheckCircle2} primary={`${s.date} \u00b7 ${s.title}`} trailing={<span className="whitespace-nowrap text-xs text-neutral-500">{formatKm(s.km)}</span>} />
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
                      service: [{ id: newId(), title, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), km: Number(km.replace(/\D/g, '')) || c.mileageKm }, ...c.service],
                    }))
                  }
                />
              )}
            </Panel>

            <Panel icon={Wrench} title="Modifications">
              {car.mods.map((m) => (
                <Row key={m.id} icon={Wrench} primary={m.part} trailing={<span className="block max-w-[10rem] truncate text-right text-xs text-neutral-500 sm:max-w-none">{m.detail}</span>} />
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

            <Panel icon={FolderOpen} title="Documents" action={viewAll}>
              {car.docs.map((d) => (
                <Row key={d.id} icon={FileText} primary={d.name} secondary={d.meta} trailing={<Download size={14} className="text-neutral-500" />} />
              ))}
              {car.docs.length === 0 && !isOwn && <p className="py-3 text-sm text-neutral-500">No documents shared.</p>}
              {isOwn && (
                <AddRow
                  label="Upload document"
                  primaryPlaceholder="File name, e.g. Invoice.pdf"
                  secondaryPlaceholder="Notes (optional)"
                  onAdd={(name, meta) => updateCar((c) => ({ ...c, docs: [...c.docs, { id: newId(), name, meta: meta || 'PDF' }] }))}
                />
              )}
            </Panel>
          </div>

          <aside className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
            <section className={`${PANEL} flex flex-col items-center p-5 text-center`}>
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
              <Link to={isOwn ? '/profile' : `/profile/${owner.id}`} className="mt-3 flex items-center gap-1 text-xs font-medium text-neutral-200 light:text-neutral-800">
                {isOwn ? 'Edit profile' : 'View full profile'} <ArrowRight size={12} />
              </Link>
            </section>

            <Panel icon={Home} title={isOwn ? 'My other cars' : 'More from this garage'} action={!isOwn ? viewAll : undefined}>
              {otherCars.map((c) => (
                <button key={c.id} type="button" onClick={() => setSelectedId(c.id)} className="text-left">
                  <Row
                    icon={Car}
                    primary={c.title}
                    secondary={carMeta(c)}
                    trailing={
                      isOwn ? <Pencil size={13} className="text-neutral-500" /> : c.price !== undefined && <span className="text-xs font-semibold text-white light:text-neutral-900">{formatPrice(c.price)}</span>
                    }
                  />
                </button>
              ))}
              {otherCars.length === 0 && <p className="py-3 text-sm text-neutral-500">No other cars.</p>}
            </Panel>

            {isOwn ? (
              <>
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-display text-sm text-black light:bg-neutral-900 light:text-white">
                  + Add car to garage
                </button>
                <Link to="/sell" className={`${PANEL} flex items-center justify-center gap-2 px-4 py-3 font-display text-sm text-neutral-200 light:text-neutral-800`}>
                  <Tag size={14} /> Sell this car
                </Link>
              </>
            ) : (
              <Link to="/" className={`${PANEL} flex items-center justify-center gap-2 px-4 py-3 font-display text-sm text-neutral-200 light:text-neutral-800`}>
                Browse garage listings <ArrowRight size={14} />
              </Link>
            )}
          </aside>
        </main>

        <div className="mx-auto mb-6 w-full max-w-[1700px] px-4 sm:px-6 lg:px-10">
          <div className={`${PANEL} flex flex-col items-start justify-between gap-3 px-5 py-3 text-xs text-neutral-500 sm:flex-row sm:items-center`}>
            <span className="flex items-center gap-2">
              {!isOwn && <ShieldCheck size={13} />}
              {isOwn
                ? 'Please ensure that all information is accurate.'
                : 'All information is provided by the owner. Verify details and inspect any vehicle before purchase.'}
            </span>
            {isOwn ? (
              <Link to="/garage/alex-mechanic" className={BTN}>
                <Eye size={13} /> Public Garage
              </Link>
            ) : (
              <span>Automarket &bull; Private &amp; Public Garages</span>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default GaragePage;
