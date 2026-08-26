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

export interface DemoService {
  id: string;
  title: string;
  description: string;
  image?: string;
  quoteFields: QuoteField[];
}

export interface DemoContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export interface DemoOpenGraph {
  title: string;
  description: string;
  image: string;
}

export interface DemoCompanyConfig {
  slug: string;
  companyName: string;
  locality: string;
  niche: string;
  headline: string;
  subheadline: string;
  description?: string;
  logo?: string;
  heroImage: string;
  galleryImages: string[];
  locale: string;
  countryCode: string;
  language: DemoLanguage;
  contact: DemoContact;
  services: DemoService[];
  socialProof?: string[];
  sourceNote?: string;
  og: DemoOpenGraph;
}
