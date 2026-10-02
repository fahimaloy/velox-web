import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    /**
     * `next-intl/server` reads its locale from React's server-request context,
     * which does not exist in a plain Node test. Stubbing it here keeps the
     * content tests focused on content — they import the registry, not the
     * rendering path.
     */
    alias: {
      "next-intl/server": new URL("./tests/stubs/next-intl-server.ts", import.meta.url).pathname,
    },
  },
});
