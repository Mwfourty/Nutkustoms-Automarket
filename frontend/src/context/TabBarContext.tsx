import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type TabBarCtx = { hidden: boolean; setHidden: (h: boolean) => void };

const TabBarContext = createContext<TabBarCtx>({ hidden: false, setHidden: () => {} });

export const TabBarProvider = ({ children }: { children: ReactNode }) => {
  const [hidden, setHidden] = useState(false);
  return <TabBarContext.Provider value={{ hidden, setHidden }}>{children}</TabBarContext.Provider>;
};

export const useTabBar = () => useContext(TabBarContext);

/** Call from any screen that needs the full height. Restores the bar on unmount. */
export const useHideTabBar = (when = true) => {
  const { setHidden } = useTabBar();
  useEffect(() => {
    setHidden(when);
    return () => setHidden(false);
  }, [when, setHidden]);
};