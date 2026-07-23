import React, { useEffect, useState } from 'react';

export function OrionWidget() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('velks-cookie-consent');

    if (consent) {
      // Cenário B: Cookie banner já aceite anteriormente
      let timeoutId: NodeJS.Timeout;
      
      const handleScroll = () => {
        setShouldLoad(true);
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };

      // Aguarda 3 segundos ou primeiro scroll
      timeoutId = setTimeout(() => {
        setShouldLoad(true);
        window.removeEventListener('scroll', handleScroll);
      }, 3000);

      window.addEventListener('scroll', handleScroll, { once: true });

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // Cenário A: Banner de cookies visível
      const handleConsentResolved = () => {
        // Após aceitar/recusar, aguarda ~2000ms
        setTimeout(() => {
          setShouldLoad(true);
        }, 2000);
      };

      window.addEventListener('cookieConsentResolved', handleConsentResolved, { once: true });

      return () => {
        window.removeEventListener('cookieConsentResolved', handleConsentResolved);
      };
    }
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    // Injeta o script
    const script = document.createElement('script');
    script.src = 'https://orion-capture-widget.vercel.app/orion-widget.js';
    script.dataset.tenantId = 'velks_orion';
    script.dataset.publicKey = 'velks_public_orion_001';
    script.dataset.apiBaseUrl = 'https://orion-capture-widget.vercel.app';
    script.dataset.avatarUrl = 'https://orion-capture-widget.vercel.app//orion-avatar.png';
    script.dataset.debug = 'true';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Se necessário remover o script no desmonte, embora geralmente ele fique na página.
      // E remover o container do widget se existir
      const orionContainer = document.getElementById('orion-widget-container');
      if (orionContainer) {
        orionContainer.remove();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [shouldLoad]);

  return null;
}
