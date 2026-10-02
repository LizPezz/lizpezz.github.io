const base = import.meta.env.BASE_URL

const links = [
  ['Racconti di carbone', 'racconti'],
  ['Libri di carbone', 'libri'],
  ['Il mio racconto', 'mio-racconto'],
  ['Contatti', 'contatti'],
]

// Nel progetto grafico il menu è ripetuto in cima a ogni sezione: riempie ogni <nav data-nav>.
export function initNav() {
  const onHome = Boolean(document.getElementById('racconti'))
  document.querySelectorAll('nav[data-nav]').forEach((nav) => {
    nav.classList.add('nav')
    nav.setAttribute('aria-label', 'Sezioni del sito')
    nav.innerHTML = links
      .map(
        ([label, id], i) =>
          `<a href="${onHome ? '' : base}#${id}" data-anim="rise" style="--d:${i * 0.08}s">${label}</a>`,
      )
      .join('')
  })
}
