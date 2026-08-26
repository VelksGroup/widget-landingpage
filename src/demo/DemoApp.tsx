import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getDemoConfig } from './registry';
import { getDemoStrings } from './i18n';
import { resolveAbsoluteUrl } from './utils';
import { ServiceCard } from './components/ServiceCard';
import { QuoteRequest } from './components/QuoteRequest';
import { templateRegistry } from './templates';
import type { DemoCompanyConfig, DemoService } from './types';

const SITE_URL = 'https://www.velks.space';

function extractSlug(pathname: string): string {
  const match = pathname.match(/^\/demo\/?([^/]*)/);
  return decodeURIComponent(match?.[1] ?? '');
}

function DemoUnavailable() {
  return (
    <div className="velks-demo-root flex min-h-screen flex-col items-center justify-center bg-[#020205] px-6 text-center text-white">
      <Helmet>
        <title>Demonstração indisponível — VELKS</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>
      <h1 className="text-2xl font-semibold">Demonstração indisponível</h1>
      <p className="mt-3 max-w-md text-white/60">
        Esta demonstração não está disponível de momento.
      </p>
    </div>
  );
}

function GenericDemoBody({ config }: { config: DemoCompanyConfig }) {
  const strings = getDemoStrings(config.language);
  const [selectedService, setSelectedService] = useState<DemoService | undefined>(undefined);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col justify-end overflow-hidden px-6 pb-12 pt-24 sm:px-10">
        <img
          src={config.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/70 to-[#020205]/20" />
        <div className="relative z-10 max-w-3xl">
          {config.logo && (
            <img src={config.logo} alt={config.companyName} className="mb-6 h-12 w-auto" />
          )}
          <p className="text-sm uppercase tracking-widest text-white/60">{config.locality}</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">{config.headline}</h1>
          <p className="mt-4 text-lg text-white/70">{config.subheadline}</p>
          <a
            href="#orcamento"
            className="mt-8 inline-block rounded-full bg-[#ff003c] px-7 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {strings.requestQuote}
          </a>
        </div>
      </section>

      {config.description && (
        <section className="mx-auto max-w-3xl px-6 py-12 text-center text-white/70 sm:px-10">
          <p>{config.description}</p>
        </section>
      )}

      {/* Services */}
      <section className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        <h2 className="text-2xl font-semibold">{strings.services}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedService?.id === service.id}
              onSelect={setSelectedService}
            />
          ))}
        </div>
      </section>

      {/* Gallery */}
      {config.galleryImages.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
          <h2 className="text-2xl font-semibold">{strings.work}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.galleryImages.map((src, index) => (
              <img
                key={src + index}
                src={src}
                alt=""
                loading="lazy"
                className="h-56 w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </section>
      )}

      {/* Social proof */}
      {config.socialProof && config.socialProof.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
          <ul className="space-y-3 text-center text-white/70">
            {config.socialProof.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Quote request */}
      <section id="orcamento" className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
        <h2 className="text-2xl font-semibold">{strings.requestQuote}</h2>
        {selectedService ? (
          <div className="mt-6">
            <p className="mb-4 text-sm text-white/60">{selectedService.title}</p>
            <QuoteRequest config={config} service={selectedService} />
          </div>
        ) : (
          <p className="mt-4 text-white/60">{strings.selectServicePrompt}</p>
        )}
      </section>
    </>
  );
}

export function DemoApp() {
  const slug = useMemo(() => extractSlug(window.location.pathname), []);
  const config = getDemoConfig(slug);

  if (!config) {
    return <DemoUnavailable />;
  }

  const canonical = `${SITE_URL}/demo/${config.slug}`;
  const ogImage = resolveAbsoluteUrl(SITE_URL, config.og.image);
  const ogLocale = config.locale.replace('-', '_');
  const Template = templateRegistry[config.slug];

  return (
    <div className="velks-demo-root min-h-screen bg-[#020205] text-white">
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
      </Helmet>

      {Template ? <Template config={config} /> : <GenericDemoBody config={config} />}
    </div>
  );
}
