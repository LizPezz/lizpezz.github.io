import { placeholder } from './js/placeholder.js'

// Elenco di TUTTE le immagini del sito.
// Per sostituire un segnaposto: copia il file in `public/images/` e scrivi il percorso in `src`,
// es.  'hero-bozza': { src: 'images/hero-bozza.jpg', ... }
// Finché `src` è null viene disegnato un segnaposto con etichetta e dimensioni consigliate.
// tone: 'sketch' (bozza a matita) | 'color' (versione a colori) | 'dark' (illustrazione scura) | 'line' (disegno al tratto, sfondo trasparente)
export const images = {
  // Home — hero: stessa inquadratura, bozza + versione colorata
  'hero-bozza': { src: 'images/mio/mina-bozza.webp', label: 'Hero - bozza', w: 1920, h: 1080, tone: 'sketch' },
  'hero-colore': { src: 'images/mio/mina-colore.webp', label: 'Hero - colore', w: 1920, h: 1080, tone: 'color' },

  // Home — Racconti di carbone (carosello)
  'racconto-wyder': { src: "images/Wyder/Character.webp", label: 'Wyder - Il guardiano del faro', w: 1000, h: 1250, tone: 'dark' },
  'racconto-nappy': { src: 'images/Nappy/Cha-flashart.webp', label: 'Nappy, il dormiglione', w: 1000, h: 1250, tone: 'color' },
  'racconto-3': { src: null, label: 'Racconto 3', w: 1000, h: 1250, tone: 'dark' },
  'racconto-4': { src: null, label: 'Racconto 4', w: 1000, h: 1250, tone: 'sketch' },
  'racconto-5': { src: null, label: 'Racconto 5', w: 1000, h: 1250, tone: 'color' },

  // Home — Libri di carbone (copertina e retro sul modello 3D)
  'libro-assaporando': { src: 'images/libri/assaporando-fronte.webp', label: 'Assaporando il viaggio', w: 1131, h: 1600, tone: 'color' },
  'libro-assaporando-retro': { src: 'images/libri/assaporando-retro.webp', label: 'Assaporando il viaggio - retro', w: 1128, h: 1600, tone: 'color' },
  'libro-elefante': { src: 'images/libri/elefante-fronte.webp', label: 'Il mio elefante e leggero', w: 1090, h: 1600, tone: 'sketch' },
  'libro-elefante-retro': { src: 'images/libri/elefante-retro.webp', label: 'Il mio elefante e leggero - retro', w: 1105, h: 1600, tone: 'sketch' },
  'libro-formicaio': { src: 'images/libri/formicaio-fronte.webp', label: 'Storia di un formicaio', w: 1150, h: 1600, tone: 'dark' },
  'libro-formicaio-retro': { src: 'images/libri/formicaio-retro.webp', label: 'Storia di un formicaio - retro', w: 1150, h: 1600, tone: 'dark' },

  // Home — Il mio racconto
  enea: { src: 'images/mio/destriero-bozza.webp', label: 'Disegno Enea', w: 1920, h: 1080, tone: 'line' },

  // Racconto "Wyder, il guardiano del faro"
  'wyder-1': { src: "images/Wyder/Storyboard_01.webp", label: 'Wyder - cap. 1', w: 1920, h: 1300, tone: 'dark' },
  'wyder-2': { src: "images/Wyder/Environnement-INDOOR.webp", label: 'Wyder - cap. 2', w: 1920, h: 1300, tone: 'dark' },
  'wyder-3': { src: "images/Wyder/Character.webp", label: '', w: 1920, h: 2000, tone: 'dark' },

  // Racconto "Nappy, il dormiglione"
  'nappy-1': { src: 'images/Nappy/storyboard.webp', label: 'Nappy - cap. 1', w: 2400, h: 1350, tone: 'dark' },
  'nappy-2': { src: 'images/Nappy/storyboard-4.webp', label: 'Nappy - cap. 2', w: 1414, h: 2000, tone: 'color' },
  'nappy-3': { src: 'images/Nappy/Cha-flashart.webp', label: 'Nappy - cap. 3', w: 1414, h: 2000, tone: 'color' },

  // Galleria de "Il mio racconto": una diapositiva per illustrazione, tutte 1920x1080.
  // "-bozza" = lineart / schizzo, "-colore" = versione che si dipinge col mouse
  'galleria-ritratto': { src: 'images/mio/ritratto-enea.webp', label: 'Ritratto di Enea', w: 1920, h: 1080, tone: 'line' },
  'galleria-arco-bozza': { src: 'images/mio/arco-bozza.webp', label: 'Enea usa il suo arco - bozza', w: 1920, h: 1080, tone: 'line' },
  'galleria-arco-colore': { src: 'images/mio/arco-colore.webp', label: 'Enea usa il suo arco - colore', w: 1920, h: 1080, tone: 'color' },
  'galleria-festa': { src: 'images/mio/festa-bozza.webp', label: 'Enea e Mina guardano il villaggio in festa', w: 1920, h: 1080, tone: 'line' },
  'galleria-danza-bozza': { src: 'images/mio/danza-bozza.webp', label: 'Danza degli uomini bestia - bozza', w: 1920, h: 1080, tone: 'line' },
  'galleria-danza-colore': { src: 'images/mio/danza-colore.webp', label: 'Danza degli uomini bestia - colore', w: 1920, h: 1080, tone: 'color' },
  'galleria-duca': { src: 'images/mio/duca-bozza.webp', label: 'Duca conduce Enea al laboratorio abbandonato', w: 1920, h: 1080, tone: 'line' },
  'galleria-enea': { src: 'images/mio/enea-colore.webp', label: 'Enea', w: 1920, h: 1080, tone: 'color' },
  'galleria-lago-bozza': { src: 'images/mio/lago-bozza.webp', label: 'Enea cade nel lago - bozza', w: 1920, h: 1080, tone: 'line' },
  'galleria-lago-colore': { src: 'images/mio/lago-colore.webp', label: 'Enea cade nel lago - colore', w: 1920, h: 1080, tone: 'dark' },
  'galleria-eep': { src: 'images/mio/eep-bozza.webp', label: 'Eep riposa nella memoria di Kaede', w: 1920, h: 1080, tone: 'line' },
  'galleria-kaede-bozza': { src: 'images/mio/kaede-bozza.webp', label: 'Kaede leader della ribellione - bozza', w: 1920, h: 1080, tone: 'line' },
  'galleria-kaede-colore': { src: 'images/mio/kaede-colore.webp', label: 'Kaede leader della ribellione - colore', w: 1920, h: 1080, tone: 'color' },
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
