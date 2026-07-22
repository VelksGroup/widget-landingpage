import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Compression
  app.use(compression());

  // Security Headers (Enterprise)
  app.use(helmet({
    contentSecurityPolicy: false, // Disabling default CSP to avoid breaking inline scripts from Vite
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    xFrameOptions: { action: 'deny' },
    xContentTypeOptions: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    permittedCrossDomainPolicies: { permittedPolicies: 'none' }
  }));

  app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });

  // API proxy route for Orion
  app.use("/orion-api", async (req, res) => {
    try {
      const url = `https://orion-capture-widget.vercel.app${req.url}`;
      
      const headers = { ...req.headers };
      delete headers.host;
      delete headers.origin;
      delete headers.referer;
      delete headers.connection;
      delete headers["keep-alive"];
      delete headers["transfer-encoding"];
      delete headers["upgrade"];
      delete headers["expect"];
      delete headers["accept-encoding"];
      
      const response = await fetch(url, {
        method: req.method,
        headers: headers as any,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      });
      
      const data = await response.text();
      response.headers.forEach((value, key) => {
        if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });
      res.status(response.status).send(data);
    } catch (e) {
      console.error('Proxy error:', e);
      res.status(500).json({ error: 'Proxy fetch failed' });
    }
  });

  // SEO: robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Sitemap: https://velks.space/sitemap.xml
`);
  });

  // SEO: sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://velks.space/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="https://velks.space/?lang=pt" />
    <xhtml:link rel="alternate" hreflang="en" href="https://velks.space/?lang=en" />
    <xhtml:link rel="alternate" hreflang="es" href="https://velks.space/?lang=es" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://velks.space/?lang=fr" />
    <xhtml:link rel="alternate" hreflang="de" href="https://velks.space/?lang=de" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://velks.space/" />
  </url>
</urlset>`);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { maxAge: '1y' }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
