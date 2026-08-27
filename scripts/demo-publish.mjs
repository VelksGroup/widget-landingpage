#!/usr/bin/env node
// VELKS Demo Factory — batch publisher.
//
// Usage:
//   npm run demo:publish -- ./prospects/batch-001.json
//
// Reads a batch of prospect records, validates each, inspects its local
// asset folder (prospect-assets/<slug>/), optimizes and uploads images to
// Supabase Storage, and upserts prospects + demo_sites + demo_offerings +
// demo_assets. Rerunning the same batch updates existing records (same
// slug/demo id) rather than duplicating anything. Works for a single
// prospect too — pass a file containing either a JSON array or one record.
//
// Requires env vars (see .env.local, never committed):
//   VITE_DEMO_SUPABASE_URL, DEMO_SUPABASE_SERVICE_ROLE_KEY
// Optional: PEXELS_API_KEY (stock-image fallback when a prospect has no photos)

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// Vite loads .env.local automatically for the app; this script runs outside
// Vite, so it has to load it explicitly (plain `dotenv/config` only reads
// `.env`, never `.env.local`).
dotenv.config({ path: path.resolve('.env.local') });

const SUPABASE_URL = process.env.VITE_DEMO_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.DEMO_SUPABASE_SERVICE_ROLE_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const BUCKET = 'demo-assets';
const SITE_URL = 'https://www.velks.space';
const RESERVED_SLUGS = new Set(['api', 'admin', 'demo', 'assets', 'www', 'app', 'static', 'index']);
const VALID_ASSET_KINDS = new Set(['logo', 'hero', 'gallery', 'offering', 'other']);

const MAX_ASSET_BYTES = 8 * 1024 * 1024; // 8MB per source file before optimization

function fail(msg) {
  console.error(`[demo-publish] ${msg}`);
  process.exit(1);
}

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  fail(
    'Missing VITE_DEMO_SUPABASE_URL / DEMO_SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local (service role key is server-side only, never commit it).',
  );
}

const batchPath = process.argv[2];
if (!batchPath) {
  fail('Usage: npm run demo:publish -- ./prospects/batch-001.json');
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function normalizeSlug(raw) {
  return String(raw)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function classifyAssetKind(filename) {
  const base = path.basename(filename).toLowerCase();
  if (base.startsWith('hero')) return 'hero';
  if (base.startsWith('logo')) return 'logo';
  if (base.startsWith('offering')) return 'offering';
  if (base.startsWith('og') || base.startsWith('background') || base.startsWith('bg')) return 'other';
  return 'gallery';
}

async function optimizeImage(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

async function fetchStockImage(query) {
  if (!PEXELS_API_KEY) return null;
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: { Authorization: PEXELS_API_KEY },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) return null;
    const imgRes = await fetch(photo.src.large2x || photo.src.large);
    if (!imgRes.ok) return null;
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    return { buffer, sourceMeta: { provider: 'pexels', photographer: photo.photographer, sourceUrl: photo.url } };
  } catch {
    return null;
  }
}

async function collectLocalAssets(slug, record) {
  const dir = path.resolve('prospect-assets', slug);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)) : [];

  const items = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.size > MAX_ASSET_BYTES) {
      console.warn(`[demo-publish] [${slug}] skipping oversized file: ${file} (${stat.size} bytes)`);
      continue;
    }
    items.push({
      kind: classifyAssetKind(file),
      buffer: fs.readFileSync(filePath),
      filename: file,
      alt: record.companyName || slug,
    });
  }

  // Explicit media entries: direct image URLs are downloaded; page/profile URLs are skipped (research only).
  for (const media of record.media ?? []) {
    if (!media.src || !/^https?:\/\//i.test(media.src)) continue;
    try {
      const res = await fetch(media.src);
      const contentType = res.headers.get('content-type') ?? '';
      if (!res.ok || !contentType.startsWith('image/')) {
        console.warn(`[demo-publish] [${slug}] source is not a direct image, skipping: ${media.src}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const kind = VALID_ASSET_KINDS.has(media.role) ? media.role : 'gallery';
      items.push({
        kind,
        buffer,
        filename: `url-${items.length}.jpg`,
        alt: media.alt || record.companyName || slug,
        sourceMeta: { sourceUrl: media.src },
      });
    } catch {
      console.warn(`[demo-publish] [${slug}] failed to download: ${media.src}`);
    }
  }

  if (items.length === 0) {
    const stock = await fetchStockImage(record.niche || record.companyName || slug);
    if (stock) {
      items.push({ kind: 'hero', buffer: stock.buffer, filename: 'stock-hero.jpg', alt: record.companyName || slug, sourceMeta: stock.sourceMeta });
    } else {
      console.log(`[demo-publish] [${slug}] no images available (no local assets, no direct URLs, no PEXELS_API_KEY) — premium no-photo layout will be used.`);
    }
  }

  return items;
}

/** Resolves an offering's `image` field. Supports a direct URL, or "local:<filename>" to reuse an already-uploaded prospect-assets file by name. */
function resolveOfferingImage(image, uploadedAssets) {
  if (!image) return null;
  if (image.startsWith('local:')) {
    const filename = image.slice('local:'.length).toLowerCase();
    const match = uploadedAssets.find((a) => a.filename?.toLowerCase() === filename);
    return match?.public_url ?? null;
  }
  return image;
}

function buildJsonbColumns(record) {
  return {
    identity: {
      companyName: record.companyName,
      legalName: record.legalName,
      niche: record.niche,
      locality: record.locality,
      logo: record.identity?.logo,
      favicon: record.identity?.favicon,
    },
    content: {
      tagline: record.content?.tagline || record.tagline || record.companyName,
      shortDescription: record.content?.shortDescription,
      advantages: record.content?.advantages ?? [],
      highlights: record.content?.highlights ?? [],
      process: record.content?.process ?? [],
      faq: record.content?.faq ?? [],
    },
    contact: record.contact ?? {},
    conversion: {
      mode: record.conversion?.mode ?? 'quote',
      allowEmptySelection: record.conversion?.allowEmptySelection ?? true,
      primaryChannel: record.conversion?.primaryChannel ?? (record.contact?.whatsapp ? 'whatsapp' : record.contact?.email ? 'email' : 'phone'),
      secondaryChannel: record.conversion?.secondaryChannel,
      customMessageIntro: record.conversion?.customMessageIntro,
      globalQuoteFields: record.conversion?.globalQuoteFields ?? [],
      ctaLabel: record.conversion?.ctaLabel,
      triggerLabel: record.conversion?.triggerLabel,
    },
    proof: record.proof ?? {},
    accent: record.accent ?? {},
    og: {
      title: record.og?.title || `${record.companyName} — proposta de website`,
      description: record.og?.description || record.content?.tagline || record.companyName,
      image: record.og?.image || '',
    },
  };
}

async function publishOne(record, index) {
  const slug = normalizeSlug(record.slug || record.companyName);
  const label = `[${index + 1}] ${slug}`;

  if (!slug) return { slug, ok: false, error: 'missing/invalid slug' };
  if (RESERVED_SLUGS.has(slug)) return { slug, ok: false, error: 'reserved slug' };
  if (!record.companyName) return { slug, ok: false, error: 'missing companyName' };
  if (!record.contact?.whatsapp && !record.contact?.email && !record.contact?.phone) {
    return { slug, ok: false, error: 'no contact channel (need whatsapp, email or phone)' };
  }

  try {
    console.log(`${label} publishing...`);

    // 1. prospects — upsert by slug (1:1 with the demo for this MVP).
    const { data: prospect, error: prospectError } = await supabase
      .from('prospects')
      .upsert(
        {
          slug,
          company_name: record.companyName,
          niche: record.niche ?? null,
          locality: record.locality ?? null,
          source: record.source ?? null,
          source_url: record.sourceUrl ?? null,
          phone: record.contact?.phone ?? null,
          whatsapp: record.contact?.whatsapp ?? null,
          email: record.contact?.email ?? null,
          website: record.website ?? null,
          address: record.contact?.address ?? null,
          maps_url: record.contact?.mapsUrl ?? null,
          raw_data: record,
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single();
    if (prospectError) throw prospectError;

    // 2. demo_sites — upsert by slug.
    const jsonbColumns = buildJsonbColumns(record);
    const { data: demoSite, error: demoError } = await supabase
      .from('demo_sites')
      .upsert(
        {
          slug,
          prospect_id: prospect.id,
          status: record.publish ? 'published' : 'draft',
          locale: record.locale ?? 'pt-PT',
          language: record.language ?? 'pt',
          enable_three: record.enableThree ?? false,
          published_at: record.publish ? new Date().toISOString() : null,
          ...jsonbColumns,
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single();
    if (demoError) throw demoError;
    const demoId = demoSite.id;

    // 3. assets — collect local/remote images, optimize, upload.
    const assetItems = await collectLocalAssets(slug, record);
    const uploadedAssets = [];

    for (const [i, item] of assetItems.entries()) {
      const optimized = await optimizeImage(item.buffer);
      const storagePath = `${slug}/${item.kind}-${i}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, optimized, { contentType: 'image/jpeg', upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      uploadedAssets.push({
        demo_id: demoId,
        kind: item.kind,
        storage_path: storagePath,
        url: publicUrlData.publicUrl,
        alt: item.alt,
        sort_order: i,
        metadata: item.sourceMeta ?? {},
        filename: item.filename,
        public_url: publicUrlData.publicUrl,
      });
    }

    if (uploadedAssets.length > 0 || assetItems.length === 0) {
      await supabase.from('demo_assets').delete().eq('demo_id', demoId);
    }
    if (uploadedAssets.length > 0) {
      const rows = uploadedAssets.map(({ demo_id, kind, storage_path, url, alt, sort_order, metadata }) => ({
        demo_id,
        kind,
        storage_path,
        url,
        alt,
        sort_order,
        metadata,
      }));
      const { error: assetsError } = await supabase.from('demo_assets').insert(rows);
      if (assetsError) throw assetsError;
    }

    // og.image fallback: hero asset, else first uploaded asset.
    if (!jsonbColumns.og.image && uploadedAssets.length > 0) {
      const ogAsset = uploadedAssets.find((a) => a.kind === 'hero') ?? uploadedAssets[0];
      await supabase.from('demo_sites').update({ og: { ...jsonbColumns.og, image: ogAsset.public_url } }).eq('id', demoId);
    }

    // 4. offerings — replace wholesale on each publish, ordered by array index.
    const offerings = record.offerings ?? [];
    await supabase.from('demo_offerings').delete().eq('demo_id', demoId);
    if (offerings.length > 0) {
      const rows = offerings.map((o, i) => ({
        demo_id: demoId,
        sort_order: i,
        title: o.title,
        description: o.description ?? null,
        price: typeof o.price === 'number' ? o.price : null,
        price_label: o.priceLabel ?? (typeof o.price === 'string' ? o.price : null),
        badge: o.badge ?? null,
        selectable: o.selectable ?? true,
        quantity_enabled: o.quantityEnabled ?? false,
        image_url: resolveOfferingImage(o.image, uploadedAssets),
        quote_fields: o.quoteFields ?? [],
        metadata: {},
      }));
      const { error: offeringsError } = await supabase.from('demo_offerings').insert(rows);
      if (offeringsError) throw offeringsError;
    }

    console.log(
      `${label} OK — ${SITE_URL}/demo/${slug} (${record.publish ? 'published' : 'draft'}, ${offerings.length} offering(s), ${uploadedAssets.length} asset(s))`,
    );
    return { slug, ok: true, url: `${SITE_URL}/demo/${slug}`, published: Boolean(record.publish) };
  } catch (err) {
    console.error(`${label} FAILED: ${err.message}`);
    return { slug, ok: false, error: err.message };
  }
}

async function main() {
  const raw = fs.readFileSync(path.resolve(batchPath), 'utf-8');
  const parsed = JSON.parse(raw);
  const records = Array.isArray(parsed) ? parsed : parsed.prospects ? parsed.prospects : [parsed];
  if (!Array.isArray(records) || records.length === 0) {
    fail('Batch file must be a JSON array of prospects, { "prospects": [...] }, or a single prospect object.');
  }

  console.log(`[demo-publish] publishing ${records.length} prospect(s) from ${batchPath}`);
  const results = [];
  for (const [index, record] of records.entries()) {
    results.push(await publishOne(record, index));
  }

  const okCount = results.filter((r) => r.ok).length;
  console.log(`\n[demo-publish] done: ${okCount}/${results.length} succeeded`);
  for (const r of results) {
    console.log(r.ok ? `  OK   ${r.slug} -> ${r.url}` : `  FAIL ${r.slug}: ${r.error}`);
  }

  if (okCount < results.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error('[demo-publish] fatal:', err);
  process.exit(1);
});
