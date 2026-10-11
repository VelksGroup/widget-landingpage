import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchDemoBySlug, logDemoEvent } from './fetchDemo';
import { UniversalRenderer } from './engine/UniversalRenderer';
import type { DemoLoadResult } from './fetchDemo';

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

function DemoLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="velks-demo-root flex min-h-screen flex-col items-center justify-center bg-[#020205] px-6 text-center text-white" role="alert">
      <Helmet><title>Erro temporário — VELKS</title></Helmet>
      <h1 className="text-2xl font-semibold">Não foi possível carregar a demonstração</h1>
      <p className="mt-3 max-w-md text-white/70">Pode ter ocorrido uma falha temporária de ligação. Tente novamente.</p>
      <button type="button" onClick={onRetry} className="mt-6 rounded-lg bg-white px-5 py-3 font-semibold text-[#020205] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        Tentar novamente
      </button>
    </div>
  );
}

export function DemoApp() {
  const slug = useMemo(() => extractSlug(window.location.pathname), []);
  const [result, setResult] = useState<DemoLoadResult | undefined>(undefined);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetchDemoBySlug(slug, { signal: controller.signal })
      .then((loaded) => {
        if (cancelled) return;
        setResult(loaded);
        if (loaded.kind === 'found') void logDemoEvent(loaded.demo.id, 'view');
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ kind: 'error', stage: 'site', code: 'UNEXPECTED_ERROR', occurredAt: new Date().toISOString(), transient: false });
        console.warn('[demo-load]', { stage: 'site', code: 'UNEXPECTED_ERROR', occurredAt: new Date().toISOString() });
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slug, retry]);

  if (result === undefined) return <DemoLoading />;
  if (result.kind === 'not_found') return <DemoUnavailable />;
  if (result.kind === 'error') return <DemoLoadError onRetry={() => { setResult(undefined); setRetry((value) => value + 1); }} />;

  return (
    <div className="velks-demo-root">
      <UniversalRenderer demo={result.demo} />
    </div>
  );
}
