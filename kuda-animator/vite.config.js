import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@animations': resolve(__dirname, './src/animations'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  }
})