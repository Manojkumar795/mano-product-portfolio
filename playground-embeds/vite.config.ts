import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "/playground-embeds/",
  publicDir: false,
  plugins: [react()],
  build: { outDir: fileURLToPath(new URL("../dist/client/playground-embeds", import.meta.url)), emptyOutDir: true },
});
