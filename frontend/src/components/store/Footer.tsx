import type { SVGProps } from "react";
import { ArrowUp, ShieldCheck } from "lucide-react";

// Lucide dropped its brand icons, so these are local copies in the same
// 24x24 stroke style. They accept className just like lucide icons do.
const Instagram = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Youtube = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const linkClass =
  "text-sm text-neutral-400 transition-colors hover:text-neutral-100 focus-visible:outline-none focus-visible:text-neutral-100 light:text-neutral-600 light:hover:text-neutral-900 light:focus-visible:text-neutral-900";

const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 light:border-black/10 light:text-neutral-600 light:hover:border-black/25 light:hover:bg-black/5 light:hover:text-neutral-900 light:focus-visible:ring-black/30";

const navGroups = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Help", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
];

const socials = [
  { label: "Nutkustoms on Instagram", href: "#", Icon: Instagram },
  { label: "Nutkustoms on YouTube", href: "#", Icon: Youtube },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/8 bg-black/60 backdrop-blur-xl light:border-black/10 light:bg-white/70">
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-3">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="text-lg font-semibold tracking-tight text-neutral-100 light:text-neutral-900">
              Nutkustoms Automarket
            </p>
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-neutral-400 light:text-neutral-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Buy and sell with verified garage history.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={socialClass}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="flex gap-16 sm:gap-24">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-medium text-neutral-200 light:text-neutral-800">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-neutral-500 sm:flex-row light:border-black/10">
          <p>&copy; {new Date().getFullYear()} Nutkustoms Automarket. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 light:hover:text-neutral-900 light:focus-visible:ring-black/30"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;