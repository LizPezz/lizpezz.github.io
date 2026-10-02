# Liz Pezz — Storie di Carbone

Sito portfolio. Vite + JavaScript vanilla, three.js per il modello 3D.

## Comandi

```bash
npm install      # solo la prima volta
npm run dev      # sviluppo su http://localhost:5173
npm run build    # genera la cartella dist/
```

## Pagine

- `index.html` — home (hero, intro, Racconti / Libri di carbone, Il mio racconto, Contatti)
- `racconti/wyder.html` — racconto "Wyder, il guardiano del faro"
- `galleria.html` — galleria de "Il mio racconto"

## Sostituire un'immagine segnaposto

1. Copia il file in `public/images/` (es. `public/images/hero-bozza.jpg`).
2. In `src/images.js` scrivi il percorso nella riga corrispondente:
   `'hero-bozza': { src: 'images/hero-bozza.jpg', ... }`

Le coppie bozza/colore (`hero-*`, `galleria-mina-*`, `galleria-duca-*`) devono avere la stessa inquadratura e le stesse proporzioni.

## Dove si cambia cosa

- `src/config.js` — modulo contatti (endpoint o email), voci del menu "Oggetto", link social
- `src/data/stories.js` — racconti del carosello e libri
- `src/styles/main.css` — stili; le animazioni sono nel blocco "Animazioni"
- `src/js/` — animazioni: `animations.js` (salita, dissolvenza, lineare, battitura, comparsa), `scribble.js` (scarabocchio), `colorReveal.js` (colore col mouse), `carousel.js`
- `src/three/book.js` — scena three.js

## Deploy

Ogni push su `main` pubblica il sito tramite `.github/workflows/deploy.yml`.
Su GitHub: Settings → Pages → Source: **GitHub Actions** (da fare una volta sola).
