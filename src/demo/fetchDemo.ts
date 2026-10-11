import { supabase } from './supabaseClient';
import type { DemoRecord } from './types';

type LoadStage = 'configuration' | 'site' | 'offerings' | 'assets';
export type DemoLoadResult =
  | { kind: 'found'; demo: DemoRecord }
  | { kind: 'not_found' }
  | { kind: 'error'; stage: LoadStage; code: string; occurredAt: string; transient: boolean };

type LoadOptions = {
  client?: typeof supabase;
  signal?: AbortSignal;
  retryDelay?: (attempt: number) => Promise<void>;
};

function loadError(stage: LoadStage, cause: unknown): Extract<DemoLoadResult, { kind: 'error' }> {
  const raw = cause as { code?: unknown; status?: unknown; message?: unknown } | null;
  const code = typeof raw?.code === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(raw.code)
    ? raw.code
    : typeof raw?.status === 'number' ? String(raw.status)
      : cause instanceof TypeError || /fetch|network|timeout/i.test(String(raw?.message ?? ''))
        ? 'NETWORK_ERROR' : 'UNEXPECTED_ERROR';
  const transient = code === 'NETWORK_ERROR' || /^08[A-Z0-9]{3}$/.test(code)
    || ['408', '425', '429', 'PGRST000', 'PGRST001', 'PGRST003'].includes(code)
    || /^5\d\d$/.test(code);
  return { kind: 'error', stage, code, occurredAt: new Date().toISOString(), transient };
}

const defaultRetryDelay = (attempt: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, attempt === 1 ? 300 : 900));

/**
 * Fetches a published demo by slug at runtime (RLS restricts anon reads to
 * status='published'). Missing demos and loading failures remain distinct.
 * Kept as three simple queries (not a single PostgREST embed) so it stays
 * easy to reason about without a live project to test complex joins against.
 */
// Milano source photos confirmed to actually resolve (several of the URLs copied
// from the source mockDB are dead/expired Google Photos signed links — verified
// with Playwright network inspection, not a referrer/CORS issue). Names below
// reflect what each photo actually shows (verified visually, not guessed from
// the source's own labels) so offerings only ever show a photo of that dish.
// This is throwaway fixture data, not the real asset pipeline.
const MILANO_DISH =
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkxP4oLsssA6IlGQRWDUalUieNjECDDhVJumJj-e7uuKN80C4hdcVQFFTECgXwWNlukx4HSppSsMGBuAJPZuI9YI1w3H0mJTukxMoAM8OUgQsrcJxXIomczitoRPtFdT5JZlmFsFw=s1360-w1360-h1020-rw'; // plated food (matches "Kebab no Prato")
const MILANO_INTERIOR =
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnINfYE8FP2wPl9Tb0quD3XBtHRMSIcptbKrq-3BLfgllWipuwwo8PWU8efRnKm522kXKljbYa1afdq1sqjg5klx7PZWY6veQZUArpZLbx2CY-WuiPHNKL8o_h5lEJhRay9Lgv36qxbXXOU=s1360-w1360-h1020-rw'; // dining room, set tables
const MILANO_TERRACE =
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnhU1jM3aLDvdsjdP0iyPz3MZKWPVZjIGefIxEpER5FckQCf5qWasQanzZj7BnrUieC0vnRRtmv4fpWyqCtliHFtTZB3dREWAmySuibXSSUPIW8BPRBozoYv5TQkNeW2k-okyr9=s1360-w1360-h1020-rw'; // covered terrace with lights
const MILANO_EXTERIOR =
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkXJsAA8jRITfMoZwBTw5P8Gb4eeyUnN3C2gQ4LiIsEByNHxcCMvladDtUQHuUHAuO0I6DkQ1Np86cZQAUdSS1Xw2dWECJvCR4gAneai3lY-vNHtYlMN2dk1tggRM5WGkWqtt-wfQ=s1360-w1360-h1020-rw'; // street/building front — best establishing shot

export async function fetchDemoBySlug(slug: string, options: LoadOptions = {}): Promise<DemoLoadResult> {
  if (slug === '__preview') {
    // Temporary reference fixture — Milano's own assets/copy, adapted into the
    // DemoRecord shape, used ONLY to validate the universal template's
    // composition against the real reference before wiring real data sources.
    const demo: DemoRecord = {
      id: 'preview-id',
      slug: '__preview',
      status: 'published',
      locale: 'pt-PT',
      language: 'pt',
      identity: { companyName: 'Pizzaria Milano', niche: 'Restaurante', locality: 'Mortágua, Portugal', logo: undefined },
      content: {
        tagline: 'A autêntica pizza no forno a lenha.',
        shortDescription: 'Massa estaladiça, recheio suculento e ingredientes frescos, em Mortágua.',
        highlights: [
          { icon: 'Flame', title: 'Forno a Lenha', description: 'A verdadeira massa estaladiça e recheio suculento, cozinhados como manda a tradição.' },
          { icon: 'Leaf', title: 'Ingredientes Frescos', description: 'Seleção rigorosa de produtos de alta qualidade em cada pizza.' },
          { icon: 'ShoppingBag', title: 'Takeaway e Balcão', description: 'Encomende e venha levantar a sua pizza quentinha, sem demoras.' },
        ],
      },
      contact: {
        phone: '+351 231 921 360',
        whatsapp: '351231921360',
        email: 'millanomortagua2018@gmail.com',
        address: 'Av. Reguengo N°213, 3450-165 Mortágua',
        mapsUrl: 'https://maps.google.com/?q=Pizzaria+Millano+Mortagua',
        directionsUrl: 'https://maps.google.com/?q=Pizzaria+Millano+Mortagua',
        openingHours: [
          { days: 'Qua - Dom', hours: '10h00 - 02h00' },
          { days: 'Ter', hours: '16h00 - 02h00' },
          { days: 'Seg', hours: 'Encerrado' },
        ],
      },
      offerings: [
        {
          id: 'm1',
          title: 'Bella Pizza',
          description: 'Tomate, mozzarella, fiambre, camarão e orégano.',
          price: 13.5,
          priceLabel: '13,50€ · 16,00€ · 25,50€',
          badge: 'Popular',
          selectable: true,
        },
        {
          id: 'm2',
          title: 'Francesinha',
          description: 'Pão, chouriço, fiambre, queijo, linguiça, febra de porco, ovo estrelado, molho e batata frita.',
          price: 11,
          selectable: true,
        },
        {
          id: 'm3',
          title: 'Kebab no Prato',
          description: 'Carne kebab (frango), salada mista, batata frita, molho pitta e molho samurai.',
          price: 10,
          image: MILANO_DISH,
          selectable: true,
        },
      ],
      conversion: {
        mode: 'order',
        allowEmptySelection: true,
        primaryChannel: 'whatsapp',
        secondaryChannel: 'phone',
        ctaLabel: 'Ver Menu e Encomendar',
        triggerLabel: 'Encomendar',
      },
      proof: {
        stats: [
          { label: 'Avaliação média', value: '4.8/5' },
          { label: 'Pedidos entregues', value: '2k+' },
          { label: 'Anos em Mortágua', value: '8' },
          { label: 'Forno a lenha', value: '100%' },
        ],
      },
      accent: {
        background: '#ffffff',
        surface: '#fff7ed',
        ink: '#1a1512',
        inkMuted: 'rgba(26,21,18,0.6)',
        accent: '#dc2626',
        accentInk: '#ffffff',
        border: 'rgba(26,21,18,0.08)',
        radius: 'soft',
      },
      og: {
        title: 'Pizzaria Milano — proposta de website',
        description: 'A autêntica pizza no forno a lenha em Mortágua.',
        image: MILANO_EXTERIOR,
      },
      assets: [
        // Hero uses the strongest establishing shot (street/building front).
        { id: 'hero', kind: 'hero', url: MILANO_EXTERIOR, alt: 'Pizzaria Milano — fachada', sortOrder: 0 },
        // Gallery: ambiance first (interior, terrace), then product, then exterior again as closer.
        { id: 'g1', kind: 'gallery', url: MILANO_INTERIOR, alt: 'Pizzaria Milano — sala interior', sortOrder: 0 },
        { id: 'g2', kind: 'gallery', url: MILANO_TERRACE, alt: 'Pizzaria Milano — esplanada coberta', sortOrder: 1 },
        { id: 'g3', kind: 'gallery', url: MILANO_DISH, alt: 'Pizzaria Milano — prato servido', sortOrder: 2 },
        { id: 'g4', kind: 'gallery', url: MILANO_EXTERIOR, alt: 'Pizzaria Milano — fachada', sortOrder: 3 },
      ],
      enableThree: false,
    };
    return { kind: 'found', demo };
  }
  const client = options.client === undefined ? supabase : options.client;
  if (!client) {
    const result = loadError('configuration', { code: 'CONFIG_MISSING' });
    console.warn('[demo-load]', result);
    return result;
  }

  // VELKS Demo Factory schema: flat JSONB columns directly on demo_sites (no
  // versioning layer) + demo_offerings as its own table — so a new niche
  // never needs a migration, and offerings can be queried/sorted natively.
  async function loadOnce(): Promise<DemoLoadResult> {
    let siteResult;
    try {
      siteResult = await client!.from('demo_sites')
        .select('id, slug, status, locale, language, identity, content, contact, proof, accent, conversion, og, enable_three')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
    } catch (cause) {
      return loadError('site', cause);
    }
    if (siteResult.error) return loadError('site', siteResult.error);
    const site = siteResult.data;
    if (!site) return { kind: 'not_found' };

    const [offeringsResult, assetsResult] = await Promise.allSettled([
      client!.from('demo_offerings')
        .select('id, title, description, price, price_label, badge, selectable, quantity_enabled, image_url, quote_fields')
        .eq('demo_id', site.id)
        .order('sort_order', { ascending: true }),
      client!.from('demo_assets')
        .select('id, kind, url, storage_path, alt, sort_order')
        .eq('demo_id', site.id)
        .order('sort_order', { ascending: true }),
    ]);
    if (offeringsResult.status === 'rejected') return loadError('offerings', offeringsResult.reason);
    if (offeringsResult.value.error) return loadError('offerings', offeringsResult.value.error);
    if (assetsResult.status === 'rejected') return loadError('assets', assetsResult.reason);
    if (assetsResult.value.error) return loadError('assets', assetsResult.value.error);
    const offerings = offeringsResult.value.data;
    const assets = assetsResult.value.data;
    if (!offerings) return loadError('offerings', { code: 'EMPTY_RESPONSE' });
    if (!assets) return loadError('assets', { code: 'EMPTY_RESPONSE' });

    const demo: DemoRecord = {
      id: site.id,
      slug: site.slug,
      status: site.status,
      locale: site.locale,
      language: site.language,
      identity: site.identity,
      content: site.content,
      contact: site.contact,
      proof: site.proof,
      accent: site.accent,
      conversion: site.conversion,
      og: site.og,
      enableThree: site.enable_three,
      offerings: offerings.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description ?? undefined,
        price: o.price ?? undefined,
        priceLabel: o.price_label ?? undefined,
        badge: o.badge ?? undefined,
        selectable: o.selectable,
        quantityEnabled: o.quantity_enabled,
        image: o.image_url ?? undefined,
        quoteFields: o.quote_fields ?? undefined,
      })),
      assets: assets.map((a) => ({
        id: a.id,
        kind: a.kind,
        url: a.url ?? a.storage_path,
        alt: a.alt ?? '',
        sortOrder: a.sort_order,
      })),
    };
    return { kind: 'found', demo };
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    if (options.signal?.aborted) return loadError('site', { code: 'CANCELLED' });
    const result = await loadOnce();
    if (result.kind !== 'error') return result;
    if (!result.transient || attempt === 3) {
      if (!options.signal?.aborted) console.warn('[demo-load]', { stage: result.stage, code: result.code, occurredAt: result.occurredAt, attempts: attempt });
      return result;
    }
    await (options.retryDelay ?? defaultRetryDelay)(attempt);
  }
  return loadError('site', { code: 'UNEXPECTED_ERROR' });
}

export async function logDemoEvent(demoId: string, eventType: string, metadata: Record<string, unknown> = {}) {
  if (!supabase) return;
  try {
    await supabase.from('demo_events').insert({ demo_id: demoId, event_type: eventType, metadata });
  } catch {
    // Event logging is best-effort; never break the demo experience over it.
  }
}
