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

function cuandoBase(ev) {
  const ini = fechaLarga(ev.inicio)
  if (ev.todo_el_dia) {
    if (ev.fin && deISO(ev.fin).fecha !== deISO(ev.inicio).fecha) return `Del ${fechaCorta(ev.inicio)} al ${fechaCorta(ev.fin)}`
    return ini
  }
  const fin = ev.fin && deISO(ev.fin).fecha === deISO(ev.inicio).fecha ? ` a ${hora(ev.fin)}` : ''
  return `${ini} · ${hora(ev.inicio)}${fin}`
}

/** Inicio del día de hoy en Guatemala, en ISO */
export function inicioDeHoy() {
  return aISO(deISO(new Date().toISOString()).fecha)
}
