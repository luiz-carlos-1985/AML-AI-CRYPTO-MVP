import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  plugins: [
    react()
  ],
  customLogger: {
    info: (msg) => console.log(msg),
    warn: (msg) => console.warn(msg),
    error: (msg) => {
      // Silencia erros de proxy quando backend está offline
      if (msg.includes('http proxy error') || msg.includes('ECONNREFUSED')) {
        return;
      }
      console.error(msg);
    },
    clearScreen: () => {},
    hasErrorLogged: () => false,
    hasWarned: false,
    warnOnce: (msg) => console.warn(msg)
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    fs: {
      strict: false
    },
    middlewareMode: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            // Silencia erros de proxy quando backend está offline
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Adiciona timeout
            proxyReq.setTimeout(5000);
          });
        }
      }
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts']
        }
      }
    }
  }
});
