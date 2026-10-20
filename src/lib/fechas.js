/** Fechas siempre en hora de Guatemala (UTC-6, sin horario de verano). */
const ZONA = 'America/Guatemala'
const OFFSET = '-06:00'

/** "2026-07-16" + "19:30" → ISO en UTC */
export function aISO(fecha, hora = '00:00') {
  if (!fecha) return null
  return new Date(`${fecha}T${hora || '00:00'}:00${OFFSET}`).toISOString()
}

/** ISO → { fecha: 'AAAA-MM-DD', hora: 'HH:MM' } en hora de Guatemala */
export function deISO(iso) {
  if (!iso) return { fecha: '', hora: '' }
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: ZONA,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(iso))
      .map((x) => [x.type, x.value]),
  )
  return { fecha: `${p.year}-${p.month}-${p.day}`, hora: `${p.hour}:${p.minute}` }
}

const fmt = (opts) => new Intl.DateTimeFormat('es-GT', { timeZone: ZONA, ...opts })

export const diaNumero = (iso) => fmt({ day: 'numeric' }).format(new Date(iso))
export const mesCorto = (iso) => fmt({ month: 'short' }).format(new Date(iso)).replace('.', '')
export const fechaLarga = (iso) => fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
export const fechaCorta = (iso) => fmt({ day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
export const hora = (iso) => fmt({ hour: 'numeric', minute: '2-digit', hour12: false }).format(new Date(iso)) + ' h'

const mayus = (t) => t.charAt(0).toUpperCase() + t.slice(1)

/** Texto de cuándo es un evento: "jueves, 16 de julio de 2026 · 19:00 h" */
export function cuando(ev) {
  return mayus(cuandoBase(ev))
}

/** "2026-07-16" → "2026-07-17" (día calendario siguiente) */
export function diaSiguiente(fecha) {
  const d = new Date(`${fecha}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

const horaSola = (iso) => hora(iso).replace(/ h$/, '')

function cuandoBase(ev) {
  const ini = fechaLarga(ev.inicio)
  const diaIni = deISO(ev.inicio).fecha
  const diaFin = ev.fin ? deISO(ev.fin).fecha : ''
  if (ev.todo_el_dia) {
    if (diaFin && diaFin !== diaIni) return `Del ${fechaCorta(ev.inicio)} al ${fechaCorta(ev.fin)}`
    return ini
  }
  if (!diaFin) return `${ini} · ${hora(ev.inicio)}`
  if (diaFin === diaIni) return `${ini} · ${horaSola(ev.inicio)} a ${hora(ev.fin)}`
  // Termina pasada la medianoche (una vigilia, por ejemplo)
  if (diaFin === diaSiguiente(diaIni)) return `${ini} · ${horaSola(ev.inicio)} a ${hora(ev.fin)} del día siguiente`
  return `Del ${fechaCorta(ev.inicio)}, ${hora(ev.inicio)} al ${fechaCorta(ev.fin)}, ${hora(ev.fin)}`
}

/** Inicio del día de hoy en Guatemala, en ISO */
export function inicioDeHoy() {
  return aISO(deISO(new Date().toISOString()).fecha)
}
