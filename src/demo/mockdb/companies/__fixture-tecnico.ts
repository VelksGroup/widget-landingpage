import type { BusinessDemoConfig } from '../../types';

// TEMPORARY internal test fixture — fictitious data, removed before final commit.
// Proves: quote mode, quoteFields, email-only fallback, before/after gallery,
// local-service visual profile (distinct niche/profile pairing from AT VOLT's
// technical profile), and enableThree=true to verify the Three.js chunk loads
// only for this fixture.
const fixture: BusinessDemoConfig = {
  slug: 'zzz-fixture-tecnico',
  companyName: 'Canalizador Fictício',
  niche: 'canalizador-teste',
  locality: 'Braga, Portugal',
  countryCode: 'PT',
  locale: 'pt-PT',
  language: 'pt',
  tagline: 'Reparações rápidas, sem complicações.',
  shortDescription: 'Fixture de teste interno para validar quoteFields e fallback de email.',
  contact: {
    email: 'teste-tecnico@example.com',
  },
  media: {
    hero: { src: '/apple-touch-icon.png', alt: 'Canalizador Fictício' },
    ogImage: { src: '/apple-touch-icon.png', alt: 'Canalizador Fictício' },
    gallery: [
      { src: '/velks-logo.png', alt: 'Antes 1' },
      { src: '/apple-touch-icon.png', alt: 'Depois 1' },
      { src: '/favicon-512x512.png', alt: 'Antes 2' },
      { src: '/favicon-192x192.png', alt: 'Depois 2' },
    ],
  },
  offerings: [
    {
      id: 'reparacao-teste',
      title: 'Reparação de teste',
      description: 'Deteção e resolução de fugas.',
      selectable: true,
      quoteFields: [
        { key: 'problema', label: 'Descreva o problema', type: 'textarea', required: true },
        { key: 'urgencia', label: 'Urgência', type: 'select', required: true, options: ['Hoje', 'Esta semana'] },
      ],
    },
    {
      id: 'instalacao-teste',
      title: 'Instalação de teste',
      description: 'Substituição de canalização.',
      selectable: true,
      quoteFields: [{ key: 'divisao', label: 'Divisão', type: 'text', required: true }],
    },
  ],
  conversion: {
    mode: 'quote',
    allowEmptySelection: true,
    primaryChannel: 'email',
  },
  visual: {
    visualProfile: 'local-service',
    heroStyle: 'full-bleed',
    galleryStyle: 'before-after',
  },
  motion: {
    motionProfile: 'energetic',
    heroMotion: true,
    enableThree: true,
    reducedMotionFallback: true,
  },
  og: {
    title: 'Canalizador Fictício — Demonstração de teste',
    description: 'Fixture de teste interno, motor global de demos VELKS.',
    image: '/apple-touch-icon.png',
  },
};

export default fixture;
