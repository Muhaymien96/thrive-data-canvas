import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/organizations': 'http://localhost:3100',
      '/customers': 'http://localhost:3100',
      '/businesses': 'http://localhost:3100',
      '/transactions': 'http://localhost:3100',
      '/products': 'http://localhost:3100',
      '/employees': 'http://localhost:3100',
      '/suppliers': 'http://localhost:3100'
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
