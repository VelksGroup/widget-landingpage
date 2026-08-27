import type { BusinessDemoConfig, DemoLanguage } from '../../types';
import type { VisualProfileTokens } from '../visualProfiles';
import { getDemoStrings } from '../../i18n';
import { Reveal } from '../Reveal';

const BEFORE_AFTER_LABELS: Record<DemoLanguage, { before: string; after: string }> = {
  pt: { before: 'Antes', after: 'Depois' },
  en: { before: 'Before', after: 'After' },
  es: { before: 'Antes', after: 'Después' },
  fr: { before: 'Avant', after: 'Après' },
  de: { before: 'Vorher', after: 'Nachher' },
  it: { before: 'Prima', after: 'Dopo' },
};

interface GallerySectionProps {
  config: BusinessDemoConfig;
  tokens: VisualProfileTokens;
}

export function GallerySection({ config, tokens }: GallerySectionProps) {
  const gallery = config.media.gallery ?? [];
  if (gallery.length === 0) return null;

  const strings = getDemoStrings(config.language);
  const style = config.visual.galleryStyle ?? 'masonry';

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
      <Reveal>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: tokens.palette.accent }}>
          {strings.work}
        </h2>
      </Reveal>

      {style === 'before-after' ? (
        <BeforeAfterGrid gallery={gallery} tokens={tokens} language={config.language} />
      ) : style === 'horizontal' ? (
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
          {gallery.map((item, i) => (
            <img
              key={item.src + i}
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="h-72 w-64 shrink-0 snap-start object-cover"
              style={{ borderRadius: tokens.radius.md }}
            />
          ))}
        </div>
      ) : style === 'stacked' ? (
        <div className="mt-8 flex flex-col gap-6 sm:mx-auto sm:max-w-xl">
          {gallery.map((item, i) => (
            <Reveal key={item.src + i} delayMs={i * 80} style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}>
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full object-cover shadow-xl"
                style={{ borderRadius: tokens.radius.md }}
              />
            </Reveal>
          ))}
        </div>
      ) : style === 'parallax' ? (
        <Reveal className="mt-8" y={40}>
          <img
            src={gallery[0].src}
            alt={gallery[0].alt}
            loading="lazy"
            className="h-[60vh] w-full object-cover"
            style={{ borderRadius: tokens.radius.lg }}
          />
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {gallery.slice(1).map((item, i) => (
                <img key={item.src + i} src={item.src} alt={item.alt} loading="lazy" className="h-40 w-full object-cover" style={{ borderRadius: tokens.radius.sm }} />
              ))}
            </div>
          )}
        </Reveal>
      ) : (
        // masonry (default, also covers cinematic/pinned)
        <div className="mt-8 columns-2 gap-4 sm:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {gallery.map((item, i) => (
            <img
              key={item.src + i}
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="w-full object-cover"
              style={{ borderRadius: tokens.radius.md }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function BeforeAfterGrid({
  gallery,
  tokens,
  language,
}: {
  gallery: NonNullable<BusinessDemoConfig['media']['gallery']>;
  tokens: VisualProfileTokens;
  language: DemoLanguage;
}) {
  const labels = BEFORE_AFTER_LABELS[language] ?? BEFORE_AFTER_LABELS.pt;
  const pairs: [typeof gallery[number], typeof gallery[number] | undefined][] = [];
  for (let i = 0; i < gallery.length; i += 2) {
    pairs.push([gallery[i], gallery[i + 1]]);
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      {pairs.map(([before, after], i) => (
        <Reveal key={before.src + i} delayMs={i * 100} className="grid grid-cols-2 gap-3">
          <figure>
            <img src={before.src} alt={before.alt} loading="lazy" className="h-56 w-full object-cover sm:h-72" style={{ borderRadius: tokens.radius.md }} />
            <figcaption className="mt-2 text-xs font-semibold uppercase tracking-wide" style={{ color: tokens.palette.inkMuted }}>
              {labels.before}
            </figcaption>
          </figure>
          {after && (
            <figure>
              <img src={after.src} alt={after.alt} loading="lazy" className="h-56 w-full object-cover sm:h-72" style={{ borderRadius: tokens.radius.md }} />
              <figcaption className="mt-2 text-xs font-semibold uppercase tracking-wide" style={{ color: tokens.palette.accent }}>
                {labels.after}
              </figcaption>
            </figure>
          )}
        </Reveal>
      ))}
    </div>
  );
}
