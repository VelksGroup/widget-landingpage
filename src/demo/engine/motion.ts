import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from './hooks';

gsap.registerPlugin(ScrollTrigger);

/** Hero entrance stagger (badge/logo → headline → copy → CTAs) — mirrors the reference's storytelling section. */
export function useHeroEntrance(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-anim',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.15 },
      );
    }, containerRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
}

/** Very soft parallax + slow zoom-out on the hero image as the user starts scrolling — a controlled "camera pull-back", not a bounce. */
export function useHeroParallax(sectionRef: RefObject<HTMLElement | null>, imageRef: RefObject<HTMLElement | null>) {
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current || !imageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.12, yPercent: -4 },
        {
          scale: 1,
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
}

/** Shared scroll-triggered stagger for grids (trust strip, highlight cards, offerings, gallery). One motion language everywhere instead of bespoke tweens per section. */
export function useStaggerReveal(containerRef: RefObject<HTMLElement | null>, selector: string) {
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, selector]);
}

/** Section entering with a slight rise + clip-path reveal — used for the heavier institutional/CTA transitions ("camera-like" block change). */
export function useClipReveal(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { clipPath: 'inset(8% 0% 8% 0% round 12px)', opacity: 0.4 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
}
