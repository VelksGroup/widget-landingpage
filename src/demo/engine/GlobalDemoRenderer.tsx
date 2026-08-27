import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import type { BusinessDemoConfig, Offering, SectionKey } from '../types';
import type { SelectedOffering } from '../utils';
import { resolveAbsoluteUrl } from '../utils';
import { getVisualProfile, PROFILE_GOOGLE_FONTS } from './visualProfiles';
import { ConversionCenter, FloatingTrigger } from './ConversionCenter';
import { HeroSection } from './sections/HeroSection';
import { OfferingsSection, FeaturedOfferingSection } from './sections/OfferingsSection';
import { GallerySection } from './sections/GallerySection';
import {
  TrustStripSection,
  StatsSection,
  AboutSection,
  ProcessSection,
  BenefitsSection,
  FaqSection,
  ReviewsSection,
  MapSection,
  OpeningHoursSection,
  FinalCtaSection,
} from './sections/InfoSections';
import { FooterSection } from './sections/FooterSection';

const SITE_URL = 'https://www.velks.space';

const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'hero',
  'trustStrip',
  'stats',
  'about',
  'offerings',
  'featuredOffering',
  'gallery',
  'process',
  'benefits',
  'faq',
  'reviews',
  'map',
  'openingHours',
  'finalCta',
  'footer',
];

export function GlobalDemoRenderer({ config }: { config: BusinessDemoConfig }) {
  const tokens = useMemo(() => getVisualProfile(config.visual.visualProfile), [config.visual.visualProfile]);
  const [selection, setSelection] = useState<SelectedOffering[]>([]);
  const [isConversionOpen, setIsConversionOpen] = useState(false);

  const canonical = `${SITE_URL}/demo/${config.slug}`;
  const ogImage = resolveAbsoluteUrl(SITE_URL, config.og.image);
  const ogLocale = config.locale.replace('-', '_');
  const fontFamily = tokens.displayFont ? PROFILE_GOOGLE_FONTS[tokens.displayFont] : null;

  function handleAdd(offering: Offering) {
    setSelection((prev) => {
      if (prev.some((item) => item.offering.id === offering.id)) return prev;
      return [...prev, { offering, quantity: 1, fieldValues: {} }];
    });
    setIsConversionOpen(true);
  }

  function handleRemove(offeringId: string) {
    setSelection((prev) => prev.filter((item) => item.offering.id !== offeringId));
  }

  function handleUpdateQuantity(offeringId: string, quantity: number) {
    setSelection((prev) => prev.map((item) => (item.offering.id === offeringId ? { ...item, quantity } : item)));
  }

  function handleUpdateFieldValue(offeringId: string, fieldKey: string, value: string) {
    setSelection((prev) =>
      prev.map((item) =>
        item.offering.id === offeringId
          ? { ...item, fieldValues: { ...item.fieldValues, [fieldKey]: value } }
          : item,
      ),
    );
  }

  const selectedIds = useMemo(() => new Set(selection.map((item) => item.offering.id)), [selection]);
  const order = config.visual.sectionOrder ?? DEFAULT_SECTION_ORDER;

  const sectionMap: Partial<Record<SectionKey, React.ReactNode>> = {
    hero: <HeroSection key="hero" config={config} tokens={tokens} onPrimaryCta={() => setIsConversionOpen(true)} />,
    trustStrip: <TrustStripSection key="trustStrip" config={config} tokens={tokens} />,
    stats: <StatsSection key="stats" config={config} tokens={tokens} />,
    about: <AboutSection key="about" config={config} tokens={tokens} />,
    offerings: <OfferingsSection key="offerings" config={config} tokens={tokens} selectedIds={selectedIds} onAdd={handleAdd} />,
    featuredOffering: <FeaturedOfferingSection key="featuredOffering" config={config} tokens={tokens} selectedIds={selectedIds} onAdd={handleAdd} />,
    gallery: <GallerySection key="gallery" config={config} tokens={tokens} />,
    process: <ProcessSection key="process" config={config} tokens={tokens} />,
    benefits: <BenefitsSection key="benefits" config={config} tokens={tokens} />,
    faq: <FaqSection key="faq" config={config} tokens={tokens} />,
    reviews: <ReviewsSection key="reviews" config={config} tokens={tokens} />,
    map: <MapSection key="map" config={config} tokens={tokens} />,
    openingHours: <OpeningHoursSection key="openingHours" config={config} tokens={tokens} />,
    finalCta: <FinalCtaSection key="finalCta" config={config} tokens={tokens} onPrimaryCta={() => setIsConversionOpen(true)} />,
    footer: <FooterSection key="footer" config={config} tokens={tokens} />,
  };

  return (
    <div style={{ backgroundColor: tokens.palette.background, color: tokens.palette.ink }}>
      <Helmet>
        <title>{config.og.title}</title>
        <meta name="description" content={config.og.description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={config.og.title} />
        <meta property="og:description" content={config.og.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonical} />
        <meta property="og:locale" content={ogLocale} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={config.og.title} />
        <meta property="twitter:description" content={config.og.description} />
        <meta property="twitter:image" content={ogImage} />

        {config.favicon && <link rel="icon" href={config.favicon} />}
        {/* JetBrains Mono is already loaded globally by index.html — reused here, no extra request. */}
        {fontFamily && (
          <link href={`https://fonts.googleapis.com/css2?family=${fontFamily}&display=swap`} rel="stylesheet" />
        )}
      </Helmet>

      {order.map((key) => sectionMap[key] ?? null)}

      <FloatingTrigger config={config} tokens={tokens} count={selection.length} onClick={() => setIsConversionOpen(true)} />

      <ConversionCenter
        config={config}
        tokens={tokens}
        isOpen={isConversionOpen}
        onClose={() => setIsConversionOpen(false)}
        selection={selection}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateFieldValue={handleUpdateFieldValue}
        onRemove={handleRemove}
      />
    </div>
  );
}
