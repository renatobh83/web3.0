import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Dividir bibliotecas comuns em chunks separados
          "react-vendors": ["react", "react-dom"],
          "ui-libraries": [
            "lodash",
            "date-fns",
            "dayjs",
            "react-hook-form",
            "@xyflow/react",
          ],
        },
      },
    },
  },
});
