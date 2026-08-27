import type { BusinessDemoConfig } from '../../types';
import type { VisualProfileTokens } from '../visualProfiles';
import { getDemoStrings } from '../../i18n';
import { Reveal } from '../Reveal';
import { ThreeEffectLoader } from '../ThreeEffectLoader';

interface HeroSectionProps {
  config: BusinessDemoConfig;
  tokens: VisualProfileTokens;
  onPrimaryCta: () => void;
}

export function HeroSection({ config, tokens, onPrimaryCta }: HeroSectionProps) {
  const strings = getDemoStrings(config.language);
  const style = config.visual.heroStyle ?? 'full-bleed';
  const heroImage = config.media.hero?.src;
  const heroAlt = config.media.hero?.alt ?? '';
  const ctaLabel = config.conversion.ctaLabel || strings.requestQuote;

  const headingStyle = {
    fontFamily: tokens.displayFont ? `'${tokens.displayFont}', serif` : undefined,
    fontWeight: tokens.displayFontWeight,
  };

  const Eyebrow = (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]"
      style={{ borderColor: tokens.palette.accent, color: tokens.palette.accent }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: tokens.palette.accent, boxShadow: `0 0 8px 2px ${tokens.palette.accent}` }}
      />
      {config.locality}
    </span>
  );

  const CtaButton = (
    <button
      type="button"
      onClick={onPrimaryCta}
      className="mt-8 inline-flex items-center rounded-full px-7 py-3.5 font-semibold transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ backgroundColor: tokens.palette.accent, color: tokens.palette.accentInk }}
    >
      {ctaLabel}
    </button>
  );

  if (style === 'split' || style === 'product' || style === 'portfolio') {
    return (
      <section
        className="grid gap-10 px-6 pb-16 pt-28 sm:px-10 lg:grid-cols-2 lg:items-center lg:pt-32"
        style={{ backgroundColor: tokens.palette.background, color: tokens.palette.ink }}
      >
        <Reveal>
          {Eyebrow}
          <h1 className="mt-6 text-4xl leading-[1.05] sm:text-6xl" style={headingStyle}>
            {config.companyName}
          </h1>
          <p className="mt-5 text-xl font-semibold" style={{ color: tokens.palette.ink }}>
            {config.tagline}
          </p>
          {config.shortDescription && (
            <p className="mt-3 max-w-md" style={{ color: tokens.palette.inkMuted }}>
              {config.shortDescription}
            </p>
          )}
          {CtaButton}
        </Reveal>
        <Reveal delayMs={150}>
          {heroImage && (
            <img
              src={heroImage}
              alt={heroAlt}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
              style={{ borderRadius: tokens.radius.lg }}
            />
          )}
        </Reveal>
      </section>
    );
  }

  if (style === 'masked') {
    return (
      <section
        className="relative px-6 pb-20 pt-28 sm:px-10 lg:pt-36"
        style={{ backgroundColor: tokens.palette.background, color: tokens.palette.ink }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-xl">
            {Eyebrow}
            <h1 className="mt-6 text-4xl leading-[1.05] sm:text-6xl" style={headingStyle}>
              {config.companyName}
            </h1>
            <p className="mt-5 text-xl font-semibold">{config.tagline}</p>
            {config.shortDescription && (
              <p className="mt-3 max-w-md" style={{ color: tokens.palette.inkMuted }}>
                {config.shortDescription}
              </p>
            )}
            {CtaButton}
          </Reveal>
          {heroImage && (
            <Reveal delayMs={200} className="relative mt-12 overflow-hidden" style={{ borderRadius: tokens.radius.lg }}>
              <img src={heroImage} alt={heroAlt} className="h-[50vh] w-full object-cover sm:h-[60vh]" />
            </Reveal>
          )}
        </div>
      </section>
    );
  }

  // full-bleed (also covers cinematic, layered, canvas, video without a dedicated video asset)
  return (
    <section
      className="relative flex min-h-[78vh] flex-col justify-end overflow-hidden px-6 pb-16 pt-28 sm:px-10"
      style={{ backgroundColor: tokens.palette.background, color: tokens.palette.ink }}
    >
      {style === 'video' && config.media.video ? (
        <video
          src={config.media.video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : heroImage ? (
        <img src={heroImage} alt={heroAlt} className="absolute inset-0 h-full w-full object-cover" />
      ) : null}

      <ThreeEffectLoader enabled={Boolean(config.motion.enableThree)} accentColor={tokens.palette.accent} />

      <div
        className="absolute inset-0"
        style={{
          background: heroImage
            ? `linear-gradient(to top, ${tokens.palette.background} 5%, ${tokens.palette.background}b3 55%, ${tokens.palette.background}33 100%)`
            : undefined,
        }}
      />

      <Reveal className="relative z-10 max-w-2xl">
        {Eyebrow}
        <h1 className="mt-6 text-4xl leading-[1.02] sm:text-6xl" style={headingStyle}>
          {config.companyName}
        </h1>
        <p className="mt-5 text-xl font-semibold sm:text-2xl">{config.tagline}</p>
        {config.shortDescription && (
          <p className="mt-3 max-w-md" style={{ color: tokens.palette.inkMuted }}>
            {config.shortDescription}
          </p>
        )}
        {CtaButton}
      </Reveal>
    </section>
  );
}
