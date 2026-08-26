import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Small schematic line drawing that "energizes" once on load: the trace draws
 * itself in, then the end node glows amber. Purely decorative, lightweight
 * (plain SVG + GSAP, no WebGL), and skipped entirely under reduced motion.
 */
export function HeroSchematic({ className }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const nodeRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const path = pathRef.current;
    const node = nodeRef.current;
    const glow = glowRef.current;
    if (!path || !node || !glow) return;

    if (prefersReducedMotion) {
      gsap.set(glow, { opacity: 0.7, scale: 1 });
      return;
    }

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(glow, { opacity: 0, scale: 0.6, transformOrigin: 'center' });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(path, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }).to(
      glow,
      { opacity: 0.8, scale: 1, duration: 0.5, ease: 'power1.out' },
      '-=0.15',
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <svg viewBox="0 0 420 260" fill="none" className={className} aria-hidden="true">
      <path
        ref={pathRef}
        d="M20 220 H150 V150 H260 V80 H400"
        stroke="rgba(234,242,248,0.55)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="20" cy="220" r="5" fill="rgba(234,242,248,0.6)" />
      <circle cx="150" cy="150" r="5" fill="rgba(234,242,248,0.6)" />
      <circle cx="260" cy="80" r="5" fill="#e8a33d" />
      <circle ref={nodeRef} cx="400" cy="80" r="6" fill="#e8a33d" />
      <circle ref={glowRef} cx="400" cy="80" r="20" fill="#e8a33d" opacity="0.3" style={{ filter: 'blur(6px)' }} />
    </svg>
  );
}
