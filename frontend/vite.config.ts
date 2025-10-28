import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  server: {
    host: true, // listen on all addresses for LAN access
    port: 5173,
    strictPort: true,
    hmr: {
      // Let Vite infer the correct HMR host when accessed via LAN IP
      protocol: 'ws',
      clientPort: 5173,
    },
  },
})
