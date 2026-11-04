import {
  ArrowRight,
  Calendar,
  Camera,
  Car,
  CheckCircle2,
  Eye,
  EyeOff,
  FolderOpen,
  Gauge,
  Heart,
  Home,
  Link2,
  Lock,
  MessageCircle,
  Pencil,
  Plus,
  Settings2,
  Share2,
  ShieldCheck,
  Tag,
  Trash2,
  User,
  Wrench,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Stars from '../components/common/Stars';
import { AddRow, BTN, PANEL, Panel, Row } from '../components/garage/Panel';
import { shareLink } from '../lib/share';
import { ApiError } from '../services/apiClient';
import {
  MOD_CATEGORY,
  MOD_CATEGORY_LABEL,
  addModification,
  addServiceRecord,
  carTitle,
  createCar,
  deleteCar,
  getCarLikes,
  getModifications,
  getMyGarage,
  getPublicGarage,
  getServiceRecords,
  getVehicle,
  likeCar,
  removeCarPhoto,
  setCarVisibility,
  unlikeCar,
  updateCar,
  uploadCarPhoto,
  type CarPayload,
  type GarageCar,
  type Modification,
  type ServiceRecord,
} from '../services/garageApi';
import { clearClientSession, isLoggedIn } from '../services/session';
import { startDirectConversation } from '../services/messagingApi';
import { getMyProfile } from '../services/usersApi';

type TabKey = 'service' | 'mods' | 'docs';

interface Owner {
  id: string;
  name: string;
  imageUrl: string | null;
  rating: number;
  reviews: number;
  memberSince: string;
}

interface GarageData {
  owner: Owner;
  cars: GarageCar[];
}

interface CarDetails {
  service: ServiceRecord[];
  mods: Modification[];
}

type PhotoChange = { file?: File; remove?: boolean };

const formatKm = (km: number) => `${km.toLocaleString('en-ZA')} km`;
const formatPrice = (price: number) => `R${price.toLocaleString('en-ZA')}`;
const formatMonth = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' });
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

const formatKmShort = (km: number) => {
  if (km < 1000) return `${km} km`;
  const k = km / 1000;
  const label = k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k).toString();
  return `${label}k km`;
};

const guessCategory = (part: string) => {
  const needle = part.trim().toLowerCase();
  const match = Object.entries(MOD_CATEGORY_LABEL).find(([, label]) =>
    label.toLowerCase().includes(needle)
  );
  return match ? Number(match[0]) : MOD_CATEGORY.Other;
};

const SEGMENT_ACTIVE = 'bg-white text-black light:bg-neutral-900 light:text-white';
const PRIMARY_BTN =
  'flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-display text-sm text-black light:bg-neutral-900 light:text-white';
const LINK_PANEL = `${PANEL} flex items-center justify-center gap-2 px-4 py-3 font-display text-sm text-neutral-200 light:text-neutral-800`;
const SCROLL_ROW =
  '-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
const INPUT =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60 light:border-black/10 light:bg-black/5 light:text-neutral-900';

const errorText = (err: unknown) =>
  err instanceof Error ? err.message : 'Something went wrong. Please try again.';

const Message = ({ children, back = true }: { children: string; back?: boolean }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-neutral-400">
    <p>{children}</p>
    {back && (
      <Link to="/garages" className="text-amber-300 light:text-amber-600">
        Browse garages
      </Link>
    )}
  </div>
);

/** Own garage lives at /garage (reached from Profile); everyone else's at /garages/:id. */
const GaragePage = () => {
  const { garageId } = useParams();
  return <GarageLoader key={garageId ?? 'own'} garageId={garageId} />;
};

const GarageLoader = ({ garageId }: { garageId?: string }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOwn = garageId === undefined;
  const requestedCar = searchParams.get('car');
  const [data, setData] = useState<GarageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (isOwn && !isLoggedIn()) {
      navigate('/login', { replace: true });
      return;
    }

    const load = async (): Promise<GarageData> => {
      if (garageId === undefined) {
        const me = await getMyProfile();
        const cars = await getMyGarage(me.id);
        return {
          owner: {
            id: me.id,
            name: `${me.firstName} ${me.lastName}`.trim() || me.username,
            imageUrl: me.profileImageUrl,
            rating: me.averageRating,
            reviews: me.reviewCount,
            memberSince: formatMonth(me.createdAt),
          },
          cars,
        };
      }

      const { owner, cars } = await getPublicGarage(garageId);

      // A private car isn't in the list, but its direct link still opens it.
      if (requestedCar && !cars.some((c) => c.id === requestedCar)) {
        const car = await getVehicle(requestedCar).catch(() => null);
        if (car && car.ownerId === garageId) cars.unshift(car);
      }

      return {
        owner: {
          id: owner.id,
          name: `${owner.firstName} ${owner.lastName}`.trim() || owner.username,
          imageUrl: owner.profileImageUrl,
          rating: owner.averageRating,
          reviews: owner.reviewCount,
          memberSince: formatMonth(owner.memberSince),
        },
        cars,
      };
    };

    load()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        if (isOwn && err instanceof ApiError && err.status === 401) {
          clearClientSession();
          navigate('/login', { replace: true });
          return;
        }

        setError(
          err instanceof ApiError && err.status === 404 ? 'Garage not found.' : errorText(err)
        );
      });

    return () => {
      cancelled = true;
    };
  }, [isOwn, garageId, requestedCar, navigate]);

  if (error) return <Message>{error}</Message>;
  if (!data) return <Message back={false}>Loading garage…</Message>;

  return <GarageView initial={data} isOwn={isOwn} initialCarId={requestedCar} />;
};

const CarForm = ({
  initial,
  submitLabel,
  withVisibility,
  onSubmit,
  onCancel,
  onDelete,
}: {
  initial?: GarageCar;
  submitLabel: string;
  withVisibility?: boolean;
  onSubmit: (payload: CarPayload, isPublic: boolean, photo: PhotoChange) => Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
}) => {
  const [form, setForm] = useState({
    make: initial?.make ?? '',
    model: initial?.model ?? '',
    year: initial ? String(initial.year) : '',
    mileage: initial ? String(initial.mileage) : '',
    transmission: initial?.transmission ?? 'Manual',
    engineDetails: initial?.engineDetails ?? '',
    color: initial?.color ?? '',
  });
  const [isPublic, setIsPublic] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const preview = photo?.preview;
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [photo]);

  const shownPhoto = photo?.preview ?? (removePhoto ? null : (initial?.imageUrl ?? null));

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      return setError('Photo must be a JPEG, PNG or WebP image.');
    if (file.size > 4 * 1024 * 1024) return setError('Photo must be 4 MB or smaller.');

    setError(null);
    setRemovePhoto(false);
    setPhoto({ file, preview: URL.createObjectURL(file) });
  };

  const dropPhoto = () => {
    setPhoto(null);
    setRemovePhoto(true);
  };

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const year = Number(form.year);
    const mileage = Number(form.mileage.replace(/\D/g, ''));

    if (!form.make.trim() || !form.model.trim()) return setError('Make and model are required.');
    if (!Number.isInteger(year) || year < 1886 || year > new Date().getFullYear() + 1)
      return setError('Enter a valid year.');

    setBusy(true);
    try {
      await onSubmit(
        {
          make: form.make.trim(),
          model: form.model.trim(),
          year,
          mileage,
          transmission: form.transmission,
          engineDetails: form.engineDetails.trim() || null,
          color: form.color.trim() || null,
        },
        isPublic,
        photo ? { file: photo.file } : { remove: removePhoto && Boolean(initial?.imageUrl) }
      );
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${PANEL} grid gap-3 p-4 sm:grid-cols-2 sm:p-5`}>
      <div className="flex items-center gap-3 sm:col-span-2">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] light:border-black/10 light:bg-black/[0.04]">
          {shownPhoto ? (
            <img src={shownPhoto} alt="Car photo" className="h-full w-full object-cover" />
          ) : (
            <Car size={28} strokeWidth={1.25} className="text-neutral-600" />
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={pickPhoto}
          />
          <button type="button" onClick={() => fileInput.current?.click()} className={BTN}>
            <Camera size={13} /> {shownPhoto ? 'Change photo' : 'Upload photo'}
          </button>
          {shownPhoto && (
            <button type="button" onClick={dropPhoto} className={`${BTN} !text-rose-300`}>
              <Trash2 size={13} /> Remove photo
            </button>
          )}
          <p className="text-[11px] text-neutral-500">JPEG, PNG or WebP, up to 4 MB.</p>
        </div>
      </div>
      <label className="text-xs text-neutral-400">
        Make
        <input className={`${INPUT} mt-1`} value={form.make} maxLength={100} onChange={set('make')} placeholder="BMW" />
      </label>
      <label className="text-xs text-neutral-400">
        Model
        <input className={`${INPUT} mt-1`} value={form.model} maxLength={100} onChange={set('model')} placeholder="E36 328i" />
      </label>
      <label className="text-xs text-neutral-400">
        Year
        <input className={`${INPUT} mt-1`} inputMode="numeric" value={form.year} maxLength={4} onChange={set('year')} />
      </label>
      <label className="text-xs text-neutral-400">
        Mileage (km)
        <input className={`${INPUT} mt-1`} inputMode="numeric" value={form.mileage} onChange={set('mileage')} />
      </label>
      <label className="text-xs text-neutral-400">
        Transmission
        <select className={`${INPUT} mt-1`} value={form.transmission} onChange={set('transmission')}>
          <option>Manual</option>
          <option>Automatic</option>
        </select>
      </label>
      <label className="text-xs text-neutral-400">
        Colour (optional)
        <input className={`${INPUT} mt-1`} value={form.color} maxLength={50} onChange={set('color')} />
      </label>
      <label className="text-xs text-neutral-400 sm:col-span-2">
        Engine (optional)
        <input className={`${INPUT} mt-1`} value={form.engineDetails} maxLength={200} onChange={set('engineDetails')} />
      </label>

      {withVisibility && (
        <fieldset className="grid grid-cols-2 gap-2 sm:col-span-2">
          <legend className="mb-1 text-xs text-neutral-400">Who can find this car?</legend>
          {[
            { value: true, icon: Eye, title: 'Public', hint: 'Listed in Garages' },
            { value: false, icon: Lock, title: 'Private', hint: 'Only with your link' },
          ].map(({ value, icon: Icon, title, hint }) => (
            <button
              key={title}
              type="button"
              aria-pressed={isPublic === value}
              onClick={() => setIsPublic(value)}
              className={`flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-colors ${
                isPublic === value
                  ? 'border-amber-200/50 bg-white/10 light:border-amber-500/60 light:bg-black/5'
                  : 'border-white/10 light:border-black/10'
              }`}
            >
              <span className="flex items-center gap-1.5 text-sm text-white light:text-neutral-900">
                <Icon size={13} /> {title}
              </span>
              <span className="text-xs text-neutral-500">{hint}</span>
            </button>
          ))}
        </fieldset>
      )}

      {error && <p className="text-sm text-rose-400 sm:col-span-2">{error}</p>}

      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <button type="submit" disabled={busy} className={`${PRIMARY_BTN} !py-2 text-xs disabled:opacity-60`}>
          {busy ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={BTN}>
            Cancel
          </button>
        )}
        {onDelete && (
          <button type="button" onClick={onDelete} className={`${BTN} ml-auto !border-rose-400/40 !text-rose-300`}>
            <Trash2 size={13} /> Delete car
          </button>
        )}
      </div>
    </form>
  );
};

const GarageView = ({
  initial,
  isOwn,
  initialCarId,
}: {
  initial: GarageData;
  isOwn: boolean;
  initialCarId: string | null;
}) => {
  const [cars, setCars] = useState(initial.cars);
  const { owner } = initial;
  const [selectedId, setSelectedId] = useState(
    cars.find((c) => c.id === initialCarId)?.id ?? cars[0]?.id ?? null
  );
  const [tab, setTab] = useState<TabKey>('service');
  const [details, setDetails] = useState<Record<string, CarDetails>>({});
  const [mode, setMode] = useState<'view' | 'add' | 'edit'>(cars.length === 0 && isOwn ? 'add' : 'view');
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [messaging, setMessaging] = useState(false);
  const navigate = useNavigate();

  const car = cars.find((c) => c.id === selectedId) ?? null;
  const otherCars = cars.filter((c) => c.id !== car?.id);
  const current = car ? details[car.id] : undefined;
  const [likes, setLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  const carId = car?.id ?? null;
  const likeState = carId ? likes[carId] : undefined;

  useEffect(() => {
    if (!carId) return;
    let cancelled = false;
    getCarLikes(carId)
      .then((status) => {
        if (!cancelled) setLikes((l) => ({ ...l, [carId]: status }));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [carId]);

  const toggleLike = async () => {
    if (!carId || !car?.isPublic) return;
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    const before = likes[carId] ?? { count: 0, liked: false };
    const next = { count: Math.max(0, before.count + (before.liked ? -1 : 1)), liked: !before.liked };
    setLikes((l) => ({ ...l, [carId]: next }));
    try {
      if (next.liked) await likeCar(carId);
      else await unlikeCar(carId);
    } catch (err) {
      setLikes((l) => ({ ...l, [carId]: before }));
      setNotice(errorText(err));
    }
  };
  useEffect(() => {
    if (!selectedId || details[selectedId]) return;
    let cancelled = false;

    Promise.all([getServiceRecords(selectedId), getModifications(selectedId)])
      .then(([service, mods]) => {
        if (!cancelled) setDetails((d) => ({ ...d, [selectedId]: { service, mods } }));
      })
      .catch((err: unknown) => {
        if (!cancelled) setNotice(errorText(err));
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, details]);

  const patchCar = (id: string, patch: Partial<GarageCar>) =>
    setCars((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const patchDetails = (id: string, patch: (d: CarDetails) => CarDetails) =>
    setDetails((d) => ({ ...d, [id]: patch(d[id] ?? { service: [], mods: [] }) }));

  const messageOwner = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    setMessaging(true);
    try {
      const { conversationId } = await startDirectConversation(owner.id);
      navigate(`/messages?conversation=${conversationId}`);
    } catch (err) {
      setNotice(errorText(err));
      setMessaging(false);
    }
  };

  const share = async () => {
    if (!car) return;
    const url = `${window.location.origin}/garages/${owner.id}?car=${car.id}`;
    if ((await shareLink(carTitle(car), url)) === 'copied') {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const toggleVisibility = async () => {
    if (!car) return;
    const next = !car.isPublic;
    patchCar(car.id, { isPublic: next });
    try {
      await setCarVisibility(car.id, next);
    } catch (err) {
      patchCar(car.id, { isPublic: !next });
      setNotice(errorText(err));
    }
  };

  const applyPhoto = async (id: string, photo: PhotoChange) => {
    if (photo.file) return uploadCarPhoto(id, photo.file);
    if (photo.remove) await removeCarPhoto(id);
    return photo.remove ? null : undefined;
  };

  const addCar = async (payload: CarPayload, isPublic: boolean, photo: PhotoChange) => {
    const created = await createCar(payload, isPublic, owner.id);
    // The car exists now, so a failed upload shouldn't make the form retry creation.
    try {
      const imageUrl = await applyPhoto(created.id, photo);
      if (imageUrl !== undefined) created.imageUrl = imageUrl;
    } catch (err) {
      setNotice(`Car added, but the photo failed: ${errorText(err)}`);
    }
    setCars((list) => [created, ...list]);
    setSelectedId(created.id);
    setMode('view');
  };

  const saveCar = async (payload: CarPayload, photo: PhotoChange) => {
    if (!car) return;
    await updateCar(car, payload);
    patchCar(car.id, payload);
    try {
      const imageUrl = await applyPhoto(car.id, photo);
      if (imageUrl !== undefined) patchCar(car.id, { imageUrl });
    } catch (err) {
      setNotice(`Changes saved, but the photo failed: ${errorText(err)}`);
    }
    setMode('view');
  };

  const removeCar = async () => {
    if (!car || !window.confirm(`Delete ${carTitle(car)} from your garage?`)) return;
    try {
      await deleteCar(car.id);
      const remaining = cars.filter((c) => c.id !== car.id);
      setCars(remaining);
      setSelectedId(remaining[0]?.id ?? null);
      setMode(remaining.length === 0 ? 'add' : 'view');
    } catch (err) {
      setNotice(errorText(err));
    }
  };

  const addService = async (title: string, km: string) => {
    if (!car) return;
    try {
      const record = await addServiceRecord(car.id, {
        title,
        serviceDate: new Date().toISOString().slice(0, 10),
        mileage: Number(km.replace(/\D/g, '')) || car.mileage,
      });
      patchDetails(car.id, (d) => ({ ...d, service: [record, ...d.service] }));
    } catch (err) {
      setNotice(errorText(err));
    }
  };

  const addMod = async (part: string, detail: string) => {
    if (!car) return;
    try {
      const mod = await addModification(car.id, {
        name: part,
        category: guessCategory(part),
        description: detail || null,
      });
      patchDetails(car.id, (d) => ({ ...d, mods: [...d.mods, mod] }));
    } catch (err) {
      setNotice(errorText(err));
    }
  };

  const banner = notice && (
    <div
      role="alert"
      className="flex items-center justify-between rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm text-rose-300"
    >
      {notice}
      <button type="button" onClick={() => setNotice(null)} className="text-xs underline">
        Dismiss
      </button>
    </div>
  );

  if (!car || mode === 'add') {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pb-6 pt-2 sm:px-6 lg:py-8">
        {banner}
        {isOwn ? (
          <>
            <h1 className="font-display text-xl font-semibold text-white light:text-neutral-900">
              {cars.length === 0 ? 'Add your first car' : 'Add a car'}
            </h1>
            <CarForm
              submitLabel="Add to garage"
              withVisibility
              onSubmit={addCar}
              onCancel={cars.length > 0 ? () => setMode('view') : undefined}
            />
          </>
        ) : (
          <Message>{`${owner.name} hasn't shared any cars yet.`}</Message>
        )}
      </main>
    );
  }

  const specs = [
    { icon: Calendar, label: String(car.year), full: `Year: ${car.year}` },
    { icon: Gauge, label: formatKmShort(car.mileage), full: `Mileage: ${formatKm(car.mileage)}` },
    { icon: Settings2, label: car.transmission ?? 'N/A', full: `Transmission: ${car.transmission ?? 'N/A'}` },
  ];

  const service = current?.service ?? [];
  const mods = current?.mods ?? [];

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'service', label: 'Service', count: service.length },
    { key: 'mods', label: 'Mods', count: mods.length },
    { key: 'docs', label: 'Docs', count: 0 },
  ];

  const panelVisibility = (key: TabKey) => `${tab === key ? 'block' : 'hidden'} lg:block`;

  const visibilityBadge = car.isPublic ? (
    <>
      <ShieldCheck size={13} /> Public
    </>
  ) : (
    <>
      <Lock size={13} /> Private
    </>
  );

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-5 px-4 pb-6 pt-2 sm:px-6 lg:flex-row lg:px-10 lg:py-8">
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
          {banner}

          <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] sm:aspect-[16/7] lg:aspect-auto lg:h-64 light:border-black/10 light:bg-black/[0.04]">
            {car.imageUrl ? (
              <img src={car.imageUrl} alt={carTitle(car)} className="h-full w-full object-cover" />
            ) : (
              <Car size={64} strokeWidth={1} className="text-neutral-600" />
            )}
          </div>

          {(cars.length > 1 || isOwn) && (
            <div className={`${SCROLL_ROW} lg:hidden`}>
              {cars.map((c) => {
                const active = c.id === car.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedId(c.id);
                      setMode('view');
                    }}
                    className={`w-44 shrink-0 snap-start rounded-xl border p-3 text-left transition-colors ${
                      active
                        ? 'border-amber-200/50 bg-white/10 light:border-amber-500/60 light:bg-black/5'
                        : 'border-white/10 bg-white/[0.03] light:border-black/10'
                    }`}
                  >
                    <p className="truncate font-display text-sm text-white light:text-neutral-900">{carTitle(c)}</p>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                      {c.year}
                      {c.price !== null && <> &bull; {formatPrice(c.price)}</>}
                    </p>
                  </button>
                );
              })}
              {isOwn && (
                <button
                  type="button"
                  onClick={() => setMode('add')}
                  className="flex w-28 shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 p-3 text-xs text-neutral-400 light:border-black/20 light:text-neutral-600"
                >
                  <Plus size={16} />
                  Add car
                </button>
              )}
            </div>
          )}

          {mode === 'edit' && isOwn ? (
            <CarForm
              initial={car}
              submitLabel="Save changes"
              onSubmit={(payload, _isPublic, photo) => saveCar(payload, photo)}
              onCancel={() => setMode('view')}
              onDelete={removeCar}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="font-display text-xl font-semibold text-white lg:text-2xl light:text-neutral-900">
                    {carTitle(car)}
                  </h1>
                  {car.price !== null && (
                    <p className="mt-1 font-display text-lg text-white light:text-neutral-900">
                      {formatPrice(car.price)}
                    </p>
                  )}
                </div>
                {!isOwn && <span className={`${BTN} pointer-events-none shrink-0`}>{visibilityBadge}</span>}
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
          )}

          {!isOwn && (
            <Link to={`/profile/${owner.id}`} className={`${PANEL} flex items-center gap-3 p-3 lg:hidden`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5 text-neutral-400 light:bg-black/5">
                {owner.imageUrl ? (
                  <img src={owner.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User size={16} />
                )}
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

          <div className={`grid gap-2 lg:flex ${isOwn ? 'grid-cols-3' : 'grid-cols-[2fr_1fr]'}`}>
            {isOwn ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode((m) => (m === 'edit' ? 'view' : 'edit'))}
                  className={`${BTN} w-full justify-center lg:w-auto`}
                >
                  <Pencil size={13} /> {mode === 'edit' ? 'Cancel' : 'Edit'}
                </button>
                <button type="button" onClick={toggleVisibility} className={`${BTN} w-full justify-center lg:w-auto`}>
                  {car.isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
                  {car.isPublic ? 'Public' : 'Private'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={messageOwner}
                disabled={messaging}
                className={`${PRIMARY_BTN} !py-2.5 text-xs font-medium disabled:opacity-60 lg:w-auto`}
              >
                <MessageCircle size={13} /> Message owner
              </button>
            )}
            <button
              type="button"
              onClick={() => void toggleLike()}
              disabled={isOwn || !car.isPublic}
              aria-pressed={likeState?.liked ?? false}
              aria-label={isOwn ? 'Likes' : likeState?.liked ? 'Unlike car' : 'Like car'}
              className={`${BTN} w-full justify-center tabular-nums disabled:cursor-default lg:w-auto ${
                likeState?.liked ? '!text-rose-400' : ''
              }`}
            >
              <Heart size={13} className={likeState?.liked ? 'fill-current' : ''} />
              {likeState?.count ?? 0}
            </button>
            <button type="button" onClick={share} className={`${BTN} w-full justify-center lg:w-auto`}>
              <Share2 size={13} /> {copied ? 'Copied' : 'Share'}
            </button>
          </div>

          {isOwn && (
            <p className="flex items-start gap-2 text-xs text-neutral-500">
              {car.isPublic ? (
                <Eye size={13} className="mt-0.5 shrink-0" />
              ) : (
                <Link2 size={13} className="mt-0.5 shrink-0" />
              )}
              {car.isPublic
                ? 'Public: this car appears in Garages and on your profile.'
                : 'Private: hidden from Garages. Anyone you send the Share link to can still view it.'}
            </p>
          )}

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
            <Panel icon={CheckCircle2} title="Service history">
              {service.map((s) => (
                <Row
                  key={s.id}
                  icon={CheckCircle2}
                  primary={s.title}
                  secondary={formatDate(s.serviceDate)}
                  trailing={<span className="whitespace-nowrap text-xs text-neutral-500">{formatKm(s.mileage)}</span>}
                />
              ))}
              {!current && <p className="py-3 text-sm text-neutral-500">Loading…</p>}
              {current && service.length === 0 && !isOwn && (
                <p className="py-3 text-sm text-neutral-500">No records yet.</p>
              )}
              {isOwn && (
                <AddRow
                  label="Add service record"
                  primaryPlaceholder="Service, e.g. Oil change"
                  secondaryPlaceholder="Mileage (km)"
                  onAdd={addService}
                />
              )}
            </Panel>
          </div>

          <div className={panelVisibility('mods')}>
            <Panel icon={Wrench} title="Modifications">
              {mods.map((m) => (
                <Row key={m.id} icon={Wrench} primary={m.name} secondary={m.description ?? MOD_CATEGORY_LABEL[m.category]} />
              ))}
              {!current && <p className="py-3 text-sm text-neutral-500">Loading…</p>}
              {current && mods.length === 0 && !isOwn && (
                <p className="py-3 text-sm text-neutral-500">No modifications listed.</p>
              )}
              {isOwn && (
                <AddRow
                  label="Add modification"
                  primaryPlaceholder="Part, e.g. Exhaust"
                  secondaryPlaceholder="Details"
                  onAdd={addMod}
                />
              )}
            </Panel>
          </div>

          <div className={panelVisibility('docs')}>
            <Panel icon={FolderOpen} title="Documents">
              <p className="py-3 text-sm text-neutral-500">Document uploads are coming soon.</p>
            </Panel>
          </div>
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
          <section className={`${PANEL} hidden flex-col items-center p-5 text-center lg:flex`}>
            <h2 className="mb-4 flex items-center gap-2 self-start font-display text-xs font-semibold uppercase tracking-widest text-neutral-200 light:text-neutral-900">
              <User size={14} /> {isOwn ? 'My profile' : 'Owner'}
            </h2>
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/5 text-neutral-400 light:bg-black/5">
              {owner.imageUrl ? (
                <img src={owner.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <User size={22} />
              )}
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
            <Panel icon={Home} title={isOwn ? 'My other cars' : 'More from this garage'}>
              {otherCars.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(c.id);
                    setMode('view');
                  }}
                  className="text-left"
                >
                  <Row
                    icon={Car}
                    primary={carTitle(c)}
                    secondary={`${c.year} \u2022 ${c.transmission ?? 'N/A'} \u2022 ${formatKm(c.mileage)}`}
                    trailing={
                      c.price !== null ? (
                        <span className="text-xs font-semibold text-white light:text-neutral-900">
                          {formatPrice(c.price)}
                        </span>
                      ) : !c.isPublic && isOwn ? (
                        <Lock size={13} className="text-neutral-500" />
                      ) : undefined
                    }
                  />
                </button>
              ))}
              {otherCars.length === 0 && <p className="py-3 text-sm text-neutral-500">No other cars.</p>}
            </Panel>
          </div>

          {isOwn ? (
            <>
              <button type="button" onClick={() => setMode('add')} className={`${PRIMARY_BTN} hidden lg:flex`}>
                + Add car to garage
              </button>
              <Link to="/sell" className={LINK_PANEL}>
                <Tag size={14} /> Sell this car
              </Link>
            </>
          ) : (
            <Link to="/garages" className={LINK_PANEL}>
              Browse more garages <ArrowRight size={14} />
            </Link>
          )}
        </aside>
      </main>

      <div className="mx-auto mb-6 w-full max-w-[1700px] px-4 sm:px-6 lg:px-10">
        <div
          className={`${PANEL} flex flex-col items-start justify-between gap-3 px-5 py-3 text-xs text-neutral-500 sm:flex-row sm:items-center`}
        >
          <span className="flex items-start gap-2">
            {!isOwn && <ShieldCheck size={13} className="mt-0.5 shrink-0" />}
            {isOwn
              ? 'Please ensure that all information is accurate.'
              : 'All information is provided by the owner. Verify details and inspect any vehicle before purchase.'}
          </span>
          {isOwn ? (
            <span className={`${BTN} pointer-events-none`}>{visibilityBadge} garage</span>
          ) : (
            <span>Nutkustoms Automarket &bull; Private &amp; Public Garages</span>
          )}
        </div>
      </div>
    </>
  );
};

export default GaragePage;
