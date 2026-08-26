import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import './i18n';
import { DemoApp } from './demo/DemoApp.tsx';

const isDemoRoute = /^\/demo(\/|$)/.test(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      {isDemoRoute ? <DemoApp /> : <App />}
    </HelmetProvider>
  </StrictMode>,
);
