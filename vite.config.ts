import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import history from 'connect-history-api-fallback';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["trinetradigitalstudio.onrender.com"],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: 'spa-fallback',
      configurePreviewServer(server) {
        server.middlewares.use(history());
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
