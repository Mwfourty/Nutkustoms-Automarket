import { Compass, MessageCircle, Tag, User, Warehouse } from 'lucide-react';
import logo from '../../assets/ntkstms-logo-removebg-preview.png';

const NAV_LINKS = [
  { label: 'Browse', icon: Compass },
  { label: 'Sell', icon: Tag },
  { label: 'My Garage', icon: Warehouse },
];

const Navbar = () => {
  return (
    <header className="sticky top-4 z-30 px-4 sm:px-6">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between rounded-full border border-white/10 bg-black/70 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-6">
        <div className="flex items-center">
          <img
            src={logo}
            alt="NTKSTMS Logo"
            className="h-14 w-14 object-contain scale-300 origin-left"
          />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, icon: Icon }, index) => (
            <a
              key={label}
              href="#"
              className={`flex flex-col items-center gap-1 font-display text-sm tracking-wide transition-colors hover:text-amber-200 ${
                index === 0 ? 'text-white' : 'text-neutral-400'
              }`}
            >
              <Icon size={18} />
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Messages"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10"
          >
            <MessageCircle size={16} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-300" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10"
          >
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
