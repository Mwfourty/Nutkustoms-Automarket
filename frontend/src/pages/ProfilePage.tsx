import {
  Bookmark,
  Camera,
  Car,
  Edit3,
  Home,
  List,
  LogIn,
  LogOut,
  MapPin,
  MessageCircle,
  Settings,
  Share2,
  Tag,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListingCard from '../components/store/ListingCard';
import AccountSettings from '../components/profile/AccountSettings';
import Stars from '../components/common/Stars';
import { BTN, PANEL, Panel, Row } from '../components/garage/Panel';
import { useTheme } from '../context/ThemeContext';
import { shareLink } from '../lib/share';
import { ApiError } from '../services/apiClient';
import { clearClientSession, isLoggedIn, logout } from '../services/session';
import {
  LISTING_STATUS,
  getMyListings,
  getMyProfile,
  getPublicProfile,
  getSavedContacts,
  getSavedListingIds,
  getSavedListings,
  getSellerListings,
  removeContact,
  removeAvatar,
  saveContact,
  saveListing,
  toStoreListing,
  unsaveListing,
  updateMyProfile,
  uploadAvatar,
  PROFILE_VISIBILITY,
  type ApiListing,
  type SavedContact,
} from '../services/usersApi';

type Tab = 'saved' | 'contacts' | 'listings' | 'settings';

const USERNAME_COOLDOWN_DAYS = 30;
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

interface ViewProfile {
  id: string;
  name: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  province: string;
  usernameChangedAt: string | null;
  profileVisibility: number;
  allowMessages: boolean;
  imageUrl: string | null;
  rating: number;
  reviews: number;
  memberSince: string;
  stats: { value: string; label: string }[];
}

interface ProfileData {
  profile: ViewProfile;
  listings: ApiListing[];
  sold: ApiListing[];
  savedListings: ApiListing[];
  savedContacts: SavedContact[];
  savedListingIds: string[];
  savedContactIds: string[];
}

// Desktop sidebar tabs (Garage, Settings and Logout are added separately there).
const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'saved', label: 'Saved Listings', icon: Bookmark },
  { id: 'contacts', label: 'Saved Contacts', icon: Users },
  { id: 'listings', label: 'My Listings', icon: List },
];

// Mobile segmented control: short labels, Settings included, Garage lives in the bottom tab bar.
const MOBILE_TABS: { id: Tab; label: string }[] = [
  { id: 'listings', label: 'Listings' },
  { id: 'saved', label: 'Saved' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'settings', label: 'Settings' },
];

const formatPrice = (price: number) => `R${price.toLocaleString('en-ZA')}`;

const formatMonth = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

const NAV_ITEM =
  'flex w-full items-center gap-3 whitespace-nowrap rounded-xl border px-4 py-3 text-left font-display text-sm transition-colors';
const NAV_IDLE =
  'border-white/8 bg-white/[0.03] text-neutral-300 hover:border-white/20 light:border-black/10 light:bg-white/80 light:text-neutral-700 light:hover:border-black/25';
const NAV_ACTIVE = 'border-transparent bg-white text-black light:bg-neutral-900 light:text-white';

const ACTION = 'w-full justify-center sm:w-auto';
const PRIMARY_SM =
  'flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black sm:w-auto light:bg-neutral-900 light:text-white';
const INPUT =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60 light:border-black/10 light:bg-black/5 light:text-neutral-900';

const hasToken = () => isLoggedIn();

const fullName = (first: string, last: string) => `${first} ${last}`.trim();

async function loadOwn(): Promise<ProfileData> {
  const [me, listings, sold, savedListings, savedContacts] = await Promise.all([
    getMyProfile(),
    getMyListings(),
    getMyListings(LISTING_STATUS.Sold),
    getSavedListings(),
    getSavedContacts(),
  ]);

  return {
    profile: {
      id: me.id,
      name: fullName(me.firstName, me.lastName) || me.username,
      firstName: me.firstName,
      lastName: me.lastName,
      username: me.username,
      phoneNumber: me.phoneNumber ?? '',
      city: me.city ?? '',
      province: me.province ?? '',
      usernameChangedAt: me.usernameChangedAt,
      profileVisibility: me.profileVisibility,
      allowMessages: me.allowMessages,
      imageUrl: me.profileImageUrl,
      rating: me.averageRating,
      reviews: me.reviewCount,
      memberSince: formatMonth(me.createdAt),
      stats: [
        { value: String(me.listingsSold), label: 'Listings sold' },
        { value: String(me.carsInGarage), label: 'Cars in garage' },
        { value: me.averageRating.toFixed(1), label: 'Avg. rating' },
      ],
    },
    listings,
    sold,
    savedListings,
    savedContacts,
    savedListingIds: savedListings.map((l) => l.id),
    savedContactIds: savedContacts.map((c) => c.id),
  };
}

async function loadPublic(userId: string): Promise<ProfileData> {
  const [user, listings] = await Promise.all([getPublicProfile(userId), getSellerListings(userId)]);

  // Saved state is only available to signed-in viewers.
  const [savedListingIds, savedContacts] = hasToken()
    ? await Promise.all([getSavedListingIds(), getSavedContacts()]).catch(
        () => [[], []] as [string[], SavedContact[]]
      )
    : [[], []];

  return {
    profile: {
      id: user.id,
      name: fullName(user.firstName, user.lastName) || user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phoneNumber: '',
      city: user.city ?? '',
      province: user.province ?? '',
      usernameChangedAt: null,
      profileVisibility: PROFILE_VISIBILITY.Public,
      allowMessages: true,
      imageUrl: user.profileImageUrl,
      rating: user.averageRating,
      reviews: user.reviewCount,
      memberSince: formatMonth(user.memberSince),
      stats: [
        { value: String(listings.length), label: 'Active listings' },
        { value: user.averageRating.toFixed(1), label: 'Avg. rating' },
        { value: String(user.reviewCount), label: 'Reviews' },
      ],
    },
    listings,
    sold: [],
    savedListings: [],
    savedContacts,
    savedListingIds,
    savedContactIds: savedContacts.map((c) => c.id),
  };
}

const Message = ({ children }: { children: string }) => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-3 text-neutral-400">
    <p>{children}</p>
  </div>
);

const ProfilePage = () => {
  const { userId } = useParams();
  return <ProfileLoader key={userId ?? 'own'} userId={userId} />;
};

const ProfileLoader = ({ userId }: { userId?: string }) => {
  const navigate = useNavigate();
  const isOwn = userId === undefined;
  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (isOwn && !hasToken()) {
      navigate('/login', { replace: true });
      return;
    }

    (isOwn ? loadOwn() : loadPublic(userId))
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        if (isOwn && err instanceof ApiError && err.status === 401) {
          // Expired or revoked token: drop it and ask the user to sign in again.
          clearClientSession();
          navigate('/login', { replace: true });
          return;
        }

        setError(
          err instanceof ApiError && err.status === 404
            ? 'Profile not found.'
            : err instanceof Error
              ? err.message
              : 'Could not load this profile.'
        );
      });

    return () => {
      cancelled = true;
    };
  }, [isOwn, userId, navigate]);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 text-neutral-400">
        <p>{error}</p>
        <Link to="/" className="text-amber-300 light:text-amber-600">
          Back to browse
        </Link>
      </div>
    );
  }

  if (!data) return <Message>Loading profile…</Message>;

  return <ProfileView initial={data} isOwn={isOwn} />;
};

const Switch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      checked ? 'bg-amber-300' : 'bg-white/15 light:bg-black/15'
    }`}
  >
    <span
      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

const Empty = ({ children }: { children: string }) => (
  <p className="py-6 text-center text-sm text-neutral-500">{children}</p>
);

const HistoryPanel = ({ sold }: { sold: ApiListing[] }) => (
  <Panel icon={Tag} title="Sales history">
    {sold.length === 0 ? (
      <Empty>No sold listings yet.</Empty>
    ) : (
      sold.map((h) => (
        <Row
          key={h.id}
          icon={Car}
          primary={h.title}
          secondary={`Sold \u00b7 listed ${formatDate(h.createdAt)}`}
          trailing={
            <span className="text-sm font-semibold text-white light:text-neutral-900">
              {formatPrice(h.price)}
            </span>
          }
        />
      ))
    )}
  </Panel>
);

/** carousel: a swipeable row on phones (peeks the next card), a normal grid from sm up. */
const ListingGrid = ({
  listings,
  savedIds,
  onToggle,
  emptyText,
  carousel = false,
}: {
  listings: ApiListing[];
  savedIds: string[];
  onToggle: (listing: ApiListing, next: boolean) => void;
  emptyText: string;
  carousel?: boolean;
}) => {
  if (listings.length === 0) return <Empty>{emptyText}</Empty>;

  return (
    <div
      className={
        carousel
          ? '-mx-4 -my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-2 sm:mx-0 sm:my-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:p-0 xl:grid-cols-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          : 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
      }
    >
      {listings.map((l) => (
        <div key={l.id} className={carousel ? 'w-[78%] shrink-0 snap-start sm:w-auto' : undefined}>
          <ListingCard
            listing={toStoreListing(l)}
            saved={savedIds.includes(l.id)}
            onToggleSave={(next) => onToggle(l, next)}
          />
        </div>
      ))}
    </div>
  );
};

const ProfileView = ({ initial, isOwn }: { initial: ProfileData; isOwn: boolean }) => {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState(initial);
  const [tab, setTab] = useState<Tab>('listings');
  const [copied, setCopied] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: initial.profile.firstName,
    lastName: initial.profile.lastName,
    username: initial.profile.username,
    phoneNumber: initial.profile.phoneNumber,
    city: initial.profile.city,
    province: initial.profile.province,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { profile } = data;
  const contactSaved = data.savedContactIds.includes(profile.id);

  const [now] = useState(() => Date.now());
  const usernameLockedUntil = (() => {
    if (!profile.usernameChangedAt) return null;
    const until = new Date(profile.usernameChangedAt).getTime() + USERNAME_COOLDOWN_DAYS * 86_400_000;
    return until > now ? new Date(until) : null;
  })();

  const fail = (err: unknown) =>
    setNotice(err instanceof Error ? err.message : 'Something went wrong. Please try again.');

  const pickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError('Profile picture must be a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setFormError('Profile picture must be 2 MB or smaller.');
      return;
    }

    setFormError(null);
    setAvatarBusy(true);
    try {
      const { profileImageUrl } = await uploadAvatar(file);
      setData((d) => ({ ...d, profile: { ...d.profile, imageUrl: profileImageUrl } }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not upload the picture.');
    } finally {
      setAvatarBusy(false);
    }
  };

  const dropAvatar = async () => {
    setFormError(null);
    setAvatarBusy(true);
    try {
      await removeAvatar();
      setData((d) => ({ ...d, profile: { ...d.profile, imageUrl: null } }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not remove the picture.');
    } finally {
      setAvatarBusy(false);
    }
  };

  const share = async () => {
    if ((await shareLink(profile.name)) === 'copied') {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    await logout();
  }, []);

  const toggleListing = async (listing: ApiListing, next: boolean) => {
    if (!hasToken()) {
      setNotice('Log in to save listings.');
      return;
    }

    const previous = data;

    const delta = next ? 1 : -1;
    const bump = (items: ApiListing[]) =>
      items.map((l) =>
        l.id === listing.id ? { ...l, likeCount: Math.max(0, (l.likeCount ?? 0) + delta) } : l
      );

    // Optimistic update; rolled back if the server rejects it.
    setData((d) => ({
      ...d,
      listings: bump(d.listings),
      sold: bump(d.sold),
      savedListingIds: next
        ? [...d.savedListingIds, listing.id]
        : d.savedListingIds.filter((id) => id !== listing.id),
      savedListings: next
        ? bump(d.savedListings)
        : d.savedListings.filter((l) => l.id !== listing.id),
    }));

    try {
      if (next) await saveListing(listing.id);
      else await unsaveListing(listing.id);

      if (next && isOwn) {
        const liked = { ...listing, likeCount: (listing.likeCount ?? 0) + 1 };
        setData((d) => ({ ...d, savedListings: [liked, ...d.savedListings] }));
      }
    } catch (err) {
      setData(previous);
      fail(err);
    }
  };

  const toggleContact = async () => {
    if (!hasToken()) {
      setNotice('Log in to save contacts.');
      return;
    }

    const next = !contactSaved;
    const previous = data;

    setData((d) => ({
      ...d,
      savedContactIds: next
        ? [...d.savedContactIds, profile.id]
        : d.savedContactIds.filter((id) => id !== profile.id),
    }));

    try {
      if (next) await saveContact(profile.id);
      else await removeContact(profile.id);
    } catch (err) {
      setData(previous);
      fail(err);
    }
  };

  const dropContact = async (contact: SavedContact) => {
    const previous = data;

    setData((d) => ({
      ...d,
      savedContacts: d.savedContacts.filter((c) => c.id !== contact.id),
      savedContactIds: d.savedContactIds.filter((id) => id !== contact.id),
    }));

    try {
      await removeContact(contact.id);
    } catch (err) {
      setData(previous);
      fail(err);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setFormError('First and last name are required.');
      return;
    }

    const username = form.username.trim().toLowerCase();
    const usernameChanged = username !== profile.username;

    if (usernameChanged && !/^[a-z0-9_.]{3,30}$/.test(username)) {
      setFormError('Username must be 3-30 characters: letters, numbers, "_" or ".".');
      return;
    }

    setSaving(true);
    try {
      await updateMyProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
        city: form.city.trim(),
        province: form.province.trim(),
        ...(usernameChanged ? { username } : {}),
      });

      setData((d) => ({
        ...d,
        profile: {
          ...d.profile,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phoneNumber: form.phoneNumber.trim(),
          city: form.city.trim(),
          province: form.province.trim(),
          username: usernameChanged ? username : d.profile.username,
          usernameChangedAt: usernameChanged ? new Date().toISOString() : d.profile.usernameChangedAt,
          name: fullName(form.firstName.trim(), form.lastName.trim()),
        },
      }));
      setEditing(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  // Own listings can't be saved by their owner, so the heart is inert there.
  const ownListingToggle = () => undefined;

  const renderTab = () => {
    switch (tab) {
      case 'saved':
        return (
          <ListingGrid
            listings={data.savedListings}
            savedIds={data.savedListingIds}
            onToggle={toggleListing}
            emptyText="You haven't saved any listings yet."
          />
        );
      case 'contacts':
        return (
          <Panel icon={Users} title="Saved contacts">
            {data.savedContacts.length === 0 ? (
              <Empty>No saved contacts yet. Save a seller from their profile.</Empty>
            ) : (
              data.savedContacts.map((c) => {
                const name = fullName(c.firstName, c.lastName) || c.username;
                return (
                  <Row
                    key={c.id}
                    icon={User}
                    primary={name}
                    secondary={`@${c.username}`}
                    trailing={
                      <span className="flex items-center">
                        <Link
                          to="/messages"
                          aria-label={`Message ${name}`}
                          className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:text-neutral-200 light:hover:text-neutral-900"
                        >
                          <MessageCircle size={15} />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Remove ${name} from contacts`}
                          onClick={() => dropContact(c)}
                          className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:text-rose-400"
                        >
                          <UserCheck size={15} />
                        </button>
                      </span>
                    }
                  />
                );
              })
            )}
          </Panel>
        );
      case 'settings':
        return (
          <>
            <Panel icon={Settings} title="Preferences">
              <div className="flex items-center justify-between border-b border-white/8 py-3 text-sm text-neutral-200 light:border-black/10 light:text-neutral-800">
                Light theme
                <Switch checked={theme === 'light'} onChange={toggleTheme} label="Light theme" />
              </div>
              <div className="flex items-center justify-between py-3 text-sm text-neutral-200 light:text-neutral-800">
                Email notifications
                <Switch checked={emailAlerts} onChange={setEmailAlerts} label="Email notifications" />
              </div>
            </Panel>
            <AccountSettings
              profileVisibility={profile.profileVisibility}
              allowMessages={profile.allowMessages}
            />
            <Panel icon={LogIn} title="Session">
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className={PRIMARY_SM}>
                  <LogIn size={14} /> Log in
                </Link>
                <Link to="/signup" className={`${BTN} justify-center`}>
                  <UserPlus size={14} /> Sign up
                </Link>
              </div>
              {/* The desktop sidebar already has Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-neutral-300 lg:hidden light:border-black/10 light:text-neutral-700"
              >
                <LogOut size={15} /> {loggingOut ? 'Logging out…' : 'Log out'}
              </button>
            </Panel>
          </>
        );
      default:
        return (
          <>
            <ListingGrid
              listings={data.listings}
              savedIds={[]}
              onToggle={ownListingToggle}
              emptyText="You haven't created any listings yet."
            />
            <HistoryPanel sold={data.sold} />
          </>
        );
    }
  };

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-5 px-4 pb-6 pt-2 sm:px-6 lg:flex-row lg:gap-6 lg:px-10 lg:py-8">
        {/* Desktop sidebar. On mobile these destinations are the segmented control and bottom tab bar. */}
        {isOwn && (
          <nav aria-label="Profile" className="hidden w-56 shrink-0 flex-col gap-3 lg:flex">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`${NAV_ITEM} ${tab === id ? NAV_ACTIVE : NAV_IDLE}`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
            <Link to="/garage" className={`${NAV_ITEM} ${NAV_IDLE}`}>
              <Home size={15} /> My Garage
            </Link>
            <button
              type="button"
              onClick={() => setTab('settings')}
              className={`${NAV_ITEM} ${tab === 'settings' ? NAV_ACTIVE : NAV_IDLE}`}
            >
              <Settings size={15} /> Settings
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={`${NAV_ITEM} ${NAV_IDLE}`}
            >
              <LogOut size={15} /> {loggingOut ? 'Logging out…' : 'Logout'}
            </button>
          </nav>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
          {notice && (
            <div
              role="alert"
              className="flex items-center justify-between rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm text-rose-300"
            >
              {notice}
              <button type="button" onClick={() => setNotice(null)} className="text-xs underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Header */}
          <section
            className={`${PANEL} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6`}
          >
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-neutral-400 sm:h-20 sm:w-20 light:border-black/10 light:bg-black/5">
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <User size={28} />
                )}
              </span>
              <div className="min-w-0">
                <h1 className="truncate font-display text-xl font-semibold text-white sm:text-2xl light:text-neutral-900">
                  {profile.name}
                </h1>
                <p className="mt-0.5 truncate text-xs text-neutral-500">@{profile.username}</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                  <Stars rating={profile.rating} /> ({profile.reviews})
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Member since {profile.memberSince}
                  {(profile.city || profile.province) && (
                    <span className="ml-2 inline-flex items-center gap-1">
                      <MapPin size={11} />
                      {[profile.city, profile.province].filter(Boolean).join(', ')}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className={`grid gap-2 sm:flex ${isOwn ? 'grid-cols-2' : 'grid-cols-2'}`}>
              {isOwn ? (
                <button
                  type="button"
                  onClick={() => setEditing((v) => !v)}
                  className={`${BTN} ${ACTION}`}
                >
                  <Edit3 size={13} /> {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              ) : (
                <>
                  <Link to="/messages" className={PRIMARY_SM}>
                    <MessageCircle size={13} /> Message
                  </Link>
                  <button type="button" onClick={toggleContact} className={`${BTN} ${ACTION}`}>
                    {contactSaved ? <UserCheck size={13} /> : <UserPlus size={13} />}
                    {contactSaved ? 'Saved' : 'Save contact'}
                  </button>
                  <Link to={`/garages/${profile.id}`} className={`${BTN} ${ACTION}`}>
                    <Home size={13} /> Garage
                  </Link>
                </>
              )}
              <button type="button" onClick={share} className={`${BTN} ${ACTION}`}>
                <Share2 size={13} /> {copied ? 'Copied' : 'Share'}
              </button>
            </div>
          </section>

          {isOwn && editing && (
            <form onSubmit={saveProfile} className={`${PANEL} grid gap-3 p-4 sm:grid-cols-3 sm:p-6`}>
              <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={pickAvatar}
                />
                <button
                  type="button"
                  disabled={avatarBusy}
                  onClick={() => fileInput.current?.click()}
                  className={BTN}
                >
                  <Camera size={13} /> {avatarBusy ? 'Working…' : 'Change picture'}
                </button>
                {profile.imageUrl && (
                  <button type="button" disabled={avatarBusy} onClick={dropAvatar} className={BTN}>
                    <Trash2 size={13} /> Remove
                  </button>
                )}
                <span className="text-xs text-neutral-500">JPG, PNG or WebP, up to 2 MB.</span>
              </div>
              <label className="text-xs text-neutral-400 sm:col-span-3">
                Username
                <input
                  className={`${INPUT} mt-1 disabled:opacity-60`}
                  value={form.username}
                  maxLength={30}
                  disabled={usernameLockedUntil !== null}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                />
                <span className="mt-1 block text-neutral-500">
                  {usernameLockedUntil
                    ? `You can change your username again on ${formatDate(usernameLockedUntil.toISOString())}.`
                    : `Must be unique. You can only change it once every ${USERNAME_COOLDOWN_DAYS} days.`}
                </span>
              </label>
              <label className="text-xs text-neutral-400">
                First name
                <input
                  className={`${INPUT} mt-1`}
                  value={form.firstName}
                  maxLength={100}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </label>
              <label className="text-xs text-neutral-400">
                Last name
                <input
                  className={`${INPUT} mt-1`}
                  value={form.lastName}
                  maxLength={100}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </label>
              <label className="text-xs text-neutral-400">
                Phone number
                <input
                  className={`${INPUT} mt-1`}
                  type="tel"
                  value={form.phoneNumber}
                  maxLength={30}
                  onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                />
              </label>
              <label className="text-xs text-neutral-400 sm:col-span-2">
                City
                <input
                  className={`${INPUT} mt-1`}
                  value={form.city}
                  maxLength={100}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </label>
              <label className="text-xs text-neutral-400">
                Province
                <input
                  className={`${INPUT} mt-1`}
                  value={form.province}
                  maxLength={100}
                  onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
                />
              </label>
              {formError && <p className="text-sm text-rose-400 sm:col-span-3">{formError}</p>}
              <div className="flex gap-2 sm:col-span-3">
                <button type="submit" disabled={saving} className={PRIMARY_SM}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          )}

          {/* Stats: one compact panel instead of three tall ones */}
          <div className={`${PANEL} grid grid-cols-3 divide-x divide-white/8 py-4 light:divide-black/10`}>
            {profile.stats.map((s) => (
              <div key={s.label} className="px-2 text-center">
                <p className="font-display text-xl font-semibold text-white sm:text-2xl light:text-neutral-900">
                  {s.value}
                </p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>

          {isOwn ? (
            <>
              {/* Section switcher (mobile only) */}
              <div className="grid grid-cols-4 gap-1 rounded-xl border border-white/10 bg-white/5 p-1 lg:hidden light:border-black/10 light:bg-black/5">
                {MOBILE_TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={tab === id}
                    onClick={() => setTab(id)}
                    className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                      tab === id
                        ? 'bg-white text-black light:bg-neutral-900 light:text-white'
                        : 'text-neutral-400 light:text-neutral-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link
                to="/garage"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-neutral-200 lg:hidden light:border-black/10 light:bg-black/5 light:text-neutral-800"
              >
                <Home size={15} /> My Garage
              </Link>
              {renderTab()}
            </>
          ) : (
            <>
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-200 light:text-neutral-900">
                Active listings
              </h2>
              <ListingGrid
                listings={data.listings}
                savedIds={data.savedListingIds}
                onToggle={toggleListing}
                emptyText="No active listings."
                carousel
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
