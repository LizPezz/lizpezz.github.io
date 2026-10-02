import { site } from '../config.js'

export function initContact() {
  const form = document.getElementById('contact-form')
  if (!form) return
  const status = form.querySelector('.form__status')

  form.querySelector('select[name="oggetto"]').append(
    ...site.subjects.map((s) => Object.assign(document.createElement('option'), { textContent: s })),
  )

  document.querySelector('.socials').innerHTML = site.socials
    .map((s) => `<a href="${s.href}" aria-label="${s.name}" title="${s.name}">${s.abbr}</a>`)
    .join('')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = new FormData(form)

    if (site.formEndpoint) {
      status.textContent = 'Invio in corso…'
      try {
        const res = await fetch(site.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        if (!res.ok) throw new Error(res.statusText)
        form.reset()
        status.textContent = 'Grazie! Ti risponderò entro una settimana.'
      } catch {
        status.textContent = 'Invio non riuscito, riprova più tardi.'
      }
    } else if (site.email) {
      const body = `${data.get('richiesta')}\n\n${data.get('nome')} — ${data.get('email')}`
      location.href = `mailto:${site.email}?subject=${encodeURIComponent(data.get('oggetto'))}&body=${encodeURIComponent(body)}`
    } else {
      status.textContent = 'Modulo non ancora collegato: imposta formEndpoint o email in src/config.js.'
    }
  })
}
