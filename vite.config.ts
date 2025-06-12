import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { defineConfig as testConfig } from "vitest/config";

const config = defineConfig({
  plugins: [react(), tailwindcss()],
});

const test = testConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.js",
  },
});

export default {
  ...config,
  ...test,
};
