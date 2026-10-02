import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'automarket-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
