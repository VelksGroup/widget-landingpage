import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchDemoBySlug, logDemoEvent } from './fetchDemo';
import { UniversalRenderer } from './engine/UniversalRenderer';
import type { DemoRecord } from './types';

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
      <p className="mt-3 max-w-md text-white/60">Esta demonstração não está disponível de momento.</p>
    </div>
  );
}

function DemoLoading() {
  return <div className="velks-demo-root min-h-screen bg-[#020205]" aria-busy="true" />;
}

export function DemoApp() {
  const slug = useMemo(() => extractSlug(window.location.pathname), []);
  const [demo, setDemo] = useState<DemoRecord | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchDemoBySlug(slug).then((result) => {
      if (cancelled) return;
      setDemo(result);
      if (result) logDemoEvent(result.id, 'view');
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (demo === undefined) return <DemoLoading />;
  if (demo === null) return <DemoUnavailable />;

  return (
    <div className="velks-demo-root">
      <UniversalRenderer demo={demo} />
    </div>
  );
}
