import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Deploy to minigames/philquiz/ (parallel to catspuzzle); keep source/ intact.
    outDir: '..',
    emptyOutDir: false,
  },
});
