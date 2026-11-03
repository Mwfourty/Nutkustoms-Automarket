import {
  Bookmark,
  Car,
  Edit3,
  Home,
  List,
  LogOut,
  MapPin,
  MessageCircle,
  Settings,
  Share2,
  Tag,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListingCard from '../components/store/ListingCard';
import Stars from '../components/common/Stars';
import { BTN, PANEL, Panel, Row } from '../components/garage/Panel';
import { useTheme } from '../context/ThemeContext';
import { shareLink } from '../lib/share';
import { mockConversations } from '../lib/mockMessages';
import { mockListings } from '../lib/mockListings';
import { myProfile, publicProfiles, type Profile } from '../lib/mockProfiles';

type Tab = 'saved' | 'contacts' | 'listings' | 'settings';

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

const NAV_ITEM =
  'flex w-full items-center gap-3 whitespace-nowrap rounded-xl border px-4 py-3 text-left font-display text-sm transition-colors';
const NAV_IDLE =
  'border-white/8 bg-white/[0.03] text-neutral-300 hover:border-white/20 light:border-black/10 light:bg-white/80 light:text-neutral-700 light:hover:border-black/25';
const NAV_ACTIVE = 'border-transparent bg-white text-black light:bg-neutral-900 light:text-white';

const ACTION = 'w-full justify-center sm:w-auto';
const PRIMARY_SM =
  'flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black sm:w-auto light:bg-neutral-900 light:text-white';

const ProfilePage = () => {
  const { userId } = useParams();
  const isOwn = userId === undefined;
  const profile: Profile | undefined = isOwn ? myProfile : publicProfiles[userId];

  if (!profile) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-black text-neutral-400 light:bg-[#f7f5f0]">
        <p>Profile not found.</p>
        <Link to="/" className="text-amber-300 light:text-amber-600">
          Back to browse
        </Link>
      </div>
    );
  }
  return <ProfileView key={userId ?? 'own'} profile={profile} isOwn={isOwn} />;
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

const HistoryPanel = ({ profile }: { profile: Profile }) => (
  <Panel icon={Tag} title="Buy / sell history">
    {profile.history.map((h) => (
      <Row
        key={h.id}
        icon={Car}
        primary={h.title}
        secondary={`${h.kind} \u00b7 ${h.date}`}
        trailing={<span className="text-sm font-semibold text-white light:text-neutral-900">{formatPrice(h.price)}</span>}
      />
    ))}
  </Panel>
);

/** carousel: a swipeable row on phones (peeks the next card), a normal grid from sm up. */
const ListingGrid = ({ count, carousel = false }: { count: number; carousel?: boolean }) => (
  <div
    className={
      carousel
        ? '-mx-4 -my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-2 sm:mx-0 sm:my-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:p-0 xl:grid-cols-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        : 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
    }
  >
    {mockListings.slice(0, count).map((l) => (
      <div key={l.id} className={carousel ? 'w-[78%] shrink-0 snap-start sm:w-auto' : undefined}>
        <ListingCard listing={l} />
      </div>
    ))}
  </div>
);

const ProfileView = ({ profile, isOwn }: { profile: Profile; isOwn: boolean }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('listings');
  const [copied, setCopied] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const share = async () => {
    if ((await shareLink(profile.name)) === 'copied') {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const logout = () => navigate('/');

  const stats = [
    { value: String(profile.listingsSold), label: 'Listings sold' },
    { value: String(profile.carsInGarage), label: 'Cars in garage' },
    { value: profile.rating.toFixed(1), label: 'Avg. rating' },
  ];

  const renderTab = () => {
    switch (tab) {
      case 'saved':
        return <ListingGrid count={3} />;
      case 'contacts':
        return (
          <Panel icon={Users} title="Saved contacts">
            {mockConversations.map((c) => (
              <Row
                key={c.id}
                icon={User}
                primary={c.name}
                secondary={c.subject}
                trailing={
                  <Link
                    to="/messages"
                    aria-label={`Message ${c.name}`}
                    className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:text-neutral-200 light:hover:text-neutral-900"
                  >
                    <MessageCircle size={15} />
                  </Link>
                }
              />
            ))}
          </Panel>
        );
      case 'settings':
        return (
          <Panel icon={Settings} title="Settings">
            <div className="flex items-center justify-between border-b border-white/8 py-3 text-sm text-neutral-200 light:border-black/10 light:text-neutral-800">
              Light theme
              <Switch checked={theme === 'light'} onChange={toggleTheme} label="Light theme" />
            </div>
            <div className="flex items-center justify-between py-3 text-sm text-neutral-200 light:text-neutral-800">
              Email notifications
              <Switch checked={emailAlerts} onChange={setEmailAlerts} label="Email notifications" />
            </div>
            {/* The desktop sidebar already has Logout */}
            <button
              type="button"
              onClick={logout}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-neutral-300 lg:hidden light:border-black/10 light:text-neutral-700"
            >
              <LogOut size={15} /> Log out
            </button>
          </Panel>
        );
      default:
        return <HistoryPanel profile={profile} />;
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
              <button type="button" onClick={logout} className={`${NAV_ITEM} ${NAV_IDLE}`}>
                <LogOut size={15} /> Logout
              </button>
            </nav>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
            {/* Header */}
            <section
              className={`${PANEL} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6`}
            >
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 sm:h-20 sm:w-20 light:border-black/10 light:bg-black/5">
                  <User size={28} />
                </span>
                <div className="min-w-0">
                  <h1 className="truncate font-display text-xl font-semibold text-white sm:text-2xl light:text-neutral-900">
                    {profile.name}
                  </h1>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                    <Stars rating={profile.rating} /> ({profile.reviews})
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500">
                    <span>Member since {profile.memberSince}</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {profile.location}
                    </span>
                  </p>
                </div>
              </div>

              <div className={`grid gap-2 sm:flex ${isOwn ? 'grid-cols-2' : 'grid-cols-[2fr_1fr_1fr]'}`}>
                {isOwn ? (
                  <button type="button" className={`${BTN} ${ACTION}`}>
                    <Edit3 size={13} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <Link to="/messages" className={PRIMARY_SM}>
                      <MessageCircle size={13} /> Message
                    </Link>
                    <Link to={`/garage/${profile.id}`} className={`${BTN} ${ACTION}`}>
                      <Home size={13} /> Garage
                    </Link>
                  </>
                )}
                <button type="button" onClick={share} className={`${BTN} ${ACTION}`}>
                  <Share2 size={13} /> {copied ? 'Copied' : 'Share'}
                </button>
              </div>
            </section>

            {/* Stats: one compact panel instead of three tall ones */}
            <div className={`${PANEL} grid grid-cols-3 divide-x divide-white/8 py-4 light:divide-black/10`}>
              {stats.map((s) => (
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
                {renderTab()}
              </>
            ) : (
              <>
                <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-200 light:text-neutral-900">
                  Active listings
                </h2>
                <ListingGrid count={3} carousel />
                <HistoryPanel profile={profile} />
              </>
            )}
          </div>
        </main>
    </>
  );
};

export default ProfilePage;