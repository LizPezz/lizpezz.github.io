import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const page = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  // Il repo è "lizpezz.github.io" (sito utente), quindi il sito vive alla radice del dominio.
  base: '/',
  build: {
    chunkSizeWarningLimit: 700, // three.js è in un chunk separato, caricato solo quando serve
    rollupOptions: {
      input: {
        home: page('./index.html'),
        galleria: page('./galleria.html'),
        wyder: page('./racconti/wyder.html'),
      },
    },
  },
})
