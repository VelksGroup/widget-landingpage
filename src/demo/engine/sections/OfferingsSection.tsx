import type { BusinessDemoConfig, Offering } from '../../types';
import type { VisualProfileTokens } from '../visualProfiles';
import { getDemoStrings } from '../../i18n';
import { Reveal } from '../Reveal';
import { cn } from '../../../lib/utils';

interface OfferingsSectionProps {
  config: BusinessDemoConfig;
  tokens: VisualProfileTokens;
  selectedIds: Set<string>;
  onAdd: (offering: Offering) => void;
}

export function OfferingsSection({ config, tokens, selectedIds, onAdd }: OfferingsSectionProps) {
  const strings = getDemoStrings(config.language);
  if (config.offerings.length === 0) return null;

  const style = config.visual.offeringStyle ?? 'cards';
  // Offerings marked "featured" get their own spotlight section below; avoid showing them twice.
  const gridOfferings = config.offerings.filter((o) => o.category !== 'featured');
  if (gridOfferings.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10" style={{ color: tokens.palette.ink }}>
      <Reveal>
        <h2
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: tokens.palette.accent, fontFamily: tokens.labelFont === 'mono' ? "'JetBrains Mono', monospace" : undefined }}
        >
          {strings.services}
        </h2>
      </Reveal>

      <div
        className={cn(
          'mt-8 grid gap-5',
          style === 'list' ? 'sm:grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {gridOfferings.map((offering, index) => (
          <Reveal key={offering.id} delayMs={index * 60}>
            <OfferingCard
              offering={offering}
              tokens={tokens}
              selected={selectedIds.has(offering.id)}
              onAdd={onAdd}
              addLabel={strings.addToSelection}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function OfferingCard({
  offering,
  tokens,
  selected,
  onAdd,
  addLabel,
}: {
  offering: Offering;
  tokens: VisualProfileTokens;
  selected: boolean;
  onAdd: (offering: Offering) => void;
  addLabel: string;
}) {
  const cardBase = 'group flex h-full flex-col overflow-hidden transition-transform hover:-translate-y-1';
  const cardStyle: React.CSSProperties = {
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.cardStyle === 'flat' ? 'transparent' : tokens.palette.surface,
    border: tokens.cardStyle === 'bordered' || tokens.cardStyle === 'flat' ? `1px solid ${tokens.palette.border}` : 'none',
    boxShadow: tokens.cardStyle === 'elevated' ? '0 12px 30px -10px rgba(0,0,0,0.35)' : undefined,
  };

  return (
    <article className={cardBase} style={cardStyle}>
      {offering.image && (
        <img src={offering.image} alt="" loading="lazy" className="h-44 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold" style={{ color: tokens.palette.ink }}>
            {offering.title}
          </h3>
          {offering.badge && (
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: tokens.palette.accent, color: tokens.palette.accentInk }}
            >
              {offering.badge}
            </span>
          )}
        </div>
        {offering.description && (
          <p className="mt-2 flex-1 text-sm" style={{ color: tokens.palette.inkMuted }}>
            {offering.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          {offering.price !== undefined && (
            <span className="font-semibold" style={{ color: tokens.palette.ink }}>
              {offering.priceLabel ?? offering.price}
            </span>
          )}
          {offering.selectable && (
            <button
              type="button"
              onClick={() => onAdd(offering)}
              className="ml-auto rounded-full px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2"
              style={{
                backgroundColor: selected ? tokens.palette.background : tokens.palette.accent,
                color: selected ? tokens.palette.ink : tokens.palette.accentInk,
                border: selected ? `1px solid ${tokens.palette.border}` : 'none',
              }}
            >
              {selected ? '✓' : addLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function FeaturedOfferingSection({ config, tokens, onAdd }: OfferingsSectionProps) {
  const featured = config.offerings.find((o) => o.category === 'featured');
  if (!featured) return null;
  const strings = getDemoStrings(config.language);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
      <Reveal
        className="grid gap-8 rounded-2xl p-8 sm:grid-cols-2 sm:items-center sm:p-12"
        style={{ backgroundColor: tokens.palette.surface, borderRadius: tokens.radius.lg }}
      >
        {featured.image && (
          <img src={featured.image} alt="" className="rounded-xl object-cover" style={{ borderRadius: tokens.radius.md }} />
        )}
        <div>
          <h3 className="text-2xl font-bold" style={{ color: tokens.palette.ink }}>
            {featured.title}
          </h3>
          {featured.description && (
            <p className="mt-3" style={{ color: tokens.palette.inkMuted }}>
              {featured.description}
            </p>
          )}
          <button
            type="button"
            onClick={() => onAdd(featured)}
            className="mt-6 rounded-full px-6 py-3 font-semibold"
            style={{ backgroundColor: tokens.palette.accent, color: tokens.palette.accentInk }}
          >
            {strings.addToSelection}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
