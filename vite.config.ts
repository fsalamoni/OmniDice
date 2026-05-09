import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/omnidice/',
  server: { port: 3000 },
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.mp3'],
});
