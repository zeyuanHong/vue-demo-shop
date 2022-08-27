import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { // 本地服务器配置
    proxy: { // 配置服务器代理
      '/dapi': { // 路由带有/dapid 就启用代理
        target: "https://8i98.com", 
        changeOrigin: true, // 请求头的origin属性和target属性值一致
      }
    }
  }
})