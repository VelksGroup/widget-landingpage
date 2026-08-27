import type { PaletteTokens, VisualProfileName } from '../types';

export interface VisualProfileTokens {
  palette: PaletteTokens;
  /** Google Fonts family name for headings, or null to reuse the globally-loaded Inter. */
  displayFont: string | null;
  displayFontWeight: number;
  bodyFont: string;
  labelFont: 'sans' | 'mono';
  radius: { sm: string; md: string; lg: string; pill: string };
  spacingScale: number;
  cardStyle: 'flat' | 'bordered' | 'elevated';
}

export const VISUAL_PROFILES: Record<VisualProfileName, VisualProfileTokens> = {
  editorial: {
    palette: {
      background: '#1a1512',
      surface: '#241d18',
      ink: '#f3ead9',
      inkMuted: 'rgba(243,234,217,0.62)',
      accent: '#c9a227',
      accentInk: '#1a1512',
      border: 'rgba(243,234,217,0.12)',
    },
    displayFont: 'Fraunces',
    displayFontWeight: 600,
    bodyFont: 'Inter',
    labelFont: 'sans',
    radius: { sm: '0.4rem', md: '0.75rem', lg: '1.25rem', pill: '999px' },
    spacingScale: 1,
    cardStyle: 'elevated',
  },
  technical: {
    palette: {
      background: '#0b1d2e',
      surface: '#091725',
      ink: '#eaf2f8',
      inkMuted: 'rgba(234,242,248,0.62)',
      accent: '#e8a33d',
      accentInk: '#0b1d2e',
      border: 'rgba(234,242,248,0.12)',
    },
    displayFont: null,
    displayFontWeight: 900,
    bodyFont: 'Inter',
    labelFont: 'mono',
    radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', pill: '999px' },
    spacingScale: 1,
    cardStyle: 'bordered',
  },
  luxury: {
    palette: {
      background: '#160d10',
      surface: '#1f1316',
      ink: '#f5ede4',
      inkMuted: 'rgba(245,237,228,0.6)',
      accent: '#d9a9a0',
      accentInk: '#160d10',
      border: 'rgba(245,237,228,0.14)',
    },
    displayFont: 'Cormorant',
    displayFontWeight: 600,
    bodyFont: 'Inter',
    labelFont: 'sans',
    radius: { sm: '0.2rem', md: '0.3rem', lg: '0.4rem', pill: '999px' },
    spacingScale: 1.2,
    cardStyle: 'flat',
  },
  clinical: {
    palette: {
      background: '#f7fafb',
      surface: '#ffffff',
      ink: '#1b2733',
      inkMuted: 'rgba(27,39,51,0.6)',
      accent: '#2e8b8b',
      accentInk: '#ffffff',
      border: 'rgba(27,39,51,0.1)',
    },
    displayFont: null,
    displayFontWeight: 800,
    bodyFont: 'Inter',
    labelFont: 'sans',
    radius: { sm: '0.5rem', md: '0.9rem', lg: '1.4rem', pill: '999px' },
    spacingScale: 1.1,
    cardStyle: 'elevated',
  },
  professional: {
    palette: {
      background: '#141a21',
      surface: '#1b232c',
      ink: '#e8ecef',
      inkMuted: 'rgba(232,236,239,0.6)',
      accent: '#b08d57',
      accentInk: '#141a21',
      border: 'rgba(232,236,239,0.12)',
    },
    displayFont: 'Cormorant',
    displayFontWeight: 600,
    bodyFont: 'Inter',
    labelFont: 'sans',
    radius: { sm: '0.15rem', md: '0.2rem', lg: '0.3rem', pill: '999px' },
    spacingScale: 1.1,
    cardStyle: 'bordered',
  },
  'local-service': {
    palette: {
      background: '#fafaf8',
      surface: '#ffffff',
      ink: '#20242a',
      inkMuted: 'rgba(32,36,42,0.62)',
      accent: '#2461e8',
      accentInk: '#ffffff',
      border: 'rgba(32,36,42,0.1)',
    },
    displayFont: null,
    displayFontWeight: 800,
    bodyFont: 'Inter',
    labelFont: 'sans',
    radius: { sm: '0.5rem', md: '0.9rem', lg: '1.2rem', pill: '999px' },
    spacingScale: 0.95,
    cardStyle: 'elevated',
  },
  transport: {
    palette: {
      background: '#15171c',
      surface: '#1d2027',
      ink: '#f4f6f8',
      inkMuted: 'rgba(244,246,248,0.6)',
      accent: '#3fc1c9',
      accentInk: '#0e1216',
      border: 'rgba(244,246,248,0.12)',
    },
    displayFont: 'Archivo',
    displayFontWeight: 800,
    bodyFont: 'Inter',
    labelFont: 'mono',
    radius: { sm: '0.2rem', md: '0.35rem', lg: '0.5rem', pill: '999px' },
    spacingScale: 1,
    cardStyle: 'bordered',
  },
  retail: {
    palette: {
      background: '#ffffff',
      surface: '#f7f7f5',
      ink: '#17181a',
      inkMuted: 'rgba(23,24,26,0.62)',
      accent: '#e8465a',
      accentInk: '#ffffff',
      border: 'rgba(23,24,26,0.1)',
    },
    displayFont: null,
    displayFontWeight: 900,
    bodyFont: 'Inter',
    labelFont: 'sans',
    radius: { sm: '0.3rem', md: '0.5rem', lg: '0.7rem', pill: '999px' },
    spacingScale: 0.95,
    cardStyle: 'flat',
  },
  hospitality: {
    palette: {
      background: '#0e2626',
      surface: '#123030',
      ink: '#f2ead8',
      inkMuted: 'rgba(242,234,216,0.62)',
      accent: '#e08e5b',
      accentInk: '#0e2626',
      border: 'rgba(242,234,216,0.14)',
    },
    displayFont: 'Fraunces',
    displayFontWeight: 500,
    bodyFont: 'Inter',
    labelFont: 'sans',
    radius: { sm: '0.4rem', md: '0.8rem', lg: '1.4rem', pill: '999px' },
    spacingScale: 1.15,
    cardStyle: 'elevated',
  },
};

export function getVisualProfile(name: VisualProfileName): VisualProfileTokens {
  return VISUAL_PROFILES[name] ?? VISUAL_PROFILES.professional;
}

/** Distinct Google Fonts families referenced above, for scoped per-demo <link> loading. */
export const PROFILE_GOOGLE_FONTS: Record<string, string> = {
  Fraunces: 'Fraunces:wght@500;600;700',
  Cormorant: 'Cormorant:wght@500;600;700',
  Archivo: 'Archivo:wght@700;800;900',
};
