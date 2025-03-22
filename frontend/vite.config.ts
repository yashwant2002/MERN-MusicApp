import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      "/api":{
        target:"http://localhost:8000",
        changeOrigin:true,
        rewrite : (path:string)=>path.replace(/^\/api/,"/api")
      }
    }
  },
  plugins: [react(), tailwindcss()],
})
