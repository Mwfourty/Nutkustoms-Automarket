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
import LightRays from '../components/effects/LightRays';
import Navbar from '../components/store/Navbar';
import Footer from '../components/store/Footer';
import ListingCard from '../components/store/ListingCard';
import Stars from '../components/common/Stars';
import { BTN, PANEL, Panel, Row } from '../components/garage/Panel';
import { useTheme } from '../context/ThemeContext';
import { mockConversations } from '../lib/mockMessages';
import { mockListings } from '../lib/mockListings';
import { myProfile, publicProfiles, type Profile } from '../lib/mockProfiles';

type Tab = 'saved' | 'contacts' | 'listings' | 'settings';

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'saved', label: 'Saved Listings', icon: Bookmark },
  { id: 'contacts', label: 'Saved Contacts', icon: Users },
  { id: 'listings', label: 'My Listings', icon: List },
];

const formatPrice = (price: number) => `R${price.toLocaleString('en-ZA')}`;

const NAV_ITEM =
  'flex w-auto shrink-0 items-center gap-3 whitespace-nowrap rounded-xl border px-4 py-3 text-left font-display text-sm transition-colors lg:w-full';
const NAV_IDLE =
  'border-white/8 bg-white/[0.03] text-neutral-300 hover:border-white/20 light:border-black/10 light:bg-white/80 light:text-neutral-700 light:hover:border-black/25';
const NAV_ACTIVE =
  'border-transparent bg-white text-black light:bg-neutral-900 light:text-white';

const ProfilePage = () => {
  const { userId } = useParams();
  const isOwn = userId === undefined;
  const profile: Profile | undefined = isOwn ? myProfile : publicProfiles[userId];

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black text-neutral-400 light:bg-[#f7f5f0]">
        <p>Profile not found.</p>
        <Link to="/" className="text-amber-300 light:text-amber-600">
          Back to browse
        </Link>
      </div>
    );
  }
  return <ProfileView key={userId ?? 'own'} profile={profile} isOwn={isOwn} />;
};

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

const ListingGrid = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {mockListings.slice(0, count).map((l) => (
      <ListingCard key={l.id} listing={l} />
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
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const stats = [
    { value: String(profile.listingsSold), label: 'Listings sold' },
    { value: String(profile.carsInGarage), label: 'Cars in garage' },
    { value: profile.rating.toFixed(1), label: 'Average rating' },
  ];

  const renderTab = () => {
    switch (tab) {
      case 'saved':
        return <ListingGrid count={3} />;
      case 'contacts':
        return (
          <Panel icon={Users} title="Saved contacts">
            {mockConversations.map((c) => (
              <Row key={c.id} icon={User} primary={c.name} secondary={c.subject} trailing={
                <Link to="/messages" aria-label={`Message ${c.name}`} className="text-neutral-500 hover:text-neutral-200 light:hover:text-neutral-900">
                  <MessageCircle size={15} />
                </Link>
              } />
            ))}
          </Panel>
        );
      case 'settings':
        return (
          <Panel icon={Settings} title="Settings">
            <label className="flex cursor-pointer items-center justify-between border-b border-white/8 py-3 text-sm text-neutral-200 light:border-black/10 light:text-neutral-800">
              Light theme
              <input type="checkbox" checked={theme === 'light'} onChange={toggleTheme} className="h-4 w-4 accent-amber-300" />
            </label>
            <label className="flex cursor-pointer items-center justify-between py-3 text-sm text-neutral-200 light:text-neutral-800">
              Email notifications
              <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="h-4 w-4 accent-amber-300" />
            </label>
          </Panel>
        );
      default:
        return <HistoryPanel profile={profile} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-black transition-colors light:bg-[#f7f5f0]">
      <div className="pointer-events-none fixed inset-0 h-screen">
        <LightRays raysOrigin="top-center" raysColor="#fff3c4" raysSpeed={0.6} lightSpread={0.7} rayLength={1.8} followMouse mouseInfluence={0.08} fadeDistance={1.1} saturation={0.9} lightMode={theme === 'light'} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-10">
          {isOwn && (
            <nav className="flex w-full gap-3 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setTab(id)} className={`${NAV_ITEM} ${tab === id ? NAV_ACTIVE : NAV_IDLE}`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
              <Link to="/garage" className={`${NAV_ITEM} ${NAV_IDLE}`}>
                <Home size={15} /> My Garage
              </Link>
              <button type="button" onClick={() => setTab('settings')} className={`${NAV_ITEM} ${tab === 'settings' ? NAV_ACTIVE : NAV_IDLE}`}>
                <Settings size={15} /> Settings
              </button>
              <button type="button" onClick={() => navigate('/')} className={`${NAV_ITEM} ${NAV_IDLE}`}>
                <LogOut size={15} /> Logout
              </button>
            </nav>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <section className={`${PANEL} flex flex-wrap items-center justify-between gap-4 p-6`}>
              <div className="flex items-center gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 sm:h-20 sm:w-20 light:border-black/10 light:bg-black/5">
                  <User size={28} />
                </span>
                <div>
                  <h1 className="font-display text-2xl font-semibold text-white light:text-neutral-900">{profile.name}</h1>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                    <Stars rating={profile.rating} /> ({profile.reviews})
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                    Member since {profile.memberSince} &bull; <MapPin size={11} /> {profile.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isOwn ? (
                  <button type="button" className={BTN}>
                    <Edit3 size={13} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <Link to="/messages" className={BTN}>
                      <MessageCircle size={13} /> Message
                    </Link>
                    <Link to={`/garage/${profile.id}`} className={BTN}>
                      <Home size={13} /> Garage
                    </Link>
                  </>
                )}
                <button type="button" onClick={share} className={BTN}>
                  <Share2 size={13} /> {copied ? 'Link copied' : 'Share'}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {stats.map((s) => (
                <div key={s.label} className={`${PANEL} py-4 text-center`}>
                  <p className="font-display text-2xl font-semibold text-white light:text-neutral-900">{s.value}</p>
                  <p className="text-xs text-neutral-500">{s.label}</p>
                </div>
              ))}
            </div>

            {isOwn ? (
              renderTab()
            ) : (
              <>
                <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-200 light:text-neutral-900">
                  Active listings
                </h2>
                <ListingGrid count={3} />
                <HistoryPanel profile={profile} />
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
