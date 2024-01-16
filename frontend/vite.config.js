import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync("./ssl/example.key"),
      cert: fs.readFileSync("./ssl/example.crt"),
    },
  },
  plugins: [vue()],
});
