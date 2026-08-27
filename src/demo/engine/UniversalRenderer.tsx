import { useMemo, useRef, useState, type ElementType } from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, ChevronDown, Clock, Flame, Heart, Leaf, MapPin, Plus, Shield, ShoppingBag, Star, Users, Zap } from 'lucide-react';
import type { DemoRecord, Offering } from '../types';
import type { SelectedOffering } from '../utils';
import { resolveAbsoluteUrl, formatOfferingPrice } from '../utils';
import { logDemoEvent } from '../fetchDemo';
import { resolveTheme } from './theme';
import { getDemoStrings } from '../i18n';
import { ConversionCenter, FloatingTrigger } from './ConversionCenter';
import { Reveal } from './Reveal';
import { ThreeEffectLoader } from './ThreeEffectLoader';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { useHeroEntrance, useHeroParallax, useStaggerReveal } from './motion';

const SITE_URL = 'https://www.velks.space';

const HIGHLIGHT_ICONS: Record<string, ElementType> = {
  Star, Shield, Clock, Users, Flame, Heart, Leaf, Zap, Award, MapPin, ShoppingBag,
};
const TRUST_ICONS = [Star, Users, Clock, Shield];

function assetsOfKind(demo: DemoRecord, kind: string) {
  return demo.assets.filter((a) => a.kind === kind).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function UniversalRenderer({ demo }: { demo: DemoRecord }) {
  const theme = useMemo(() => resolveTheme(demo.accent), [demo.accent]);
  const strings = getDemoStrings(demo.language);
  const [selection, setSelection] = useState<SelectedOffering[]>([]);
  const [isConversionOpen, setIsConversionOpen] = useState(false);

  const heroSectionRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const offeringsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useHeroEntrance(heroContentRef);
  useHeroParallax(heroSectionRef, heroImageRef);
  useStaggerReveal(trustRef, '.trust-card');
  useStaggerReveal(highlightsRef, '.highlight-card');
  useStaggerReveal(offeringsRef, '.offering-card');
  useStaggerReveal(galleryRef, '.gallery-tile');

  const heroAsset = assetsOfKind(demo, 'hero')[0];
  const galleryAssets = assetsOfKind(demo, 'gallery');
  const logoAsset = assetsOfKind(demo, 'logo')[0];
  const logoSrc = logoAsset?.url ?? demo.identity.logo;

  const canonical = `${SITE_URL}/demo/${demo.slug}`;
  const ogImage = resolveAbsoluteUrl(SITE_URL, demo.og.image);
  const ogLocale = demo.locale.replace('-', '_');

  const hasTrust = (demo.proof.trustBadges ?? []).length > 0 || (demo.proof.stats ?? []).length > 0;
  const hasHighlights = (demo.content.highlights ?? []).length > 0;
  const hasOfferings = demo.offerings.length > 0;
  const hasGallery = galleryAssets.length > 0;
  const hasProcess = (demo.content.process ?? []).length > 0;
  const hasFaq = (demo.content.faq ?? []).length > 0;
  const hasReviews = (demo.proof.reviews ?? []).length > 0;

  const navLinks = useMemo(() => {
    const links: { id: string; label: string }[] = [];
    if (hasTrust || hasHighlights) links.push({ id: 'sobre', label: 'Sobre' });
    if (hasProcess) links.push({ id: 'como-funciona', label: strings.processTitle });
    if (hasOfferings) links.push({ id: 'ofertas', label: strings.services });
    if (hasGallery) links.push({ id: 'galeria', label: strings.work });
    links.push({ id: 'contacto', label: 'Contactos' });
    return links;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTrust, hasHighlights, hasProcess, hasOfferings, hasGallery]);

  function handleAdd(offering: Offering) {
    setSelection((prev) => {
      if (prev.some((item) => item.offering.id === offering.id)) return prev;
      return [...prev, { offering, quantity: 1, fieldValues: {} }];
    });
    setIsConversionOpen(true);
    logDemoEvent(demo.id, 'offering_select', { offeringId: offering.id });
  }

  function openConversionCenter() {
    setIsConversionOpen(true);
    logDemoEvent(demo.id, 'conversion_open');
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
        item.offering.id === offeringId ? { ...item, fieldValues: { ...item.fieldValues, [fieldKey]: value } } : item,
      ),
    );
  }

  const selectedIds = useMemo(() => new Set(selection.map((item) => item.offering.id)), [selection]);

  return (
    <div id="topo" style={{ backgroundColor: theme.background, color: theme.ink }} className="min-h-screen overflow-x-hidden">
      <Helmet>
        <title>{demo.og.title}</title>
        <meta name="description" content={demo.og.description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={demo.og.title} />
        <meta property="og:description" content={demo.og.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonical} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={demo.og.title} />
        <meta property="twitter:description" content={demo.og.description} />
        <meta property="twitter:image" content={ogImage} />
        {demo.identity.favicon && <link rel="icon" href={demo.identity.favicon} />}
      </Helmet>

      <SiteHeader demo={demo} theme={theme} logoSrc={logoSrc} navLinks={navLinks} onOpenConversion={openConversionCenter} />

      {/* HERO — muito visual, imagem domina */}
      <section
        ref={heroSectionRef}
        className="relative flex min-h-[92vh] items-center overflow-hidden bg-black pb-20 pt-32 text-white md:pb-14"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroAsset && (
            <div ref={heroImageRef} className="absolute inset-0">
              <img src={heroAsset.url} alt={heroAsset.alt} loading="eager" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-color"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentInk})` }}
          />
          <div
            className="pointer-events-none absolute -right-1/2 -top-1/2 h-[100vw] w-[100vw] rounded-full opacity-20 blur-[120px]"
            style={{ backgroundColor: theme.accent }}
          />
          <ThreeEffectLoader enabled={Boolean(demo.enableThree)} accentColor={theme.accent} />
        </div>

        <div ref={heroContentRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl">
            {demo.identity.locality && (
              <span className="hero-anim mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                {demo.identity.locality}
              </span>
            )}
            <h1 className="hero-anim font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              {demo.identity.companyName}
            </h1>
            <p className="hero-anim mt-6 text-xl font-light md:text-2xl" style={{ color: theme.accent }}>
              {demo.content.tagline}
            </p>
            {demo.content.shortDescription && (
              <p className="hero-anim mt-4 max-w-xl text-lg font-light leading-relaxed text-white/75">
                {demo.content.shortDescription}
              </p>
            )}
            <div className="hero-anim mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={openConversionCenter}
                className="inline-flex items-center justify-center rounded-full px-8 py-4 font-medium shadow-lg transition-all hover:scale-[1.02] active:scale-100"
                style={{ backgroundColor: theme.accent, color: theme.accentInk }}
              >
                {demo.conversion.ctaLabel || strings.requestQuote}
              </button>
              {hasOfferings && (
                <button
                  type="button"
                  onClick={() => document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 font-medium text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  {strings.services}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center animate-bounce md:flex">
          <span className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/50">Scroll</span>
          <ChevronDown className="h-4 w-4 text-white/50" />
        </div>
      </section>

      {/* TRUST + DIFERENCIAIS */}
      {(hasTrust || hasHighlights) && (
        <section id="sobre" className="py-24" style={{ backgroundColor: theme.surface }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            {hasTrust && (
              <div ref={trustRef} className="mb-28 grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {(demo.proof.stats ?? []).slice(0, 4).map((stat, i) => {
                  const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
                  return (
                    <div
                      key={stat.label}
                      className="trust-card flex flex-col items-center rounded-2xl border p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                      style={{ borderColor: theme.border, backgroundColor: theme.background }}
                    >
                      <Icon className="mb-3 h-6 w-6" style={{ color: theme.accent }} />
                      <span className="mb-1 text-2xl font-bold">{stat.value}</span>
                      <span className="text-sm" style={{ color: theme.inkMuted }}>{stat.label}</span>
                    </div>
                  );
                })}
                {(demo.proof.trustBadges ?? []).length > 0 && (demo.proof.stats ?? []).length === 0 && (
                  <div className="col-span-full flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-sm font-medium" style={{ color: theme.inkMuted }}>
                    {demo.proof.trustBadges!.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {hasHighlights && (
              <>
                <Reveal className="mx-auto mb-16 max-w-2xl text-center">
                  <span className="mb-4 block text-xs font-medium uppercase tracking-widest" style={{ color: theme.accent }}>
                    {strings.benefitsTitle}
                  </span>
                  <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">{strings.aboutTitle}</h2>
                  {demo.content.shortDescription && (
                    <p className="mt-6 text-lg font-light leading-relaxed" style={{ color: theme.inkMuted }}>
                      {demo.content.shortDescription}
                    </p>
                  )}
                </Reveal>
                <div ref={highlightsRef} className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {demo.content.highlights!.slice(0, 3).map((h) => {
                    const Icon = ((h.icon && HIGHLIGHT_ICONS[h.icon]) || Star) as ElementType<{ className?: string; strokeWidth?: number }>;
                    return (
                      <div
                        key={h.title}
                        className="highlight-card group rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        style={{ borderColor: theme.border, backgroundColor: theme.background }}
                      >
                        <div
                          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                          style={{ backgroundColor: `${theme.accent}1a`, color: theme.accent }}
                        >
                          <Icon className="h-6 w-6" strokeWidth={1.5} />
                        </div>
                        <h3 className="mb-3 font-serif text-2xl font-semibold">{h.title}</h3>
                        <p className="font-light leading-relaxed" style={{ color: theme.inkMuted }}>{h.description}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* PRODUTOS / SERVIÇOS */}
      {hasOfferings && (
        <section id="ofertas" className="py-24" style={{ backgroundColor: theme.background }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <Reveal className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <span className="mb-4 block text-xs font-medium uppercase tracking-widest" style={{ color: theme.accent }}>
                  {strings.services}
                </span>
                <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">{strings.services}</h2>
              </div>
            </Reveal>
            <div ref={offeringsRef} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {demo.offerings.map((offering) => {
                const price = formatOfferingPrice(offering);
                const selected = selectedIds.has(offering.id);
                return (
                  <div
                    key={offering.id}
                    className="offering-card group flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-all hover:shadow-lg"
                    style={{ borderColor: theme.border, backgroundColor: theme.surface }}
                  >
                    {offering.image && (
                      <div className="relative h-64 overflow-hidden" style={{ backgroundColor: theme.border }}>
                        <img
                          src={offering.image}
                          alt={offering.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {price && (
                          <div
                            className="absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-medium shadow-sm backdrop-blur-sm"
                            style={{ backgroundColor: `${theme.background}e6`, color: theme.ink }}
                          >
                            {price}
                          </div>
                        )}
                        {offering.badge && (
                          <div
                            className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                            style={{ backgroundColor: theme.accent, color: theme.accentInk }}
                          >
                            {offering.badge}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h3 className="font-serif text-xl font-semibold leading-tight">{offering.title}</h3>
                        {!offering.image && price && <span className="shrink-0 font-medium" style={{ color: theme.accent }}>{price}</span>}
                      </div>
                      {offering.description && (
                        <p className="mb-6 flex-1 text-sm" style={{ color: theme.inkMuted }}>
                          {offering.description}
                        </p>
                      )}
                      {offering.selectable && (
                        <button
                          type="button"
                          onClick={() => handleAdd(offering)}
                          disabled={selected}
                          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium transition-colors"
                          style={{
                            backgroundColor: selected ? `${theme.accent}1a` : theme.surface === theme.background ? `${theme.ink}0d` : theme.background,
                            color: selected ? theme.accent : theme.ink,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          {selected ? '✓' : strings.addToSelection}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* GALERIA */}
      {hasGallery && (
        <section id="galeria" className="py-24" style={{ backgroundColor: theme.surface }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <Reveal className="mb-16 text-center">
              <span className="mb-4 block text-xs font-medium uppercase tracking-widest" style={{ color: theme.accent }}>
                {strings.work}
              </span>
              <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">{strings.work}</h2>
            </Reveal>
            <div ref={galleryRef} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {galleryAssets.slice(0, 4).map((asset, i) => (
                <div
                  key={asset.id}
                  className={`gallery-tile relative overflow-hidden rounded-2xl ${i === 0 || i === 3 ? 'aspect-square md:aspect-video' : 'aspect-square'}`}
                  style={{ backgroundColor: theme.border }}
                >
                  <img
                    src={asset.url}
                    alt={asset.alt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOCO INSTITUCIONAL — processo */}
      {hasProcess && (
        <section id="como-funciona" className="py-24" style={{ backgroundColor: theme.background }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <Reveal className="mb-16 text-center">
              <span className="mb-4 block text-xs font-medium uppercase tracking-widest" style={{ color: theme.accent }}>
                {strings.processTitle}
              </span>
              <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">{strings.processTitle}</h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
              {demo.content.process!.map((step, i) => (
                <Reveal key={step.title} delayMs={i * 100} className="flex flex-col items-center text-center">
                  <div
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-full font-serif text-2xl"
                    style={{ backgroundColor: `${theme.accent}1a`, color: theme.accent }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-medium">{step.title}</h3>
                  <p className="max-w-xs font-light leading-relaxed" style={{ color: theme.inkMuted }}>{step.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {hasReviews && (
        <section className="py-24" style={{ backgroundColor: theme.surface }}>
          <div className="mx-auto max-w-5xl px-6 sm:px-10">
            <Reveal className="mb-12 text-center">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                {strings.reviewsTitle}
              </h2>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {demo.proof.reviews!.map((review, i) => (
                <Reveal key={review.text + i} delayMs={i * 80} className="rounded-2xl border p-6 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.background }}>
                  <p>&ldquo;{review.text}&rdquo;</p>
                  {review.author && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide" style={{ color: theme.inkMuted }}>
                      {review.author}
                    </p>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {hasFaq && (
        <section className="py-24" style={{ backgroundColor: theme.background }}>
          <div className="mx-auto max-w-3xl px-6 sm:px-10">
            <Reveal className="mb-10 text-center">
              <h2 className="font-serif text-3xl font-semibold">{strings.faqTitle}</h2>
            </Reveal>
            <div className="flex flex-col divide-y" style={{ borderColor: theme.border }}>
              {demo.content.faq!.map((item) => (
                <details key={item.question} className="py-4">
                  <summary className="cursor-pointer list-none font-semibold">{item.question}</summary>
                  <p className="mt-2 text-sm" style={{ color: theme.inkMuted }}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL + FOOTER COMPLETO */}
      <SiteFooter demo={demo} theme={theme} logoSrc={logoSrc} onOpenConversion={openConversionCenter} />

      {/* CENTRAL DE CONVERSÃO FLUTUANTE */}
      <FloatingTrigger demo={demo} theme={theme} count={selection.length} onClick={openConversionCenter} />

      <ConversionCenter
        demo={demo}
        theme={theme}
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
