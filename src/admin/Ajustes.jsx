import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Ajustes() {
  const [a, setA] = useState(null)
  const [misas, setMisas] = useState([])
  const [borradas, setBorradas] = useState([])
  const [mensaje, setMensaje] = useState({ error: '', ok: '' })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('ajustes').select('*').eq('id', 1).maybeSingle(),
      supabase.from('horarios_misa').select('*').order('orden'),
    ]).then(([r1, r2]) => {
      if (r1.error || r2.error) return setMensaje({ error: 'No se pudieron cargar los ajustes.', ok: '' })
      setA(r1.data || { id: 1, parroco: '', horario_visita: '', aviso_horarios: '', telefono: '', correo: '' })
      setMisas(r2.data)
    })
  }, [])

  const cambiar = (campo) => (e) => setA((x) => ({ ...x, [campo]: e.target.value }))
  const cambiarMisa = (i, campo, valor) => setMisas((l) => l.map((m, j) => (j === i ? { ...m, [campo]: valor } : m)))
  const mover = (i, d) =>
    setMisas((l) => {
      const n = [...l]
      const j = i + d
      if (j < 0 || j >= n.length) return l
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
  const quitar = (i) =>
    setMisas((l) => {
      if (l[i].id) setBorradas((b) => [...b, l[i].id])
      return l.filter((_, j) => j !== i)
    })

  async function guardar(e) {
    e.preventDefault()
    if (!a.parroco.trim()) return setMensaje({ error: 'Escribe el nombre del párroco.', ok: '' })
    if (misas.some((m) => !m.dias.trim() || !m.hora.trim())) return setMensaje({ error: 'Cada horario necesita días y hora.', ok: '' })
    setGuardando(true)
    const { id, actualizado_en, ...campos } = a
    const errores = []
    const r = await supabase.from('ajustes').update(campos).eq('id', 1)
    if (r.error) errores.push(r.error)
    if (borradas.length) {
      const d = await supabase.from('horarios_misa').delete().in('id', borradas)
      if (d.error) errores.push(d.error)
    }
    const nuevas = [...misas]
    for (const [i, m] of nuevas.entries()) {
      const datos = { orden: i + 1, dias: m.dias.trim(), hora: m.hora.trim(), detalle: (m.detalle || '').trim() }
      const q = m.id ? supabase.from('horarios_misa').update(datos).eq('id', m.id) : supabase.from('horarios_misa').insert(datos).select().single()
      const res = await q
      if (res.error) errores.push(res.error)
      else if (!m.id && res.data) nuevas[i] = res.data
    }
    setGuardando(false)
    setBorradas([])
    setMisas(nuevas)
    setMensaje(errores.length ? { error: 'Algunos cambios no se guardaron. Inténtalo de nuevo.', ok: '' } : { error: '', ok: 'Ajustes guardados. El sitio ya muestra los cambios.' })
  }

  if (!a) return <section className="adm-pagina">{mensaje.error ? <p className="adm-error">{mensaje.error}</p> : <p className="adm-vacio">Cargando…</p>}</section>

  return (
    <section className="adm-pagina">
      <header className="adm-cabecera">
        <div>
          <h1>Ajustes del sitio</h1>
          <p>Estos datos aparecen en las páginas de Visita, Celebraciones, Contacto y Donar.</p>
        </div>
      </header>

      <form className="adm-form adm-form--ancho" onSubmit={guardar}>
        <fieldset>
          <legend>Santuario</legend>
          <label className="adm-campo">
            <span>Párroco</span>
            <input value={a.parroco} onChange={cambiar('parroco')} maxLength={80} />
          </label>
          <div className="adm-fila">
            <label className="adm-campo">
              <span>Teléfono</span>
              <input value={a.telefono} onChange={cambiar('telefono')} maxLength={40} />
            </label>
            <label className="adm-campo">
              <span>Correo</span>
              <input type="email" value={a.correo} onChange={cambiar('correo')} maxLength={160} />
            </label>
          </div>
          <label className="adm-campo">
            <span>Horario de visita</span>
            <input value={a.horario_visita} onChange={cambiar('horario_visita')} maxLength={120} />
          </label>
          <label className="adm-campo">
            <span>Aviso debajo de los horarios</span>
            <textarea rows={2} value={a.aviso_horarios} onChange={cambiar('aviso_horarios')} maxLength={300} />
          </label>
        </fieldset>

        <fieldset>
          <legend>Horarios de misa</legend>
          {misas.map((m, i) => (
            <div key={m.id || `n${i}`} className="adm-misa">
              <div className="adm-fila">
                <label className="adm-campo">
                  <span>Días</span>
                  <input value={m.dias} onChange={(e) => cambiarMisa(i, 'dias', e.target.value)} maxLength={60} />
                </label>
                <label className="adm-campo">
                  <span>Hora</span>
                  <input value={m.hora} onChange={(e) => cambiarMisa(i, 'hora', e.target.value)} maxLength={60} />
                </label>
              </div>
              <label className="adm-campo">
                <span>Detalle</span>
                <input value={m.detalle || ''} onChange={(e) => cambiarMisa(i, 'detalle', e.target.value)} maxLength={300} />
              </label>
              <div className="adm-misa__acciones">
                <button type="button" className="adm-btn adm-btn--chico" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Subir">
                  ↑
                </button>
                <button type="button" className="adm-btn adm-btn--chico" onClick={() => mover(i, 1)} disabled={i === misas.length - 1} aria-label="Bajar">
                  ↓
                </button>
                <button type="button" className="adm-btn adm-btn--chico adm-btn--peligro" onClick={() => quitar(i)}>
                  Quitar
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="adm-btn" onClick={() => setMisas((l) => [...l, { dias: '', hora: '', detalle: '' }])}>
            + Agregar horario
          </button>
        </fieldset>

        {mensaje.error && <p className="adm-error">{mensaje.error}</p>}
        {mensaje.ok && <p className="adm-ok">{mensaje.ok}</p>}
        <div className="adm-botones">
          <button className="adm-btn adm-btn--primario" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar ajustes'}
          </button>
        </div>
      </form>
    </section>
  )
}
