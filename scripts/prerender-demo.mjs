import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
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
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

async function main() {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found — run "vite build" before prerendering demo pages.');
  }

  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true },
  });

  let demoRegistry;
  try {
    const mod = await vite.ssrLoadModule('/src/demo/mockdb/index.ts');
    demoRegistry = mod.demoRegistry;
  } finally {
    await vite.close();
  }

  const slugs = Object.keys(demoRegistry ?? {});
  if (slugs.length === 0) {
    console.log('[prerender-demo] no demo companies found in src/demo/companies — skipping.');
    return;
  }

  const template = fs.readFileSync(indexPath, 'utf-8');

  for (const slug of slugs) {
    const config = demoRegistry[slug];
    const canonical = `${SITE_URL}/demo/${slug}`;
    const ogImage = resolveAbsoluteUrl(config.og.image);
    const title = config.og.title;
    const description = config.og.description;
    const locale = (config.locale || 'pt-PT').replace('-', '_');

    let html = template;

    // The landing preloads assets (hero video, logo) that bespoke demo templates don't use.
    html = html.replace(/\s*<link rel="preload" href="\/demo-video\.mp4"[^>]*>/, '');
    html = html.replace(/\s*<link rel="preload" href="\/velks-logo\.png"[^>]*>/, '');

    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
    html = html.replace(
      /<meta name="description" content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    );
    html = html.replace(
      /<meta name="robots" content="[\s\S]*?"\s*\/?>/,
      '<meta name="robots" content="noindex,nofollow">',
    );
    html = html.replace(
      /<link rel="canonical" href="[\s\S]*?"\s*\/?>/,
      `<link rel="canonical" href="${canonical}" />`,
    );

    // Strip existing OG/Twitter tags from the base template so we can insert a clean, demo-specific set.
    html = html.replace(/\s*<meta property="og:[^>]*>/g, '');
    html = html.replace(/\s*<meta property="twitter:[^>]*>/g, '');
    html = html.replace(/\s*<meta name="twitter:[^>]*>/g, '');

    const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${locale}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeHtml(title)}" />
    <meta property="twitter:description" content="${escapeHtml(description)}" />
    <meta property="twitter:image" content="${ogImage}" />
    <meta name="googlebot" content="noindex,nofollow" />
`;
    html = html.replace('</head>', `${ogTags}  </head>`);

    const outDir = path.join(distDir, 'demo', slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
    console.log(`[prerender-demo] generated dist/demo/${slug}/index.html`);
  }
}

main().catch((err) => {
  console.error('[prerender-demo] failed:', err);
  process.exit(1);
});
