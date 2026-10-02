// Impostazioni del sito da completare quando arrivano i dati reali.

export const site = {
  // Modulo contatti. GitHub Pages è statico: serve un servizio esterno (es. Formspree, Web3Forms).
  // Incolla qui l'URL dell'endpoint; se resta vuoto si usa `email` (apre il client di posta).
  formEndpoint: '',
  email: '',

  // Opzioni del menu a tendina "OGGETTO"
  subjects: [
    'Racconti di carbone — una storia illustrata',
    'Libri di carbone — informazioni sui libri',
    'Il mio racconto — sostenere il progetto',
    'Altro',
  ],

  // Canali social: `abbr` è il segnaposto finché non arrivano le icone.
  socials: [
    { name: 'ArtStation', abbr: 'AS', href: '#' },
    { name: 'LinkedIn', abbr: 'in', href: '#' },
    { name: 'Kickstarter', abbr: 'K', href: '#' },
    { name: 'TikTok', abbr: 'TT', href: '#' },
    { name: 'Instagram', abbr: 'IG', href: '#' },
  ],
}
