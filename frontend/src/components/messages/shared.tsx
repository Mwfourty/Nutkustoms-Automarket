import { User } from 'lucide-react';

export const PANEL =
  'rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl light:border-black/10 light:bg-white/80 light:shadow-sm';

export const Avatar = ({ size = 32 }: { size?: number }) => (
  <span
    style={{ width: size, height: size }}
    className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 light:border-black/10 light:bg-black/5"
  >
    <User size={size * 0.45} />
  </span>
);