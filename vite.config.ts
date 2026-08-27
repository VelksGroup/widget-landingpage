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
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'gsap-vendor': ['gsap'],
            'icons-vendor': ['lucide-react'],
            'i18n-vendor': ['i18next', 'react-i18next'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'motion-vendor': ['framer-motion']
          }
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
