import type { BusinessDemoConfig } from '../../types';

// TEMPORARY internal test fixture — fictitious data, removed before final commit.
// Proves: transport visual profile, quoteFields for origin/destination/date/volume,
// horizontal gallery, and stats section.
const fixture: BusinessDemoConfig = {
  slug: 'zzz-fixture-transportadora',
  companyName: 'Transportes Fictícios',
  niche: 'transportadora-teste',
  locality: 'Setúbal, Portugal',
  countryCode: 'PT',
  locale: 'pt-PT',
  language: 'pt',
  tagline: 'Mudanças e transportes sem stress.',
  contact: {
    email: 'teste-transportes@example.com',
  },
  media: {
    hero: { src: '/velks-logo.png', alt: 'Transportes Fictícios' },
    ogImage: { src: '/velks-logo.png', alt: 'Transportes Fictícios' },
    gallery: [
      { src: '/velks-logo.png', alt: 'Frota de teste 1' },
      { src: '/apple-touch-icon.png', alt: 'Frota de teste 2' },
      { src: '/favicon-512x512.png', alt: 'Frota de teste 3' },
    ],
  },
  offerings: [
    {
      id: 'mudanca-local-teste',
      title: 'Mudança local de teste',
      selectable: true,
      quoteFields: [
        { key: 'origem', label: 'Origem', type: 'text', required: true },
        { key: 'destino', label: 'Destino', type: 'text', required: true },
        { key: 'data', label: 'Data pretendida', type: 'text', required: true },
        { key: 'volume', label: 'Volume aproximado', type: 'select', required: true, options: ['Pequeno', 'Médio', 'Grande'] },
      ],
    },
    {
      id: 'transporte-nacional-teste',
      title: 'Transporte nacional de teste',
      selectable: true,
      quoteFields: [
        { key: 'origem', label: 'Origem', type: 'text', required: true },
        { key: 'destino', label: 'Destino', type: 'text', required: true },
      ],
    },
  ],
  conversion: {
    mode: 'quote',
    allowEmptySelection: true,
    primaryChannel: 'email',
  },
  visual: {
    visualProfile: 'transport',
    heroStyle: 'full-bleed',
    galleryStyle: 'horizontal',
  },
  motion: {
    motionProfile: 'energetic',
    heroMotion: true,
    enableThree: false,
    reducedMotionFallback: true,
  },
  stats: [
    { label: 'Entregas de teste', value: '1.2K' },
    { label: 'Cidades de teste', value: '18' },
  ],
  og: {
    title: 'Transportes Fictícios — Demonstração de teste',
    description: 'Fixture de teste interno, motor global de demos VELKS.',
    image: '/velks-logo.png',
  },
};

export default fixture;
