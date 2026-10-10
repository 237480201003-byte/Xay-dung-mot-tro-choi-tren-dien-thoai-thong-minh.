import { defineConfig } from 'vitest/config'

export default defineConfig(({ command }) => ({
  // The desktop build loads dist/index.html straight off the filesystem, so a built
  // bundle needs relative asset paths. The GitHub Pages build is served from a
  // subpath, so CI sets PAGES_BASE. The Capacitor/Android build ships the dist
  // folder into the APK assets, so the same relative-path rule applies there too:
  // Capacitor serves it from a synthetic https://localhost origin where the
  // Android WebView expects relative URLs to resolve against the index.html.
  base: process.env.PAGES_BASE ?? (command === 'build' ? './' : '/'),
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
}))
