import type { BusinessDemoConfig } from '../../types';

// TEMPORARY internal test fixture — fictitious data, removed before final commit.
// Proves: booking mode, offerings without mandatory price, clinical visual
// profile, FAQ, reviews, and benefits sections.
const fixture: BusinessDemoConfig = {
  slug: 'zzz-fixture-clinica',
  companyName: 'Clínica Fictícia',
  niche: 'clinica-teste',
  locality: 'Lisboa, Portugal',
  countryCode: 'PT',
  locale: 'pt-PT',
  language: 'pt',
  tagline: 'Cuidado próximo, resposta rápida.',
  shortDescription: 'Fixture de teste interno para validar booking/contact sem preço obrigatório.',
  contact: {
    whatsapp: '+351920000000',
    address: 'Avenida Fictícia 45, Lisboa',
    mapsUrl: 'https://maps.google.com/?q=Lisboa',
  },
  media: {
    hero: { src: '/favicon-512x512.png', alt: 'Clínica Fictícia' },
    ogImage: { src: '/favicon-512x512.png', alt: 'Clínica Fictícia' },
    gallery: [
      { src: '/velks-logo.png', alt: 'Espaço de teste 1' },
      { src: '/apple-touch-icon.png', alt: 'Espaço de teste 2' },
    ],
  },
  offerings: [
    { id: 'consulta-teste', title: 'Consulta de teste', description: 'Avaliação geral.', selectable: true },
    { id: 'checkup-teste', title: 'Check-up de teste', description: 'Avaliação completa.', selectable: true },
  ],
  conversion: {
    mode: 'booking',
    allowEmptySelection: true,
    primaryChannel: 'whatsapp',
    globalQuoteFields: [{ key: 'melhorHorario', label: 'Melhor horário para contacto', type: 'text', required: false }],
  },
  visual: {
    visualProfile: 'clinical',
    heroStyle: 'masked',
    galleryStyle: 'masonry',
  },
  motion: {
    motionProfile: 'minimal',
    heroMotion: true,
    enableThree: false,
    reducedMotionFallback: true,
  },
  benefits: ['Atendimento próximo (teste)', 'Resposta rápida (teste)', 'Equipa dedicada (teste)'],
  faq: [
    { question: 'Pergunta de teste 1?', answer: 'Resposta de teste 1.' },
    { question: 'Pergunta de teste 2?', answer: 'Resposta de teste 2.' },
  ],
  reviews: [
    { text: 'Depoimento de teste um.', author: 'Utente de teste' },
    { text: 'Depoimento de teste dois.', author: 'Utente de teste' },
  ],
  og: {
    title: 'Clínica Fictícia — Demonstração de teste',
    description: 'Fixture de teste interno, motor global de demos VELKS.',
    image: '/favicon-512x512.png',
  },
};

export default fixture;
