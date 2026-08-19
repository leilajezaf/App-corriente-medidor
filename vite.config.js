import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', //si actualizás el código de la app, a los usuarios se les actualice automáticamente
      manifest: {
        name: 'Watt - Medidor de Corriente',
        short_name: 'Watt',
        description: 'Control de consumo de corriente y tiempo de uso',
        theme_color: '#0b1313',
        background_color: '#0b1313',
        display: 'standalone', //Oculta la barra de direcciones de Chrome/Safari para que se sienta una aplicación instalable.
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})