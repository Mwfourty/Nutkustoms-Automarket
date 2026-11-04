import { Compass, MessageCircle, Moon, Sun, Tag, User, Warehouse, type LucideIcon } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { Link, NavLink } from 'react-router-dom';
import logoDark from '../../assets/ntkstms-logo-removebg-preview.png';
import logoLight from '../../assets/ntkstms-logo-light-mode.png';
import { useTheme } from '../../context/ThemeContext';
import { useTabBar } from '../../context/TabBarContext';

type NavItem = { label: string; short?: string; icon: LucideIcon; to: string; badge?: boolean };

const NAV_LINKS: NavItem[] = [
  { label: 'Browse', icon: Compass, to: '/' },
  { label: 'Sell', icon: Tag, to: '/sell' },
  { label: 'Garages', short: 'Garages', icon: Warehouse, to: '/garages' },
];

const UTILITY_LINKS: NavItem[] = [
  { label: 'Messages', icon: MessageCircle, to: '/messages', badge: true },
  { label: 'Profile', icon: User, to: '/profile' },
];

const MOBILE_LINKS = [...NAV_LINKS, ...UTILITY_LINKS];

const PILL_SPRING = { type: 'spring', stiffness: 500, damping: 38 } as const;
const PILL_BG = 'bg-white light:bg-neutral-900';

const Logo = () => {
  const { theme } = useTheme();
  return (
    <Link to="/" aria-label="NTKSTMS home" className="flex items-center">
      <img
        src={theme === 'light' ? logoLight : logoDark}
        alt="NTKSTMS Logo"
        className="h-14 w-14 object-contain scale-200 origin-left md:scale-300"
      />
    </Link>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 light:border-black/10 light:bg-black/5 light:text-neutral-600 light:hover:bg-black/10"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

/* ---------- Desktop ---------- */

const DesktopNav = () => (
  <nav
    aria-label="Primary"
    className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 light:border-black/10 light:bg-black/5"
  >
    {NAV_LINKS.map(({ label, icon: Icon, to }) => (
      <NavLink
        key={to}
        to={to}
        end={to === '/'}
        className={({ isActive }) =>
          `relative flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm tracking-wide transition-colors ${
            isActive
              ? 'text-black light:text-white'
              : 'text-neutral-400 hover:text-amber-200 light:text-neutral-500 light:hover:text-amber-600'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="nav-pill-desktop"
                transition={PILL_SPRING}
                style={{ borderRadius: 9999 }}
                className={`absolute inset-0 ${PILL_BG}`}
              />
            )}
            <Icon size={16} className="relative z-10" />
            <span className="relative z-10">{label}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

const IconLink = ({ to, label, icon: Icon, badge }: NavItem) => (
  <NavLink
    to={to}
    aria-label={label}
    className={({ isActive }) =>
      `relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        isActive
          ? 'border-transparent bg-white text-black light:bg-neutral-900 light:text-white'
          : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 light:border-black/10 light:bg-black/5 light:text-neutral-600 light:hover:bg-black/10'
      }`
    }
  >
    <Icon size={16} />
    {badge && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-300" />}
  </NavLink>
);

/* ---------- Mobile ---------- */

const MobileTabBar = () => {
    const { hidden } = useTabBar();

      return (
    <motion.nav
      aria-label="Primary"
      aria-hidden={hidden}
      initial={false}
      animate={{ y: hidden ? 'calc(100% + 2rem)' : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 38 }}
      style={{ pointerEvents: hidden ? 'none' : 'auto' }}
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 md:hidden"
    >

    <ul className="mx-auto flex max-w-md items-center justify-between rounded-full border border-white/10 bg-black/70 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl light:border-black/10 light:bg-white/80 light:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {MOBILE_LINKS.map(({ label, short, icon: Icon, to, badge }) => (
        <motion.li key={to} layout="position" transition={PILL_SPRING}>
          <NavLink
            to={to}
            end={to === '/'}
            aria-label={label}
            className={({ isActive }) =>
              `relative flex h-11 items-center justify-center rounded-full font-display text-sm tracking-wide transition-colors ${
                isActive
                  ? 'gap-2 px-4 text-black light:text-white'
                  : 'w-11 text-neutral-400 light:text-neutral-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill-mobile"
                    transition={PILL_SPRING}
                    style={{ borderRadius: 9999 }}
                    className={`absolute inset-0 ${PILL_BG}`}
                  />
                )}
                <span className="relative z-10 flex">
                  <Icon size={20} />
                  {badge && !isActive && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-300" />
                  )}
                </span>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.08, duration: 0.15 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {short ?? label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        </motion.li>
      ))}
    </ul>
    </motion.nav>
  );
};

/* ---------- Navbar ---------- */

const Navbar = () => (
  <MotionConfig reducedMotion="user">
    {/* Mobile top: logo + theme only */}
    <header className="flex items-center justify-between px-4 py-5 md:hidden">
      <Logo />
      <ThemeToggle />
    </header>

    {/* Desktop */}
    <header className="sticky top-4 z-30 hidden px-6 md:block">
      <div className="mx-auto grid max-w-[1700px] grid-cols-[1fr_auto_1fr] items-center rounded-2xl border border-white/10 bg-black/70 px-6 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl light:border-black/10 light:bg-white/80 light:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="justify-self-start">
          <Logo />
        </div>
        <DesktopNav />
        <div className="flex items-center gap-3 justify-self-end">
          <ThemeToggle />
          {UTILITY_LINKS.map((item) => (
            <IconLink key={item.to} {...item} />
          ))}
        </div>
      </div>
    </header>

    {/* Mobile bottom bar */}
    <MobileTabBar />
  </MotionConfig>
);

export default Navbar;