import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://backendrest2026.onrender.com",
        changeOrigin: true,  // ← esto faltaba
      secure: true,
       cookieDomainRewrite: "localhost"
      },
    },
  },
})
