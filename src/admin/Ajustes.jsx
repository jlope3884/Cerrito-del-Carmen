import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { mensajeError } from '../lib/errores.js'
import { useAvisoSinGuardar } from './sinGuardar.js'

const CAMPOS = ['parroco', 'horario_visita', 'aviso_horarios', 'telefono', 'correo']
const AJUSTES_VACIOS = { parroco: '', horario_visita: '', aviso_horarios: '', telefono: '', correo: '' }

// Clave estable para las filas nuevas (sin id todavía) mientras se reordenan
const claveTemporal = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `t${Date.now()}${Math.random().toString(36).slice(2)}`)

export default function Ajustes() {
  const [a, setA] = useState(null)
  const [misas, setMisas] = useState([])
  const [borradas, setBorradas] = useState([])
  const [mensaje, setMensaje] = useState({ error: '', ok: '' })
  const [guardando, setGuardando] = useState(false)
  const [sucio, setSucio] = useState(false)

  useAvisoSinGuardar(sucio)

  useEffect(() => {
    let vivo = true
    Promise.all([
      supabase.from('ajustes').select('*').eq('id', 1).maybeSingle(),
      supabase.from('horarios_misa').select('*').order('orden'),
    ])
      .then(([r1, r2]) => {
        if (!vivo) return
        if (r1.error || r2.error) return setMensaje({ error: mensajeError(r1.error || r2.error, 'No se pudieron cargar los ajustes.'), ok: '' })
        setA({ ...AJUSTES_VACIOS, ...(r1.data || {}) })
        setMisas(r2.data)
      })
      .catch((err) => vivo && setMensaje({ error: mensajeError(err, 'No se pudieron cargar los ajustes.'), ok: '' }))
    return () => {
      vivo = false
    }
  }, [])

  const tocar = () => {
    setSucio(true)
    setMensaje((m) => (m.ok ? { error: m.error, ok: '' } : m))
  }
  const cambiar = (campo) => (e) => {
    tocar()
    setA((x) => ({ ...x, [campo]: e.target.value }))
  }
  const cambiarMisa = (i, campo, valor) => {
    tocar()
    setMisas((l) => l.map((m, j) => (j === i ? { ...m, [campo]: valor } : m)))
  }
  const mover = (i, d) => {
    tocar()
    setMisas((l) => {
      const n = [...l]
      const j = i + d
      if (j < 0 || j >= n.length) return l
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
  }
  const quitar = (i) => {
    tocar()
    const m = misas[i]
    if (m.id) setBorradas((b) => [...b, m.id])
    setMisas((l) => l.filter((_, j) => j !== i))
  }
  const agregarMisa = () => {
    tocar()
    setMisas((l) => [...l, { tmp: claveTemporal(), dias: '', hora: '', detalle: '' }])
  }

  async function guardar(e) {
    e.preventDefault()
    setMensaje({ error: '', ok: '' })
    if (!a.parroco.trim()) return setMensaje({ error: 'Escribe el nombre del párroco.', ok: '' })
    if (misas.some((m) => !m.dias.trim() || !m.hora.trim())) return setMensaje({ error: 'Cada horario necesita días y hora.', ok: '' })
    setGuardando(true)
    try {
      const campos = Object.fromEntries(CAMPOS.map((c) => [c, String(a[c] ?? '').trim()]))
      const filas = misas.map((m, i) => ({ id: m.id, orden: i + 1, dias: m.dias.trim(), hora: m.hora.trim(), detalle: (m.detalle || '').trim() }))
      const existentes = filas.filter((m) => m.id)
      const nuevas = filas.filter((m) => !m.id).map(({ id, ...resto }) => resto)

      const [rAjustes, rBorrar, rExistentes, rNuevas] = await Promise.all([
        // upsert: también crea la fila si alguien la borró desde Supabase
        supabase.from('ajustes').upsert({ id: 1, ...campos }),
        borradas.length ? supabase.from('horarios_misa').delete().in('id', borradas) : null,
        existentes.length ? supabase.from('horarios_misa').upsert(existentes) : null,
        nuevas.length ? supabase.from('horarios_misa').insert(nuevas).select() : null,
      ])
      const error = [rAjustes, rBorrar, rExistentes, rNuevas].find((r) => r?.error)?.error

      // Las filas nuevas que sí se guardaron reciben su id (para no duplicarlas al volver a guardar)
      if (rNuevas?.data) {
        const creadas = [...rNuevas.data]
        setMisas((l) => l.map((m) => (m.id ? m : { ...m, ...(creadas.shift() || {}), tmp: m.tmp })))
      }
      if (!rBorrar?.error) setBorradas([])
      if (error) {
        setMensaje({ error: mensajeError(error, 'Algunos cambios no se guardaron. Revisa los datos e inténtalo de nuevo.'), ok: '' })
      } else {
        setSucio(false)
        setMensaje({ error: '', ok: 'Ajustes guardados. El sitio ya muestra los cambios.' })
      }
    } catch (err) {
      setMensaje({ error: mensajeError(err, 'No se pudieron guardar los ajustes. Inténtalo de nuevo.'), ok: '' })
    } finally {
      setGuardando(false)
    }
  }

  if (!a) {
    return (
      <section className="adm-pagina">
        {mensaje.error ? (
          <p className="adm-error" role="alert">
            {mensaje.error}
          </p>
        ) : (
          <p className="adm-vacio">Cargando…</p>
        )}
      </section>
    )
  }

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
            <span>Párroco *</span>
            <input value={a.parroco} onChange={cambiar('parroco')} maxLength={80} aria-required="true" />
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
          {misas.map((m, i) => {
            const nombre = m.dias.trim() || i + 1
            return (
              <fieldset key={m.id ?? m.tmp} className="adm-misa">
                <legend className="visually-hidden">Horario {i + 1}</legend>
                <div className="adm-fila">
                  <label className="adm-campo">
                    <span>Días *</span>
                    <input value={m.dias} onChange={(e) => cambiarMisa(i, 'dias', e.target.value)} maxLength={60} aria-required="true" />
                  </label>
                  <label className="adm-campo">
                    <span>Hora *</span>
                    <input value={m.hora} onChange={(e) => cambiarMisa(i, 'hora', e.target.value)} maxLength={60} aria-required="true" />
                  </label>
                </div>
                <label className="adm-campo">
                  <span>Detalle</span>
                  <input value={m.detalle || ''} onChange={(e) => cambiarMisa(i, 'detalle', e.target.value)} maxLength={300} />
                </label>
                <div className="adm-misa__acciones">
                  <button type="button" className="adm-btn adm-btn--chico" onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir horario ${nombre}`}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="adm-btn adm-btn--chico"
                    onClick={() => mover(i, 1)}
                    disabled={i === misas.length - 1}
                    aria-label={`Bajar horario ${nombre}`}
                  >
                    ↓
                  </button>
                  <button type="button" className="adm-btn adm-btn--chico adm-btn--peligro" onClick={() => quitar(i)} aria-label={`Quitar horario ${nombre}`}>
                    Quitar
                  </button>
                </div>
              </fieldset>
            )
          })}
          <button type="button" className="adm-btn" onClick={agregarMisa}>
            + Agregar horario
          </button>
        </fieldset>

        <div className="adm-guardar">
          {mensaje.error && (
            <p className="adm-error" role="alert">
              {mensaje.error}
            </p>
          )}
          {mensaje.ok && (
            <p className="adm-ok" role="status">
              {mensaje.ok}
            </p>
          )}
          <div className="adm-botones">
            <button className="adm-btn adm-btn--primario" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar ajustes'}
            </button>
            {sucio && !guardando && <span className="adm-sin-guardar">Cambios sin guardar</span>}
          </div>
        </div>
      </form>
    </section>
  )
}
