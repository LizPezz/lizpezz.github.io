import { placeholder } from './js/placeholder.js'

// Elenco di TUTTE le immagini del sito.
// Per sostituire un segnaposto: copia il file in `public/images/` e scrivi il percorso in `src`,
// es.  'hero-bozza': { src: 'images/hero-bozza.jpg', ... }
// Finché `src` è null viene disegnato un segnaposto con etichetta e dimensioni consigliate.
// tone: 'sketch' (bozza a matita) | 'color' (versione a colori) | 'dark' (illustrazione scura) | 'line' (disegno al tratto, sfondo trasparente)
export const images = {
  // Home — hero: stessa inquadratura, bozza + versione colorata
  'hero-bozza': { src: null, label: 'Hero - bozza', w: 1100, h: 1500, tone: 'sketch' },
  'hero-colore': { src: null, label: 'Hero - colore', w: 1100, h: 1500, tone: 'color' },

  // Home — Racconti di carbone (carosello)
  'racconto-wyder': { src: "images/Wyder/Character.png", label: 'Wyder - Il guardiano del faro', w: 1000, h: 1250, tone: 'dark' },
  'racconto-2': { src: null, label: 'Racconto 2', w: 1000, h: 1250, tone: 'color' },
  'racconto-3': { src: null, label: 'Racconto 3', w: 1000, h: 1250, tone: 'dark' },
  'racconto-4': { src: null, label: 'Racconto 4', w: 1000, h: 1250, tone: 'sketch' },
  'racconto-5': { src: null, label: 'Racconto 5', w: 1000, h: 1250, tone: 'color' },

  // Home — Libri di carbone (copertine sul modello 3D)
  'libro-assaporando': { src: null, label: 'Assaporando il viaggio', w: 840, h: 1200, tone: 'color' },
  'libro-elefante': { src: null, label: 'Il mio elefante e leggero', w: 840, h: 1200, tone: 'sketch' },
  'libro-formicaio': { src: null, label: 'Storia di un formicaio', w: 840, h: 1200, tone: 'dark' },

  // Home — Il mio racconto
  enea: { src: null, label: 'Disegno Enea', w: 1200, h: 1200, tone: 'line' },

  // Racconto "Wyder, il guardiano del faro"
  'wyder-1': { src: "images/Wyder/Storyboard_01.png", label: 'Wyder - cap. 1', w: 1920, h: 1300, tone: 'dark' },
  'wyder-2': { src: "images/Wyder/Environnement-INDOOR.png", label: 'Wyder - cap. 2', w: 1920, h: 1300, tone: 'dark' },
  'wyder-3': { src: "images/Wyder/Character.png", label: '', w: 1920, h: 2000, tone: 'dark' },

  // Galleria de "Il mio racconto"
  'galleria-mina-bozza': { src: null, label: 'Mina - bozza', w: 1000, h: 1400, tone: 'sketch' },
  'galleria-mina-colore': { src: null, label: 'Mina - colore', w: 1000, h: 1400, tone: 'color' },
  'galleria-mondo': { src: null, label: 'Il mondo e meraviglioso', w: 1000, h: 900, tone: 'sketch' },
  'galleria-duca-bozza': { src: null, label: 'Duca - bozza', w: 1200, h: 1400, tone: 'sketch' },
  'galleria-duca-colore': { src: null, label: 'Duca - colore', w: 1200, h: 1400, tone: 'color' },
  'galleria-musica': { src: null, label: 'Musica per il figlio di Eva', w: 1600, h: 1000, tone: 'line' },
}

export function imageUrl(key) {
  const img = images[key]
  if (!img) throw new Error(`Immagine sconosciuta: ${key}`)
  return img.src ? import.meta.env.BASE_URL + img.src : placeholder(img)
}

// Assegna il src a tutti gli <img data-img="chiave">
export function resolveImages(root = document) {
  root.querySelectorAll('img[data-img]').forEach((el) => {
    el.src = imageUrl(el.dataset.img)
  })
}
