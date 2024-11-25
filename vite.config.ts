import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/WEB2/' : '/', // 배포 시에만 base를 설정
  build: {
    outDir: 'dist',
  },
}));