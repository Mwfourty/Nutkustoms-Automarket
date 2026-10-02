import { Compass, Menu, MessageCircle, Moon, Sun, Tag, User, Warehouse, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoDark from '../../assets/ntkstms-logo-removebg-preview.png';
import logoLight from '../../assets/ntkstms-logo-light-mode.png';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Browse', icon: Compass, to: '/' },
  { label: 'Sell', icon: Tag, to: '/sell' },
  { label: 'My Garage', icon: Warehouse, to: '/garage' },
];

const MOBILE_LINKS = [
  ...NAV_LINKS,
  { label: 'Messages', icon: MessageCircle, to: '/messages' },
  { label: 'Profile', icon: User, to: '/profile' },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-30 px-4 sm:px-6">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between rounded-2xl border border-white/10 bg-black/70 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-6 light:border-black/10 light:bg-white/80 light:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center">
          <img
            src={theme === 'light' ? logoLight : logoDark}
            alt="NTKSTMS Logo"
            className="h-14 w-14 object-contain scale-200 origin-left md:scale-300"
          />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 font-display text-sm tracking-wide transition-colors hover:text-amber-200 light:hover:text-amber-600 ${
                  isActive ? 'text-white light:text-neutral-900' : 'text-neutral-400 light:text-neutral-500'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 light:border-black/10 light:bg-black/5 light:text-neutral-600 light:hover:bg-black/10"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <NavLink
            to="/messages"
            aria-label="Messages"
            className={({ isActive }) =>
              `relative hidden h-9 w-9 items-center justify-center rounded-lg border transition-colors md:flex ${
                isActive
                  ? 'border-transparent bg-white text-black light:bg-neutral-900 light:text-white'
                  : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 light:border-black/10 light:bg-black/5 light:text-neutral-600 light:hover:bg-black/10'
              }`
            }
          >
            <MessageCircle size={16} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-300" />
          </NavLink>
          <NavLink
            to="/profile"
            aria-label="Account"
            className={({ isActive }) =>
              `hidden h-9 w-9 items-center justify-center rounded-lg border transition-colors md:flex ${
                isActive
                  ? 'border-transparent bg-white text-black light:bg-neutral-900 light:text-white'
                  : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 light:border-black/10 light:bg-black/5 light:text-neutral-600 light:hover:bg-black/10'
              }`
            }
          >
            <User size={16} />
          </NavLink>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 md:hidden light:border-black/10 light:bg-black/5 light:text-neutral-600 light:hover:bg-black/10"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mx-auto mt-2 flex max-w-[1700px] flex-col rounded-2xl border border-white/10 bg-black/80 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl md:hidden light:border-black/10 light:bg-white/90 light:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          {MOBILE_LINKS.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 font-display text-sm tracking-wide transition-colors ${
                  isActive
                    ? 'bg-white text-black light:bg-neutral-900 light:text-white'
                    : 'text-neutral-300 hover:bg-white/5 light:text-neutral-700 light:hover:bg-black/5'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
