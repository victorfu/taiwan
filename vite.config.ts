import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'atlas-development-entry',
      configureServer(server) {
        // public/index.html also serves as the buildless Python-server entry.
        server.middlewares.use((request, _response, next) => {
          request.url = request.url?.replace(/^\/index\.html(?=\?|$)/, '/');
          next();
        });
      }
    }
  ]
});
