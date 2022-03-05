import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { join } from "path"

export default defineConfig({
  resolve: {
    alias: {
      '@/': join(__dirname, './src/'),
    }
  },
  plugins: [preact()],
})
