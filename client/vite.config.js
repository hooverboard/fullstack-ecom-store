import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; style-src 'self' 'unsafe-inline' https://js.stripe.com https://*.hcaptcha.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://*.hcaptcha.com; connect-src 'self' http://localhost:5000 https://api.stripe.com https://*.stripe.com https://*.hcaptcha.com; img-src 'self' data: https: http:; frame-src https://js.stripe.com https://*.stripe.com https://*.hcaptcha.com;",
    },
  },
});
