// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json'
    }),
  ],
  build: {
    lib: {
      entry: './src/index.tsx',
      name: 'index',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'reactDOM',
          'react/jsx-runtime': 'react/jsx-runtime'
        }
      }
    }
  }
})