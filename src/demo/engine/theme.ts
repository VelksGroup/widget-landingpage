import type { DemoAccent } from '../types';

export interface ResolvedTheme {
  background: string;
  surface: string;
  ink: string;
  inkMuted: string;
  accent: string;
  accentInk: string;
  border: string;
  radius: { sm: string; md: string; lg: string; pill: string };
}

const DEFAULT_ACCENT: Required<Omit<DemoAccent, 'radius'>> = {
  background: '#0b0d10',
  surface: '#14171b',
  ink: '#f5f6f7',
  inkMuted: 'rgba(245,246,247,0.62)',
  accent: '#ff6a3d',
  accentInk: '#0b0d10',
  border: 'rgba(245,246,247,0.12)',
};

const RADIUS_PRESETS: Record<NonNullable<DemoAccent['radius']>, ResolvedTheme['radius']> = {
  sharp: { sm: '0.15rem', md: '0.25rem', lg: '0.4rem', pill: '999px' },
  soft: { sm: '0.5rem', md: '0.9rem', lg: '1.3rem', pill: '999px' },
  pill: { sm: '0.75rem', md: '1.25rem', lg: '2rem', pill: '999px' },
};

/** The single universal template's theme: sensible defaults, overridden per-demo by `accent`. */
export function resolveTheme(accent: DemoAccent | undefined | null): ResolvedTheme {
  const merged = { ...DEFAULT_ACCENT, ...(accent ?? {}) };
  return {
    background: merged.background,
    surface: merged.surface,
    ink: merged.ink,
    inkMuted: merged.inkMuted,
    accent: merged.accent,
    accentInk: merged.accentInk,
    border: merged.border,
    radius: RADIUS_PRESETS[accent?.radius ?? 'soft'],
  };
}
