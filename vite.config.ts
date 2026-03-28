import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isAnalyze = process.env.ANALYZE === 'true';

  return {
    plugins: [
      react(),
      tailwindcss(),
      compression({ algorithms: ['gzip'] }),
      compression({ algorithms: ['brotliCompress'] }),
      isAnalyze ? visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: false }) : null,
    ].filter(Boolean),
    define: {},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('react') || id.includes('scheduler')) {
              return 'react-core';
            }

            if (id.includes('motion')) {
              return 'motion';
            }

            if (id.includes('lucide-react')) {
              return 'icons';
            }

            if (id.includes('@supabase')) {
              return 'supabase';
            }

            return 'vendor';
          },
        },
      },
    },
  };
});
