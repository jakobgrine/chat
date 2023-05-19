import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  root: "client",
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    sourcemap: true,
  },
});
