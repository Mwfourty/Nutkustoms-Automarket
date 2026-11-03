import { useLocation } from 'react-router-dom';
import LightRays from '../components/effects/LightRays';
import Navbar from '../components/store/Navbar';
import { useTheme } from '../context/ThemeContext';
import PageTransition from './PageTransition';

// Background and navbar live here so only the page content slides during navigation.
const AppLayout = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  // Below lg the messages page is exactly one screen tall and its panels fill what the navbar leaves.
  const isMessages = pathname.startsWith('/messages');

  return (
    <div className="relative min-h-dvh bg-black transition-colors light:bg-[#f7f5f0]">
      <div className="pointer-events-none fixed inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fff3c4"
          raysSpeed={0.6}
          lightSpread={0.7}
          rayLength={1.8}
          followMouse
          mouseInfluence={0.08}
          fadeDistance={1.1}
          saturation={0.9}
          lightMode={theme === 'light'}
        />
      </div>

      {/* pb-24 clears the fixed mobile tab bar */}
      <div
        className={`relative z-10 flex flex-col ${
          isMessages ? 'h-dvh lg:h-auto lg:min-h-dvh' : 'min-h-dvh pb-24 md:pb-0'
        }`}
      >
        <Navbar />
        <PageTransition />
      </div>
    </div>
  );
};

export default AppLayout;
