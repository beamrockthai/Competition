import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// https://vitejs.dev/config/
export default defineConfig({
  https: true,
  plugins: [react(), mkcert()],
  define: {
    "process.env": {},
  },
  server: {
    watch: {
      usePolling: true, // บังคับให้ Vite ตรวจจับการเปลี่ยนแปลงของไฟล์
    },
    strictPort: true, // ป้องกันการเปลี่ยนพอร์ตอัตโนมัติ
    port: 5173, // กำหนดพอร์ตชัดเจน
  },
});
