import type { ReactNode } from 'react';
import BorderGlow from '../effects/BorderGlow';
import { useTheme } from '../../context/ThemeContext';

/**
 * The glowing card shell shared by ListingCard and GarageCard.
 * Keeping the BorderGlow settings in one place stops the two from drifting apart.
 */
const GlowCard = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <BorderGlow
      backgroundColor={isLight ? '#ffffff' : '#0a0a0a'}
      surfaceColor={isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.03)'}
      borderRadius={12}
      glowRadius={28}
      glowColor="45 90% 75%"
      glowIntensity={0.9}
      edgeSensitivity={35}
      coneSpread={22}
      colors={isLight ? ['#fbbf24', '#f59e0b', '#fde68a'] : ['#ffffff', '#fbbf24', '#fff7ed']}
      className={`h-full w-full cursor-pointer transition-transform duration-300 hover:scale-99 ${className}`}
    >
      {children}
    </BorderGlow>
  );
};

export default GlowCard;