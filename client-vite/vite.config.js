import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Pour Vercel, utiliser '/'
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
