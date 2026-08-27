import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Vite's shared dynamic-import() runtime helper must never be homed inside a
            // heavy vendor chunk (e.g. three-vendor) — every chunk with a dynamic import
            // needs it, which would otherwise force-load that vendor's bytes everywhere.
            if (id.includes('vite/preload-helper')) return 'app-runtime';
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor';
            if (id.includes('node_modules/gsap')) return 'gsap-vendor';
            if (id.includes('node_modules/lucide-react')) return 'icons-vendor';
            if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'i18n-vendor';
            if (
              id.includes('node_modules/three') ||
              id.includes('node_modules/@react-three/fiber') ||
              id.includes('node_modules/@react-three/drei')
            ) {
              return 'three-vendor';
            }
            if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion-vendor';
            if (id.includes('node_modules/@supabase')) return 'supabase-vendor';
            return undefined;
          },
        }
      },
      chunkSizeWarningLimit: 1000
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/orion-api': {
          target: 'https://orion-capture-widget.vercel.app',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/orion-api/, '')
        }
      }
    },
  };
});
