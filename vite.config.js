import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // 캐싱할 정적 파일
      manifest: {
        name: 'FE Performance Lab',
        short_name: 'FE Lab',
        description: '프론트엔드 성능 최적화 실험실',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            "src": "android/android-launchericon-192-192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "android/android-launchericon-512-512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "android/android-launchericon-512-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
})