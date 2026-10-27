import { ArrowRight, Check, Circle, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BorderGlow from '../components/effects/BorderGlow';
import SideRays from '../components/effects/SideRays';
import logoDark from '../assets/ntkstms-logo-og-removebg-preview.png';
import logoLight from '../assets/ntkstms-logo-og-light-mode.png';
import { useTheme } from '../context/ThemeContext';
import { login, register } from '../services/authApi';

type Mode = 'login' | 'signup';
type FieldName = 'firstName' | 'lastName' | 'username' | 'email' | 'password' | 'confirmPassword';
type FormState = Record<FieldName, string>;
type Errors = Partial<Record<FieldName | 'terms', string>>;

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const NAME_MIN = 3;
const NAME_MAX = 50;
const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;
const EMAIL_MAX = 254;

const SIGNUP_FIELDS: FieldName[] = ['firstName', 'lastName', 'username', 'email', 'password', 'confirmPassword'];
const LOGIN_FIELDS: FieldName[] = ['email', 'password'];

const NAME_RE = /^\p{L}+(?:[ '-]\p{L}+)*$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Small deny-list. For production, consider a larger list or the HaveIBeenPwned k-anonymity API.
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'passw0rd', '12345678', '123456789', '1234567890',
  'qwerty123', 'qwertyui', 'qwertyuiop', 'iloveyou', 'admin123', 'letmein1', 'welcome1',
  'abc12345', '11111111', '00000000', 'football', 'baseball', 'monkey123', 'dragon123',
]);

/* -------------------------------------------------------------------------- */
/*  Input formatters (run on every keystroke)                                 */
/* -------------------------------------------------------------------------- */

/**
 * Letters, spaces, hyphens and apostrophes only. First letter of every word is
 * capitalised and the rest forced to lowercase, so "jOHN", "JOHN" and "john"
 * all become "John". Handles "mary-ann" -> "Mary-Ann" and "o'neil" -> "O'Neil".
 * (Trade-off: "McDonald" becomes "Mcdonald" - unavoidable if ALL CAPS and
 * all-lowercase must both be prevented.)
 */
const formatName = (raw: string) =>
  raw
    .replace(/[^\p{L} '-]/gu, '')
    .replace(/^[ '-]+/, '')
    .replace(/ {2,}/g, ' ')
    .replace(/-{2,}/g, '-')
    .toLowerCase()
    .replace(/(^|[ '-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase())
    .slice(0, NAME_MAX);

const sanitizeUsername = (raw: string) =>
  raw
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, USERNAME_MAX);

/* -------------------------------------------------------------------------- */
/*  Validators                                                                */
/* -------------------------------------------------------------------------- */

const validateName = (value: string, label: string): string | undefined => {
  const v = value.trim();
  if (!v) return `${label} is required.`;
  if (v.replace(/[ '-]/g, '').length < NAME_MIN) return `${label} must be at least ${NAME_MIN} letters.`;
  if (!NAME_RE.test(v)) return `${label} can only contain letters, spaces, hyphens and apostrophes.`;
  return undefined;
};

const validateUsername = (value: string): string | undefined => {
  if (!value) return 'Username is required.';
  if (value.length < USERNAME_MIN) return `Username must be at least ${USERNAME_MIN} characters.`;
  if (!/^[a-z0-9._]+$/.test(value)) return 'Use only letters, numbers, dots and underscores.';
  if (/^[._]|[._]$/.test(value)) return 'Username cannot start or end with a dot or underscore.';
  if (/[._]{2}/.test(value)) return 'Username cannot have two dots or underscores in a row.';
  return undefined;
};

const validateEmail = (value: string): string | undefined => {
  const v = value.trim();
  if (!v) return 'Email is required.';
  if (v.length > EMAIL_MAX || !EMAIL_RE.test(v) || v.includes('..')) return 'Enter a valid email address.';
  return undefined;
};

/* -------------------------------------------------------------------------- */
/*  Password strength                                                         */
/* -------------------------------------------------------------------------- */

interface PasswordResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  checks: { length: boolean; lower: boolean; upper: boolean; number: boolean };
  hasSymbol: boolean;
  isCommon: boolean;
  tips: string[];
}

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-emerald-500'];
const STRENGTH_TEXT = [
  'text-red-400 light:text-red-600',
  'text-red-400 light:text-red-600',
  'text-orange-400 light:text-orange-600',
  'text-yellow-300 light:text-yellow-600',
  'text-emerald-400 light:text-emerald-600',
];

const evaluatePassword = (pw: string, personal: string[]): PasswordResult => {
  const checks = {
    length: pw.length >= PASSWORD_MIN,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    number: /\d/.test(pw),
  };
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const lowered = pw.toLowerCase();
  const isCommon = COMMON_PASSWORDS.has(lowered);
  const hasRepeats = /(.)\1{2,}/.test(pw);
  const hasPersonal = personal.some((p) => p.length >= 3 && lowered.includes(p.toLowerCase()));

  const variety = [checks.lower, checks.upper, checks.number, hasSymbol].filter(Boolean).length;

  let points = 0;
  if (pw.length >= 8) points += 1;
  if (pw.length >= 12) points += 1;
  if (pw.length >= 16) points += 1;
  if (variety >= 3) points += 1;
  if (variety === 4) points += 1;
  if (hasRepeats) points -= 1;
  if (hasPersonal) points -= 1;

  let score = Math.min(4, Math.max(0, points - 1));
  if (!checks.length || isCommon) score = 0;

  const tips: string[] = [];
  if (isCommon) tips.push('This is a very common password.');
  if (hasPersonal) tips.push('Avoid using your name, username or email.');
  if (hasRepeats) tips.push('Avoid repeating the same character.');

  return {
    score: score as PasswordResult['score'],
    label: STRENGTH_LABELS[score],
    checks,
    hasSymbol,
    isCommon,
    tips,
  };
};

const validatePassword = (pw: string, result: PasswordResult): string | undefined => {
  if (!pw) return 'Password is required.';
  if (pw.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters long.`;
  if (pw.length > PASSWORD_MAX) return `Password must be ${PASSWORD_MAX} characters or fewer.`;
  if (!result.checks.lower || !result.checks.upper || !result.checks.number)
    return 'Password needs an uppercase letter, a lowercase letter and a number.';
  if (result.isCommon) return 'That password is too common. Choose something harder to guess.';
  return undefined;
};

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-amber-300/60 focus:bg-white/8 light:border-black/10 light:bg-black/5 light:text-neutral-900 light:focus:border-amber-600/60';

const inputErrorClass =
  'border-red-400/70 focus:border-red-400 light:border-red-500/70 light:focus:border-red-500';

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                               */
/* -------------------------------------------------------------------------- */

const StrengthMeter = ({ result, show }: { result: PasswordResult; show: boolean }) => {
  if (!show) return null;
  const filled = Math.max(1, result.score);

  const requirements: { ok: boolean; text: string }[] = [
    { ok: result.checks.length, text: `${PASSWORD_MIN}+ characters` },
    { ok: result.checks.upper, text: 'Uppercase letter' },
    { ok: result.checks.lower, text: 'Lowercase letter' },
    { ok: result.checks.number, text: 'Number' },
  ];

  return (
    <div className="mt-3" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= filled ? STRENGTH_COLORS[result.score] : 'bg-white/10 light:bg-black/10'
              }`}
            />
          ))}
        </div>
        <span className={`w-16 text-right text-xs font-medium ${STRENGTH_TEXT[result.score]}`}>
          {result.label}
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {requirements.map((r) => (
          <li
            key={r.text}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              r.ok ? 'text-emerald-400 light:text-emerald-600' : 'text-neutral-500 light:text-neutral-500'
            }`}
          >
            {r.ok ? <Check size={12} /> : <Circle size={12} />}
            {r.text}
          </li>
        ))}
      </ul>

      {!result.hasSymbol && result.checks.length && (
        <p className="mt-2 text-xs text-neutral-500">Add a symbol (e.g. ! ? # $) for a stronger password.</p>
      )}
      {result.tips.map((t) => (
        <p key={t} className="mt-1 text-xs text-amber-300 light:text-amber-700">
          {t}
        </p>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const AuthPage = ({ mode }: { mode: Mode }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<FieldName | 'terms', boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});

  // /login and /signup reuse this component, so wipe sensitive/stale state when switching.
  useEffect(() => {
    setForm((f) => ({ ...f, password: '', confirmPassword: '' }));
    setTouched({});
    setSubmitted(false);
    setServerErrors({});
    setError(null);
    setAgreed(false);
    setShowPassword(false);
    setCapsLock(false);
  }, [mode]);

  const passwordResult = useMemo(
    () =>
      evaluatePassword(form.password, [form.firstName, form.lastName, form.username, form.email.split('@')[0]]),
    [form.password, form.firstName, form.lastName, form.username, form.email],
  );

  const clientErrors = useMemo<Errors>(() => {
    const e: Errors = {};

    e.email = validateEmail(form.email);

    if (isSignup) {
      e.firstName = validateName(form.firstName, 'First name');
      e.lastName = validateName(form.lastName, 'Last name');
      e.username = validateUsername(form.username);
      e.password = validatePassword(form.password, passwordResult);
      if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
      else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match.';
      if (!agreed) e.terms = 'You must accept the Terms & Conditions to continue.';
    } else if (!form.password) {
      // Never enforce complexity rules on login - only that something was typed.
      e.password = 'Password is required.';
    }

    return e;
  }, [form, agreed, isSignup, passwordResult]);

  const visibleError = (name: FieldName | 'terms'): string | undefined =>
    serverErrors[name] ?? (touched[name] || submitted ? clientErrors[name] : undefined);

  const renderError = (name: FieldName | 'terms') => {
    const msg = visibleError(name);
    return msg ? (
      <p id={`auth-${name}-error`} role="alert" className="mt-1.5 text-xs text-red-400 light:text-red-600">
        {msg}
      </p>
    ) : null;
  };

  const handleChange = (name: FieldName) => (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (name === 'firstName' || name === 'lastName') value = formatName(value);
    else if (name === 'username') value = sanitizeUsername(value);
    else if (name === 'email') value = value.replace(/\s/g, '').slice(0, EMAIL_MAX);
    else value = value.slice(0, PASSWORD_MAX);

    setForm((f) => ({ ...f, [name]: value }));
    if (serverErrors[name] || error) {
      setServerErrors((s) => ({ ...s, [name]: undefined }));
      setError(null);
    }
  };

  const handleBlur = (name: FieldName) => (e: FocusEvent<HTMLInputElement>) => {
    setTouched((t) => ({ ...t, [name]: true }));

    // Tidy up on blur: trailing separators in names, casing/whitespace in email.
    let value = e.target.value;
    if (name === 'firstName' || name === 'lastName') value = value.trim().replace(/[ '-]+$/, '');
    else if (name === 'email') value = value.trim().toLowerCase();
    else return;

    if (value !== e.target.value) setForm((f) => ({ ...f, [name]: value }));
  };

  const trackCapsLock = (e: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(e.getModifierState?.('CapsLock') ?? false);

  const inputProps = (name: FieldName, label: string, extraClass = '') => {
    const err = visibleError(name);
    return {
      id: `auth-${name}`,
      ref: (el: HTMLInputElement | null) => {
        fieldRefs.current[name] = el;
      },
      value: form[name],
      onChange: handleChange(name),
      onBlur: handleBlur(name),
      'aria-label': label,
      'aria-required': true,
      'aria-invalid': !!err,
      'aria-describedby': err ? `auth-${name}-error` : undefined,
      className: `${inputClass} ${err ? inputErrorClass : ''} ${extraClass}`.trim(),
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setSubmitted(true);
    setError(null);
    setServerErrors({});

    const order = isSignup ? SIGNUP_FIELDS : LOGIN_FIELDS;
    const firstInvalid = order.find((f) => clientErrors[f]);
    if (firstInvalid || clientErrors.terms) {
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setLoading(true);
    try {
      const email = form.email.trim().toLowerCase();

      if (isSignup) {
        await register({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          username: form.username.trim(),
          email,
          password: form.password, // never trim passwords
        });
        navigate('/login');
      } else {
        const result = await login({ email, password: form.password });
        localStorage.setItem('token', result.token);
        navigate('/');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';

      // Map common backend "already exists" responses onto the right field.
      if (isSignup && /email/i.test(message) && /(exist|taken|registered|in use)/i.test(message)) {
        setServerErrors({ email: 'An account with this email already exists.' });
        fieldRefs.current.email?.focus();
      } else if (isSignup && /username/i.test(message) && /(exist|taken|in use)/i.test(message)) {
        setServerErrors({ username: 'This username is already taken.' });
        fieldRefs.current.username?.focus();
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordToggle = (
    <button
      type="button"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      onClick={() => setShowPassword((s) => !s)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-200 light:hover:text-neutral-900"
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black transition-colors light:bg-[#f7f5f0]">
      <div className="pointer-events-none fixed inset-0 h-screen">
        <SideRays origin="top-right" />
      </div>

      <button
        type="button"
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300 backdrop-blur-xl transition-colors hover:bg-white/10 light:border-black/10 light:bg-black/5 light:text-neutral-600 light:hover:bg-black/10"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-8">
        <BorderGlow
          backgroundColor={theme === 'light' ? '#ffffff' : '#0a0a0a'}
          surfaceColor={theme === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.03)'}
          borderRadius={24}
          glowRadius={36}
          glowColor="45 90% 75%"
          glowIntensity={0.9}
          edgeSensitivity={35}
          coneSpread={22}
          colors={
            theme === 'light'
              ? ['#fbbf24', '#f59e0b', '#fde68a']
              : ['#ffffff', '#fbbf24', '#fff7ed']
          }
          className="w-full max-w-5xl"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative hidden min-h-140 flex-col items-center justify-center gap-6 border-r border-white/10 p-10 lg:flex light:border-black/10">
              <img
                src={theme === 'light' ? logoLight : logoDark}
                alt="NTKSTMS Logo"
                className="w-full max-w-sm object-contain"
              />
              <p className="max-w-xs text-center font-display text-lg tracking-wide text-neutral-300 light:text-neutral-700">
                Buy and sell with verified garage history.
              </p>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-10">
              <div className="mb-6 flex justify-center lg:hidden">
                <img
                  src={theme === 'light' ? logoLight : logoDark}
                  alt="NTKSTMS Logo"
                  className="h-24 object-contain"
                />
              </div>

              <h1 className="font-display text-3xl font-semibold tracking-wide text-white sm:text-4xl light:text-neutral-900">
                {isSignup ? 'Create an account' : 'Welcome back'}
              </h1>
              <p className="mt-3 text-sm text-neutral-400 light:text-neutral-600">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Link
                  to={isSignup ? '/login' : '/signup'}
                  className="text-amber-300 underline-offset-2 hover:underline light:text-amber-600"
                >
                  {isSignup ? 'Log in' : 'Sign up'}
                </Link>
              </p>

              {/* noValidate: we show our own inline errors instead of native browser bubbles */}
              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
                {isSignup && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          placeholder="First name"
                          autoComplete="given-name"
                          maxLength={NAME_MAX}
                          {...inputProps('firstName', 'First name')}
                        />
                        {renderError('firstName')}
                      </div>
                      <div>
                        <input
                          placeholder="Last name"
                          autoComplete="family-name"
                          maxLength={NAME_MAX}
                          {...inputProps('lastName', 'Last name')}
                        />
                        {renderError('lastName')}
                      </div>
                    </div>

                    <div>
                      <input
                        placeholder="Username"
                        autoComplete="username"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={USERNAME_MAX}
                        {...inputProps('username', 'Username')}
                      />
                      {renderError('username')}
                    </div>
                  </>
                )}

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    {...inputProps('email', 'Email')}
                  />
                  {renderError('email')}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isSignup ? 'Create a password' : 'Enter your password'}
                      autoComplete={isSignup ? 'new-password' : 'current-password'}
                      onKeyUp={trackCapsLock}
                      onKeyDown={trackCapsLock}
                      {...inputProps('password', 'Password', 'pr-11')}
                    />
                    {passwordToggle}
                  </div>
                  {capsLock && (
                    <p className="mt-1.5 text-xs text-amber-300 light:text-amber-700">Caps Lock is on.</p>
                  )}
                  {renderError('password')}
                  {isSignup && <StrengthMeter result={passwordResult} show={form.password.length > 0} />}
                </div>

                {isSignup && (
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        {...inputProps('confirmPassword', 'Confirm password', 'pr-11')}
                      />
                    </div>
                    {renderError('confirmPassword')}
                  </div>
                )}

                {isSignup && (
                  <div>
                    <label className="flex items-center gap-2 text-xs text-neutral-400 light:text-neutral-600">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => {
                          setAgreed(e.target.checked);
                          setTouched((t) => ({ ...t, terms: true }));
                        }}
                        aria-invalid={!!visibleError('terms')}
                        aria-describedby={visibleError('terms') ? 'auth-terms-error' : undefined}
                        className="h-4 w-4 accent-amber-300"
                      />
                      <span>
                        I agree to the{' '}
                        <a href="#" className="text-amber-300 hover:underline light:text-amber-600">
                          Terms &amp; Conditions
                        </a>
                      </span>
                    </label>
                    {renderError('terms')}
                  </div>
                )}

                {error && (
                  <p role="alert" className="text-sm text-red-400 light:text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-display text-sm font-medium tracking-wide text-black transition-colors hover:bg-amber-200 disabled:opacity-60 light:bg-neutral-900 light:text-white light:hover:bg-amber-600"
                >
                  {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
};

export default AuthPage;