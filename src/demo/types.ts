export type DemoLanguage = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it';

export type QuoteFieldType = 'text' | 'number' | 'select' | 'textarea';

export interface QuoteField {
  key: string;
  label: string;
  type: QuoteFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  unit?: string;
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export type MediaRole = 'hero' | 'gallery' | 'product' | 'service' | 'og' | 'logo' | 'background';

export interface MediaItem {
  src: string;
  alt: string;
  role?: MediaRole;
  /** Original page/profile this asset was sourced from (Instagram, Maps, ...) — for internal reference only. */
  sourceUrl?: string;
  focalPoint?: { x: number; y: number };
}

export interface BusinessMedia {
  hero?: MediaItem;
  ogImage?: MediaItem;
  gallery?: MediaItem[];
  background?: MediaItem[];
  video?: string;
}

// ---------------------------------------------------------------------------
// Offerings (products / services / consultations / bookings / ...)
// ---------------------------------------------------------------------------

export interface Offering {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price?: string | number;
  priceLabel?: string;
  badge?: string;
  category?: string;
  selectable: boolean;
  quantityEnabled?: boolean;
  quoteFields?: QuoteField[];
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export interface SocialLink {
  platform: string;
  url: string;
}

export interface OpeningHoursEntry {
  days: string;
  hours: string;
}

export interface BusinessContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  websiteOriginal?: string;
  address?: string;
  mapsUrl?: string;
  directionsUrl?: string;
  socialLinks?: SocialLink[];
  openingHours?: OpeningHoursEntry[];
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

export type ConversionMode = 'order' | 'quote' | 'booking' | 'contact' | 'consultation';
export type ConversionChannel = 'whatsapp' | 'email';

export interface ConversionConfig {
  mode: ConversionMode;
  allowEmptySelection: boolean;
  primaryChannel: ConversionChannel;
  fallbackChannel?: ConversionChannel;
  customMessageIntro?: string;
  visitorFields?: QuoteField[];
  globalQuoteFields?: QuoteField[];
  ctaLabel?: string;
  triggerLabel?: string;
}

// ---------------------------------------------------------------------------
// Visual
// ---------------------------------------------------------------------------

export type VisualProfileName =
  | 'editorial'
  | 'technical'
  | 'luxury'
  | 'clinical'
  | 'professional'
  | 'local-service'
  | 'transport'
  | 'retail'
  | 'hospitality';

export type HeroStyle =
  | 'full-bleed'
  | 'split'
  | 'cinematic'
  | 'masked'
  | 'layered'
  | 'video'
  | 'canvas'
  | 'product'
  | 'portfolio';

export type GalleryStyle =
  | 'masonry'
  | 'parallax'
  | 'horizontal'
  | 'stacked'
  | 'cinematic'
  | 'before-after'
  | 'pinned';

export type SectionKey =
  | 'hero'
  | 'trustStrip'
  | 'stats'
  | 'about'
  | 'offerings'
  | 'featuredOffering'
  | 'gallery'
  | 'beforeAfter'
  | 'process'
  | 'benefits'
  | 'faq'
  | 'reviews'
  | 'map'
  | 'openingHours'
  | 'finalCta'
  | 'footer';

export interface PaletteTokens {
  background: string;
  surface: string;
  ink: string;
  inkMuted: string;
  accent: string;
  accentInk: string;
  border: string;
}

export interface VisualConfig {
  visualProfile: VisualProfileName;
  palette?: Partial<PaletteTokens>;
  radiusProfile?: 'sharp' | 'soft' | 'pill';
  density?: 'compact' | 'comfortable' | 'spacious';
  sectionOrder?: SectionKey[];
  heroStyle?: HeroStyle;
  galleryStyle?: GalleryStyle;
  offeringStyle?: 'grid' | 'list' | 'cards';
  footerStyle?: 'full' | 'minimal';
}

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

export type MotionProfileName = 'calm' | 'energetic' | 'cinematic' | 'minimal';
export type ParallaxIntensity = 'none' | 'subtle' | 'medium' | 'strong';

export interface MotionConfig {
  motionProfile: MotionProfileName;
  heroMotion?: boolean;
  parallaxIntensity?: ParallaxIntensity;
  scrollStory?: boolean;
  cameraTransitions?: boolean;
  enableThree?: boolean;
  enableCanvas?: boolean;
  reducedMotionFallback?: boolean;
}

// ---------------------------------------------------------------------------
// Root config
// ---------------------------------------------------------------------------

export interface StatItem {
  label: string;
  value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ReviewItem {
  text: string;
  author?: string;
}

export interface OpenGraphConfig {
  title: string;
  description: string;
  image: string;
}

export interface BusinessDemoConfig {
  slug: string;
  companyName: string;
  legalName?: string;
  niche: string;
  locality: string;
  countryCode: string;
  locale: string;
  language: DemoLanguage;
  tagline: string;
  shortDescription?: string;
  logo?: MediaItem;
  favicon?: string;

  contact: BusinessContact;
  media: BusinessMedia;
  offerings: Offering[];
  conversion: ConversionConfig;
  visual: VisualConfig;
  motion: MotionConfig;

  socialProof?: string[];
  stats?: StatItem[];
  faq?: FaqItem[];
  process?: ProcessStep[];
  benefits?: string[];
  reviews?: ReviewItem[];

  sourceNote?: string;
  og: OpenGraphConfig;
}
