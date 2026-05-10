/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    globals: true, // use describe/it/expect without import
    include: ['src/**/__tests__/**/*.{spec,test}.{ts,tsx}', 'tests/**/*.{spec,test}.{ts,tsx}'],
  },
});
