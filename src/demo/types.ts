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

export interface Offering {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price?: string | number;
  priceLabel?: string;
  badge?: string;
  selectable: boolean;
  quantityEnabled?: boolean;
  quoteFields?: QuoteField[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface OpeningHoursEntry {
  days: string;
  hours: string;
}

export interface DemoContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  mapsUrl?: string;
  directionsUrl?: string;
  socialLinks?: SocialLink[];
  openingHours?: OpeningHoursEntry[];
}

export type ConversionMode = 'order' | 'quote' | 'booking' | 'contact' | 'consultation';
export type ConversionChannel = 'whatsapp' | 'email' | 'phone';

export interface ConversionConfig {
  mode: ConversionMode;
  allowEmptySelection: boolean;
  primaryChannel: ConversionChannel;
  secondaryChannel?: ConversionChannel;
  customMessageIntro?: string;
  globalQuoteFields?: QuoteField[];
  ctaLabel?: string;
  triggerLabel?: string;
}

export interface DemoAccent {
  background?: string;
  surface?: string;
  ink?: string;
  inkMuted?: string;
  accent?: string;
  accentInk?: string;
  border?: string;
  radius?: 'sharp' | 'soft' | 'pill';
}

export interface DemoAsset {
  id: string;
  kind: 'logo' | 'hero' | 'gallery' | 'offering' | 'other';
  url: string;
  alt: string;
  sortOrder: number;
}

export interface DemoIdentity {
  companyName: string;
  legalName?: string;
  niche?: string;
  locality?: string;
  logo?: string;
  favicon?: string;
}

export interface DemoHighlight {
  icon?: string;
  title: string;
  description: string;
}

export interface DemoContent {
  tagline: string;
  shortDescription?: string;
  advantages?: string[];
  /** Icon+title+description differentiator cards (the Milano "porque escolher-nos" grid). */
  highlights?: DemoHighlight[];
  process?: { title: string; description: string }[];
  faq?: { question: string; answer: string }[];
}

export interface DemoProof {
  stats?: { label: string; value: string }[];
  reviews?: { text: string; author?: string }[];
  trustBadges?: string[];
}

export interface DemoOpenGraph {
  title: string;
  description: string;
  image: string;
}

/** The shape returned by the runtime API for a published demo. */
export interface DemoRecord {
  id: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  locale: string;
  language: DemoLanguage;
  identity: DemoIdentity;
  content: DemoContent;
  contact: DemoContact;
  offerings: Offering[];
  conversion: ConversionConfig;
  proof: DemoProof;
  accent: DemoAccent;
  og: DemoOpenGraph;
  assets: DemoAsset[];
  enableThree?: boolean;
}
