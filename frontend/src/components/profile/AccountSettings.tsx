import { Eye, KeyRound, ShieldCheck, UserX, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { BTN, Panel } from '../garage/Panel';
import { clearClientSession, logout } from '../../services/session';
import {
  PROFILE_VISIBILITY,
  changePassword,
  deactivateAccount,
  updatePrivacy,
} from '../../services/usersApi';

const INPUT =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60 light:border-black/10 light:bg-black/5 light:text-neutral-900';
const PRIMARY =
  'flex items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-medium text-black disabled:opacity-60 light:bg-neutral-900 light:text-white';
const DANGER =
  'flex items-center justify-center gap-1.5 rounded-lg border border-rose-400/40 px-4 py-2 text-xs font-medium text-rose-300 disabled:opacity-60';

const errorText = (err: unknown) =>
  err instanceof Error ? err.message : 'Something went wrong. Please try again.';

const ToggleRow = ({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint: string;
  disabled?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div>
      <p className="text-sm text-neutral-200 light:text-neutral-800">{label}</p>
      <p className="text-xs text-neutral-500">{hint}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
        checked ? 'bg-amber-300' : 'bg-white/15 light:bg-black/15'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  </div>
);

const Status = ({ error }: { error: string | null }) =>
  error ? <p className="text-sm text-rose-400">{error}</p> : null;

const ChangePassword = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (next.length < 8) return setError('New password must be at least 8 characters.');
    if (next !== confirm) return setError('New passwords do not match.');

    setBusy(true);
    try {
      await changePassword({ currentPassword: current, newPassword: next });
      // The server invalidates every older token, so sign in again.
      clearClientSession();
      window.location.replace('/login');
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <input
        className={INPUT}
        type="password"
        autoComplete="current-password"
        placeholder="Current password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        required
      />
      <input
        className={INPUT}
        type="password"
        autoComplete="new-password"
        placeholder="New password (min. 8 characters)"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        required
      />
      <input
        className={INPUT}
        type="password"
        autoComplete="new-password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Status error={error} />
      <p className="text-xs text-neutral-500">
        You will be signed out on all devices after changing your password.
      </p>
      <button type="submit" disabled={busy} className={`${PRIMARY} w-full sm:w-auto sm:self-start`}>
        {busy ? 'Updating…' : 'Change password'}
      </button>
    </form>
  );
};

const Privacy = ({
  initialVisibility,
  initialAllowMessages,
}: {
  initialVisibility: number;
  initialAllowMessages: boolean;
}) => {
  const [visibility, setVisibility] = useState(initialVisibility);
  const [allowMessages, setAllowMessages] = useState(initialAllowMessages);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (nextVisibility: number, nextAllow: boolean) => {
    const prev = { visibility, allowMessages };
    setVisibility(nextVisibility);
    setAllowMessages(nextAllow);
    setError(null);
    setBusy(true);

    try {
      await updatePrivacy({ profileVisibility: nextVisibility, allowMessages: nextAllow });
    } catch (err) {
      setVisibility(prev.visibility);
      setAllowMessages(prev.allowMessages);
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <ToggleRow
        checked={visibility === PROFILE_VISIBILITY.Public}
        onChange={(on) =>
          save(on ? PROFILE_VISIBILITY.Public : PROFILE_VISIBILITY.Private, allowMessages)
        }
        label="Public profile"
        hint="When off, other users can't open your profile."
        disabled={busy}
      />
      <ToggleRow
        checked={allowMessages}
        onChange={(on) => save(visibility, on)}
        label="Allow new messages"
        hint="When off, buyers can't start new conversations with you."
        disabled={busy}
      />
      <Status error={error} />
    </div>
  );
};

const Deactivate = () => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      await deactivateAccount(password);
      await logout();
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">
          Deactivating signs you out. Log in again with your password to restore your account.
        </p>
        <button type="button" onClick={() => setOpen(true)} className={DANGER}>
          <UserX size={14} /> Deactivate account
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <input
        className={INPUT}
        type="password"
        autoComplete="current-password"
        placeholder="Confirm with your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Status error={error} />
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className={DANGER}>
          {busy ? 'Deactivating…' : 'Confirm deactivation'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={BTN}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const Soon = ({ title, items }: { title: string; items: string[] }) => (
  <div className="py-2 text-sm text-neutral-500">
    <span className="text-neutral-300 light:text-neutral-700">{title}</span>
    {': '}
    {items.join(', ')} <span className="text-xs uppercase tracking-wider">· coming soon</span>
  </div>
);

const Section = ({
  icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) => (
  <Panel icon={icon} title={title}>
    {children}
  </Panel>
);

const AccountSettings = ({
  profileVisibility,
  allowMessages,
}: {
  profileVisibility: number;
  allowMessages: boolean;
}) => (
  <>
    <Section icon={KeyRound} title="Security">
      <ChangePassword />
      <div className="mt-3 border-t border-white/8 pt-2 light:border-black/10">
        <Soon title="Also planned" items={['Active sessions', 'Two-factor authentication']} />
      </div>
    </Section>

    <Section icon={Eye} title="Privacy">
      <Privacy initialVisibility={profileVisibility} initialAllowMessages={allowMessages} />
    </Section>

    <Section icon={ShieldCheck} title="Verification">
      <Soon title="Verification" items={['Identity verification', 'Dealer / business verification']} />
    </Section>

    <Section icon={UserX} title="Account">
      <Deactivate />
      <div className="mt-3 border-t border-white/8 pt-2 light:border-black/10">
        <Soon title="Also planned" items={['Delete account']} />
      </div>
    </Section>
  </>
);

export default AccountSettings;
