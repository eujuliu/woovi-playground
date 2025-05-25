import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "**/*.{ts,js}",
    ".env.example",
    "!node_modules",
    "!__tests__",
    "!schema",
    "!dist",
    "!.turbo",
    "!*.config.*",
    "!babelBarrel.js",
  ],
  clean: true,
  loader: {
    ".env.example": "copy",
  },
});
