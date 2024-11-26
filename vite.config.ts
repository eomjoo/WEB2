import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  plugins: [react()],
  base: "/WEB2/", // 배포 시의 base 경로
  build: {
    outDir: 'dist',
  },
}));