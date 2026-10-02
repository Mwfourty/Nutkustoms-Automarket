import { ArrowRight, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BorderGlow from '../components/effects/BorderGlow';
import SideRays from '../components/effects/SideRays';
import logoDark from '../assets/ntkstms-logo-og-removebg-preview.png';
import logoLight from '../assets/ntkstms-logo-og-light-mode.png';
import { useTheme } from '../context/ThemeContext';
import { login, register } from '../services/authApi';

type Mode = 'login' | 'signup';

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-amber-300/60 focus:bg-white/8 light:border-black/10 light:bg-black/5 light:text-neutral-900 light:focus:border-amber-600/60';

const AuthPage = ({ mode }: { mode: Mode }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignup && form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await register(form);
        navigate('/login');
      } else {
        const result = await login({ email: form.email, password: form.password });
        localStorage.setItem('token', result.token);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

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

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              {isSignup && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="First name"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={set('firstName')}
                      className={inputClass}
                    />
                    <input
                      required
                      placeholder="Last name"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={set('lastName')}
                      className={inputClass}
                    />
                  </div>
                  <input
                    required
                    placeholder="Username"
                    autoComplete="username"
                    value={form.username}
                    onChange={set('username')}
                    className={inputClass}
                  />
                </>
              )}

              <input
                required
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                className={inputClass}
              />

              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  minLength={isSignup ? 8 : undefined}
                  value={form.password}
                  onChange={set('password')}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-200 light:hover:text-neutral-900"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {isSignup && (
                <label className="flex items-center gap-2 text-xs text-neutral-400 light:text-neutral-600">
                  <input
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 accent-amber-300"
                  />
                  I agree to the{' '}
                  <a href="#" className="text-amber-300 hover:underline light:text-amber-600">
                    Terms &amp; Conditions
                  </a>
                </label>
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
