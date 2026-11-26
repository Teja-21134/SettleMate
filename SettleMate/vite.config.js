
import { env } from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: env.VERCEL ? '/' : '/SettleMate/',
  plugins: [react(), tailwindcss()],
})
