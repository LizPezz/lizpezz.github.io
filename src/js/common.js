import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-900.css'
import '../styles/main.css'
import { resolveImages } from '../images.js'
import { initNav } from './nav.js'
import { initScribble } from './scribble.js'
import { initColorReveal } from './colorReveal.js'
import { initAnimations } from './animations.js'

// Da chiamare per ultimo in ogni pagina, dopo aver creato l'eventuale markup dinamico.
export function initCommon() {
  initNav()
  resolveImages()
  initScribble()
  initColorReveal()
  initAnimations()
}
