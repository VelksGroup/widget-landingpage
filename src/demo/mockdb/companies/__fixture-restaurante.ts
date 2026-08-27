import type { BusinessDemoConfig } from '../../types';

// TEMPORARY internal test fixture — fictitious data, removed before final commit.
// Proves: order mode, cart, quantity, prices, featured offering, gallery, opening hours, map, WhatsApp.
const fixture: BusinessDemoConfig = {
  slug: 'zzz-fixture-restaurante',
  companyName: 'Trattoria Fictícia',
  niche: 'restaurante-teste',
  locality: 'Porto, Portugal',
  countryCode: 'PT',
  locale: 'pt-PT',
  language: 'pt',
  tagline: 'Massas frescas, feitas todos os dias.',
  shortDescription: 'Restaurante de teste interno para validar o motor global de demos.',
  contact: {
    whatsapp: '+351910000000',
    address: 'Rua Fictícia 123, Porto',
    mapsUrl: 'https://maps.google.com/?q=Porto',
    directionsUrl: 'https://maps.google.com/?q=Porto&dirflg=d',
    openingHours: [
      { days: 'Seg-Sex', hours: '12:00-15:00, 19:00-23:00' },
      { days: 'Sáb-Dom', hours: '12:00-23:00' },
    ],
  },
  media: {
    hero: { src: '/velks-logo.png', alt: 'Trattoria Fictícia' },
    ogImage: { src: '/velks-logo.png', alt: 'Trattoria Fictícia' },
    gallery: [
      { src: '/velks-logo.png', alt: 'Prato de teste 1' },
      { src: '/apple-touch-icon.png', alt: 'Prato de teste 2' },
      { src: '/favicon-512x512.png', alt: 'Prato de teste 3' },
    ],
  },
  offerings: [
    { id: 'pizza-teste', title: 'Pizza de teste', description: 'Massa fina, forno a lenha.', image: '/velks-logo.png', price: 12, priceLabel: '12€', category: 'featured', selectable: true, quantityEnabled: true },
    { id: 'massa-teste', title: 'Massa fresca de teste', description: 'Feita diariamente na casa.', price: 14, priceLabel: '14€', selectable: true, quantityEnabled: true },
    { id: 'sobremesa-teste', title: 'Sobremesa de teste', description: 'Tiramisù da casa.', price: 6, priceLabel: '6€', selectable: true, quantityEnabled: true },
  ],
  conversion: {
    mode: 'order',
    allowEmptySelection: false,
    primaryChannel: 'whatsapp',
    ctaLabel: 'Ver ementa',
    triggerLabel: 'Ver pedido',
  },
  visual: {
    visualProfile: 'editorial',
    heroStyle: 'split',
    galleryStyle: 'masonry',
    offeringStyle: 'cards',
  },
  motion: {
    motionProfile: 'calm',
    heroMotion: true,
    parallaxIntensity: 'subtle',
    enableThree: false,
    reducedMotionFallback: true,
  },
  og: {
    title: 'Trattoria Fictícia — Demonstração de teste',
    description: 'Fixture de teste interno, motor global de demos VELKS.',
    image: '/velks-logo.png',
  },
};

export default fixture;
