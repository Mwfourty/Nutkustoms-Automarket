import { Plus } from 'lucide-react';
import { useState, type ElementType, type ReactNode } from 'react';

export const PANEL =
  'rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl light:border-black/10 light:bg-white/80 light:shadow-sm';

export const BTN =
  'flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 font-display text-xs tracking-wide text-neutral-200 transition-colors hover:border-white/25 light:border-black/10 light:bg-white light:text-neutral-800 light:hover:border-black/25';

interface PanelProps {
  icon: ElementType;
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const Panel = ({ icon: Icon, title, action, className = '', children }: PanelProps) => (
  <section className={`${PANEL} p-5 ${className}`}>
    <header className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-widest text-neutral-200 light:text-neutral-900">
        <Icon size={14} />
        {title}
      </h2>
      {action}
    </header>
    <div className="flex flex-col">{children}</div>
  </section>
);

interface RowProps {
  icon: ElementType;
  primary: string;
  secondary?: string;
  trailing?: ReactNode;
}

export const Row = ({ icon: Icon, primary, secondary, trailing }: RowProps) => (
  <div className="flex items-center gap-3 border-b border-white/8 py-3 last:border-b-0 light:border-black/10">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-neutral-400 light:bg-black/5">
      <Icon size={14} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-white light:text-neutral-900">{primary}</p>
      {secondary && <p className="truncate text-xs text-neutral-500">{secondary}</p>}
    </div>
    {trailing}
  </div>
);

interface AddRowProps {
  label: string;
  primaryPlaceholder: string;
  secondaryPlaceholder: string;
  onAdd: (primary: string, secondary: string) => void;
}

export const AddRow = ({ label, primaryPlaceholder, secondaryPlaceholder, onAdd }: AddRowProps) => {
  const [open, setOpen] = useState(false);
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');

  const submit = () => {
    if (!primary.trim()) return;
    onAdd(primary.trim(), secondary.trim());
    setPrimary('');
    setSecondary('');
    setOpen(false);
  };

  const input =
    'min-w-0 flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-amber-200/40 focus:outline-none light:border-black/10 light:text-neutral-900';

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-white/15 px-3 py-2.5 text-left text-sm font-medium text-neutral-300 transition-colors hover:border-white/30 light:border-black/15 light:text-neutral-700 light:hover:border-black/30"
      >
        <Plus size={14} className="text-neutral-500" />
        {label}
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
      <input autoFocus value={primary} placeholder={primaryPlaceholder} onChange={(e) => setPrimary(e.target.value)} className={input} />
      <input value={secondary} placeholder={secondaryPlaceholder} onChange={(e) => setSecondary(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} className={input} />
      <button type="button" onClick={submit} className={BTN}>
        Save
      </button>
    </div>
  );
};
