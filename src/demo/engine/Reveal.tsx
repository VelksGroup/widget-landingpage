import type { ReactNode } from 'react';
import { useInView, usePrefersReducedMotion } from './hooks';
import { cn } from '../../lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delayMs?: number;
  y?: number;
  as?: 'div' | 'section';
}

/**
 * Generic scroll-reveal wrapper shared by every section, so motion stays
 * consistent across the whole engine instead of bespoke GSAP per component.
 * Always resolves to a fully-visible, static state under reduced motion.
 */
export function Reveal({ children, className, style, delayMs = 0, y = 24, as = 'div' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const reducedMotion = usePrefersReducedMotion();
  const Tag = as;

  const visible = inView || reducedMotion;

  return (
    <Tag
      ref={ref as any}
      className={cn('transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none', className)}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transitionDelay: visible ? `${delayMs}ms` : '0ms',
      }}
    >
      {children}
    </Tag>
  );
}
