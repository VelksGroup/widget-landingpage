import type { BusinessDemoConfig } from '../../types';
import type { VisualProfileTokens } from '../visualProfiles';
import { getDemoStrings } from '../../i18n';
import { Reveal } from '../Reveal';

interface SectionProps {
  config: BusinessDemoConfig;
  tokens: VisualProfileTokens;
}

const headingClass = 'text-xs font-semibold uppercase tracking-[0.2em]';

export function TrustStripSection({ config, tokens }: SectionProps) {
  const items = config.socialProof ?? [];
  if (items.length === 0) return null;
  return (
    <section
      className="border-y px-6 py-6 sm:px-10"
      style={{ borderColor: tokens.palette.border, backgroundColor: tokens.palette.surface }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-sm font-medium" style={{ color: tokens.palette.inkMuted }}>
        {items.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </section>
  );
}

export function StatsSection({ config, tokens }: SectionProps) {
  const stats = config.stats ?? [];
  if (stats.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-6 py-14 sm:px-10">
      <Reveal className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold sm:text-4xl" style={{ color: tokens.palette.accent }}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: tokens.palette.inkMuted }}>
              {stat.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function AboutSection({ config, tokens }: SectionProps) {
  if (!config.shortDescription) return null;
  const strings = getDemoStrings(config.language);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-10">
      <Reveal>
        <h2 className={headingClass} style={{ color: tokens.palette.accent }}>
          {strings.aboutTitle}
        </h2>
        <p className="mt-4 text-lg" style={{ color: tokens.palette.ink }}>
          {config.shortDescription}
        </p>
      </Reveal>
    </section>
  );
}

export function ProcessSection({ config, tokens }: SectionProps) {
  const steps = config.process ?? [];
  if (steps.length === 0) return null;
  const strings = getDemoStrings(config.language);
  return (
    <section
      className="border-y px-6 py-20 sm:px-10"
      style={{ borderColor: tokens.palette.border, backgroundColor: tokens.palette.surface }}
    >
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className={headingClass} style={{ color: tokens.palette.accent }}>
            {strings.processTitle}
          </h2>
        </Reveal>
        <div className="relative mt-12 grid gap-10 sm:grid-cols-3">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 4"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 right-0 top-[10px] hidden h-[2px] w-full sm:block"
          >
            <line x1="8" y1="2" x2="92" y2="2" stroke={tokens.palette.border} strokeWidth="0.6" />
          </svg>
          {steps.map((step, i) => (
            <Reveal key={step.title} delayMs={i * 120} className="flex flex-col items-start sm:items-center sm:text-center">
              <span
                className="mb-4 h-4 w-4 shrink-0 rounded-full border-2"
                style={{ borderColor: tokens.palette.accent, backgroundColor: tokens.palette.accent }}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: tokens.palette.accent }}>
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm" style={{ color: tokens.palette.inkMuted }}>
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection({ config, tokens }: SectionProps) {
  const benefits = config.benefits ?? [];
  if (benefits.length === 0) return null;
  const strings = getDemoStrings(config.language);
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
      <Reveal>
        <h2 className={headingClass} style={{ color: tokens.palette.accent }}>
          {strings.benefitsTitle}
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit, i) => (
          <Reveal
            key={benefit}
            delayMs={i * 60}
            className="rounded-lg border p-4 text-sm font-medium"
            style={{ borderColor: tokens.palette.border, color: tokens.palette.ink }}
          >
            {benefit}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FaqSection({ config, tokens }: SectionProps) {
  const faq = config.faq ?? [];
  if (faq.length === 0) return null;
  const strings = getDemoStrings(config.language);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
      <Reveal>
        <h2 className={headingClass} style={{ color: tokens.palette.accent }}>
          {strings.faqTitle}
        </h2>
      </Reveal>
      <div className="mt-6 flex flex-col divide-y" style={{ borderColor: tokens.palette.border }}>
        {faq.map((item) => (
          <details key={item.question} className="group py-4" style={{ borderColor: tokens.palette.border }}>
            <summary className="cursor-pointer list-none font-semibold" style={{ color: tokens.palette.ink }}>
              {item.question}
            </summary>
            <p className="mt-2 text-sm" style={{ color: tokens.palette.inkMuted }}>
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ReviewsSection({ config, tokens }: SectionProps) {
  const reviews = config.reviews ?? [];
  if (reviews.length === 0) return null;
  const strings = getDemoStrings(config.language);
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
      <Reveal>
        <h2 className={headingClass} style={{ color: tokens.palette.accent }}>
          {strings.reviewsTitle}
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {reviews.map((review, i) => (
          <Reveal
            key={review.text + i}
            delayMs={i * 80}
            className="rounded-lg border p-5 text-sm"
            style={{ borderColor: tokens.palette.border, color: tokens.palette.ink }}
          >
            <p>&ldquo;{review.text}&rdquo;</p>
            {review.author && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide" style={{ color: tokens.palette.inkMuted }}>
                {review.author}
              </p>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function MapSection({ config, tokens }: SectionProps) {
  if (!config.contact.address && !config.contact.mapsUrl) return null;
  const strings = getDemoStrings(config.language);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
      <Reveal className="rounded-xl border p-6 text-center" style={{ borderColor: tokens.palette.border }}>
        {config.contact.address && (
          <p className="font-medium" style={{ color: tokens.palette.ink }}>
            {config.contact.address}
          </p>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {config.contact.mapsUrl && (
            <a
              href={config.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-5 py-2.5 text-sm font-semibold"
              style={{ borderColor: tokens.palette.accent, color: tokens.palette.accent }}
            >
              {strings.viewOnMap}
            </a>
          )}
          {config.contact.directionsUrl && (
            <a
              href={config.contact.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-5 py-2.5 text-sm font-semibold"
              style={{ backgroundColor: tokens.palette.accent, color: tokens.palette.accentInk }}
            >
              {strings.getDirections}
            </a>
          )}
        </div>
      </Reveal>
    </section>
  );
}

export function OpeningHoursSection({ config, tokens }: SectionProps) {
  const hours = config.contact.openingHours ?? [];
  if (hours.length === 0) return null;
  const strings = getDemoStrings(config.language);
  return (
    <section className="mx-auto max-w-md px-6 py-16 sm:px-10">
      <Reveal>
        <h2 className={headingClass} style={{ color: tokens.palette.accent }}>
          {strings.openingHours}
        </h2>
        <dl className="mt-6 flex flex-col gap-2">
          {hours.map((entry) => (
            <div key={entry.days} className="flex items-center justify-between border-b pb-2 text-sm" style={{ borderColor: tokens.palette.border }}>
              <dt style={{ color: tokens.palette.inkMuted }}>{entry.days}</dt>
              <dd className="font-semibold" style={{ color: tokens.palette.ink }}>
                {entry.hours}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

export function FinalCtaSection({ config, tokens, onPrimaryCta }: SectionProps & { onPrimaryCta: () => void }) {
  const strings = getDemoStrings(config.language);
  return (
    <section
      className="px-6 py-20 text-center sm:px-10"
      style={{ backgroundColor: tokens.palette.surface, color: tokens.palette.ink }}
    >
      <Reveal>
        <h2 className="text-2xl font-bold sm:text-3xl">{config.tagline}</h2>
        <button
          type="button"
          onClick={onPrimaryCta}
          className="mt-6 inline-flex items-center rounded-full px-7 py-3.5 font-semibold transition-transform hover:scale-[1.03]"
          style={{ backgroundColor: tokens.palette.accent, color: tokens.palette.accentInk }}
        >
          {config.conversion.ctaLabel || strings.requestQuote}
        </button>
      </Reveal>
    </section>
  );
}
