import { lazy, Suspense, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './hooks';

const ThreeEffect = lazy(() => import('./ThreeEffect'));

interface ThreeEffectLoaderProps {
  enabled: boolean;
  accentColor: string;
}

/**
 * Only this loader may reference the dynamic import above. `ThreeEffect.tsx`
 * (and therefore the entire three-vendor chunk) is fetched exclusively when
 * `enabled` is true, never eagerly, and never on mobile or reduced-motion.
 */
export function ThreeEffectLoader({ enabled, accentColor }: ThreeEffectLoaderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [isNarrowViewport, setIsNarrowViewport] = useState(true);

  useEffect(() => {
    const check = () => setIsNarrowViewport(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!enabled || reducedMotion || isNarrowViewport) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ThreeEffect accentColor={accentColor} />
    </Suspense>
  );
}
