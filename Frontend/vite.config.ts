import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3010,
      host: '0.0.0.0',
      allowedHosts: ['stage.makemyqrcode.com'],
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8010',
          changeOrigin: true,
        },
        '/r': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8010',
          changeOrigin: true,
        },
        '/media': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8010',
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    optimizeDeps: {
      include: ['pdfjs-dist'],
    },
    worker: {
      format: 'es',
    },
  };
});
