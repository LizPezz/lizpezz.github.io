const base = import.meta.env.BASE_URL

// Racconti del carosello "Racconti di carbone".
// `href: null` = racconto non ancora pubblicato (il pulsante non viene mostrato).
export const stories = [
  {
    image: 'racconto-wyder',
    title: 'Wyder,<br>il guardiano<br>del faro',
    subtitle: 'Concept art e storyboard',
    href: base + 'racconti/wyder.html',
  },
  {
    image: 'racconto-nappy',
    title: 'Nappy,<br>il dormiglione',
    subtitle: 'Concept art e storyboard',
    href: base + 'racconti/nappy.html',
  },
  { image: 'racconto-3', title: 'Titolo<br>del racconto', subtitle: 'Descrizione del racconto', href: null },
  { image: 'racconto-4', title: 'Titolo<br>del racconto', subtitle: 'Descrizione del racconto', href: null },
  { image: 'racconto-5', title: 'Titolo<br>del racconto', subtitle: 'Descrizione del racconto', href: null },
]

// Libri della sezione "Libri di carbone", sfogliabili.
// Le pagine sono in public/images/libri/<slug>/00.webp … (00 = copertina, l'ultima = retro);
// `pages` è quante sono.
export const books = [
  { title: 'Assaporando il viaggio', slug: 'assaporando', pages: 18 },
  { title: 'Il mio elefante e’ leggero', slug: 'elefante', pages: 12 },
  { title: 'Storia di un formicaio', slug: 'formicaio', pages: 12 },
]
