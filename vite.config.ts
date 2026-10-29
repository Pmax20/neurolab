import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Statischer Build (GitHub Pages, früher Neocities): relative Pfade, nur .js/.css/.html/.json-Dateien
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: (c: any) => `assets/${(c.name || 'chunk').replace(/^_+/, '').replace(/[^A-Za-z0-9-]/g, '-')}-[hash].js`,
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
} as any);
