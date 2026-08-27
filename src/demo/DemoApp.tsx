import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { getDemoConfig } from './mockdb';
import { GlobalDemoRenderer } from './engine/GlobalDemoRenderer';

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

export function DemoApp() {
  const slug = useMemo(() => extractSlug(window.location.pathname), []);
  const config = getDemoConfig(slug);

  if (!config) {
    return <DemoUnavailable />;
  }

  return (
    <div className="velks-demo-root min-h-screen">
      <GlobalDemoRenderer config={config} />
    </div>
  );
}
