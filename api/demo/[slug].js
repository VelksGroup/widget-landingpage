// Vercel Node serverless function. Injects personalized OG/meta tags into the
// SPA shell at request time, so social/WhatsApp crawlers see per-prospect
// metadata without any per-prospect build or deploy. Humans get the exact
// same HTML too — DemoApp then fetches the full record client-side and
// renders the interactive demo, so there is nothing bot-specific to sniff.

const SITE_URL = 'https://www.velks.space';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

function resolveAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return pathOrUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

async function fetchPublishedDemoMeta(slug) {
  const url = process.env.VITE_DEMO_SUPABASE_URL;
  const anonKey = process.env.VITE_DEMO_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const siteRes = await fetch(
    `${url}/rest/v1/demo_sites?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=og,locale`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } },
  );
  if (!siteRes.ok) return null;
  const sites = await siteRes.json();
  const site = sites[0];
  if (!site?.og) return null;

  return { og: site.og, locale: site.locale || 'pt-PT' };
}

export default async function handler(req, res) {
  const { slug } = req.query;
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  let html;
  try {
    const origin = `https://${req.headers.host}`;
    const indexRes = await fetch(`${origin}/index.html`);
    html = await indexRes.text();
  } catch {
    res.status(502).send('Demo temporarily unavailable.');
    return;
  }

  const meta = await fetchPublishedDemoMeta(Array.isArray(slug) ? slug[0] : slug);

  if (meta) {
    const { og, locale } = meta;
    const canonical = `${SITE_URL}/demo/${slug}`;
    const ogImage = resolveAbsoluteUrl(og.image);
    const ogLocale = String(locale).replace('-', '_');

    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(og.title)}</title>`);
    html = html.replace(
      /<meta name="description" content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(og.description)}" />`,
    );
    html = html.replace(
      /<meta name="robots" content="[\s\S]*?"\s*\/?>/,
      '<meta name="robots" content="noindex,nofollow">',
    );
    html = html.replace(
      /<link rel="canonical" href="[\s\S]*?"\s*\/?>/,
      `<link rel="canonical" href="${canonical}" />`,
    );
    html = html.replace(/\s*<meta property="og:[^>]*>/g, '');
    html = html.replace(/\s*<meta property="twitter:[^>]*>/g, '');
    html = html.replace(/\s*<meta name="twitter:[^>]*>/g, '');

    const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(og.title)}" />
    <meta property="og:description" content="${escapeHtml(og.description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${ogLocale}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeHtml(og.title)}" />
    <meta property="twitter:description" content="${escapeHtml(og.description)}" />
    <meta property="twitter:image" content="${ogImage}" />
    <meta name="googlebot" content="noindex,nofollow" />
`;
    html = html.replace('</head>', `${ogTags}  </head>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
