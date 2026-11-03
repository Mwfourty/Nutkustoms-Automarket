import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';

// Order of the main tabs; used to decide which way pages slide
const ROUTE_ORDER = ['/', '/sell', '/garage', '/messages', '/profile', '/login', '/signup'];

const routeIndex = (path: string) => {
  const i = ROUTE_ORDER.findIndex((r) =>
    r === '/' ? path === '/' : path === r || path.startsWith(`${r}/`)
  );
  return i === -1 ? 0 : i;
};

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

const variants: Variants = {
  enter: (dir: number) => ({ x: `${dir * 100}%` }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: `${dir * -25}%` }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageTransition = () => {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  const [prev, setPrev] = useState(pathname);
  const [direction, setDirection] = useState(1);
  if (prev !== pathname) {
    setDirection(routeIndex(pathname) >= routeIndex(prev) ? 1 : -1);
    setPrev(pathname);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-x-clip">
      {/* popLayout keeps the old page on screen while the new one slides in, so there is no empty gap */}
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={reduce ? fadeVariants : variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: EASE }}
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
