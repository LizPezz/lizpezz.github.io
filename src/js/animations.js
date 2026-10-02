// Animazioni d'entrata/uscita allo scroll.
// Ogni elemento con [data-anim] riceve .is-in quando entra nel viewport,
// .is-out quando esce dall'alto; il resto lo fa il CSS (vedi main.css).
//
//   rise     "in salita"            (1.0s entrata, 0.5s uscita)
//   fade     "dissolvenza"
//   wipe     "lineare da sx a dx"
//   type     "battitura a macchina" parola per parola (data-speed="fast" = veloce)
//   pop      "comparsa"
//   scribble "schizzo / scarabocchio" (vedi scribble.js)

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// Avvolge ogni parola in uno <span class="w"> numerato, conservando il markup interno.
function splitWords(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  let i = 0
  for (const node of nodes) {
    if (!node.nodeValue.trim()) continue
    const frag = document.createDocumentFragment()
    for (const part of node.nodeValue.split(/(\s+)/)) {
      if (!part) continue
      if (/^\s+$/.test(part)) {
        frag.append(part)
        continue
      }
      const span = document.createElement('span')
      span.className = 'w'
      span.style.setProperty('--i', i++)
      span.textContent = part
      frag.append(span)
    }
    node.replaceWith(frag)
  }
}

export function initAnimations() {
  document.querySelectorAll('[data-anim="type"]').forEach(splitWords)

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target
        if (e.isIntersecting) {
          el.classList.remove('is-out')
          el.classList.add('is-in')
          el.dispatchEvent(new CustomEvent('anim:in'))
        } else if (el.classList.contains('is-in')) {
          el.classList.remove('is-in')
          if (e.boundingClientRect.top < 0) el.classList.add('is-out')
        }
      }
    },
    // margine solo in basso: il menu in cima a una sezione deve restare visibile dopo un salto ad ancora
    { rootMargin: '0px 0px -8% 0px' },
  )
  document.querySelectorAll('[data-anim]').forEach((el) => io.observe(el))
}
