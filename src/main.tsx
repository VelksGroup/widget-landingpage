import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import './i18n';

const isDemoRoute = /^\/demo(\/|$)/.test(window.location.pathname);

async function mount() {
  const Root = isDemoRoute
    ? (await import('./demo/DemoApp.tsx')).DemoApp
    : (await import('./App.tsx')).default;

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HelmetProvider>
        <Root />
      </HelmetProvider>
    </StrictMode>,
  );
}

mount();
