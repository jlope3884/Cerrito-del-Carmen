import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { deISO, fechaCorta, hora } from '../lib/fechas.js'
import { mensajeError } from '../lib/errores.js'

export const ESTADOS = {
  nueva: 'Nueva',
  en_proceso: 'En proceso',
  confirmada: 'Confirmada',
  cerrada: 'Cerrada',
}

const COLUMNAS_CSV = [
  ['Fecha de envío', (s) => (s.creado_en ? `${deISO(s.creado_en).fecha} ${deISO(s.creado_en).hora}` : '')],
  ['Celebración', (s) => s.tipo],
  ['Nombre', (s) => s.nombre],
  ['Teléfono', (s) => s.telefono],
  ['Correo', (s) => s.correo],
  ['Fecha preferida', (s) => s.fecha_preferida],
  ['Estado', (s) => ESTADOS[s.estado] || s.estado],
  ['Mensaje', (s) => s.mensaje],
  ['Notas internas', (s) => s.notas_internas],
]

/** Celda de CSV. Lo que empieza con = + - @ se antepone con ' para que Excel no lo ejecute como fórmula. */
function celda(v) {
  let s = String(v ?? '')
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s
  return `"${s.replace(/"/g, '""')}"`
}

/** Descarga todas las solicitudes en un CSV que Excel abre con acentos (BOM UTF-8). Hora de Guatemala. */
function exportarCSV(filas) {
  const csv = [
    COLUMNAS_CSV.map(([titulo]) => celda(titulo)).join(','),
    ...filas.map((f) => COLUMNAS_CSV.map(([, valor]) => celda(valor(f))).join(',')),
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `solicitudes-${deISO(new Date().toISOString()).fecha}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Avisa al menú lateral que vuelva a contar las solicitudes nuevas. */
const avisarCambio = () => window.dispatchEvent(new Event('solicitudes-cambiaron'))

export default function Solicitudes() {
  const [lista, setLista] = useState(null)
  const [filtro, setFiltro] = useState('activas')
  const [abierta, setAbierta] = useState(null)
  const [mensaje, setMensaje] = useState({ error: '', ok: '' })

  async function cargar() {
    const { data, error } = await supabase.from('solicitudes').select('*').order('creado_en', { ascending: false })
    if (error) setMensaje({ error: mensajeError(error, 'No se pudieron cargar las solicitudes.'), ok: '' })
    else setLista(data)
  }
  useEffect(() => {
    cargar()
  }, [])

  // Se filtra por el estado guardado: así una solicitud no desaparece al cambiar el estado antes de guardar
  const visibles = (lista || []).filter((s) => {
    const estado = s.estadoGuardado ?? s.estado
    return filtro === 'activas' ? estado === 'nueva' || estado === 'en_proceso' : filtro === 'todas' ? true : estado === filtro
  })

  async function guardar(s) {
    setMensaje({ error: '', ok: '' })
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estado: s.estado, notas_internas: s.notas_internas })
      .eq('id', s.id)
      .select('id')
    if (error) return setMensaje({ error: mensajeError(error, 'No se pudo guardar.'), ok: '' })
    if (data.length === 0) return setMensaje({ error: 'Esta solicitud ya no existe; quizá alguien la borró.', ok: '' })
    setMensaje({ error: '', ok: 'Solicitud actualizada.' })
    setLista((l) => l.map((x) => (x.id === s.id ? { ...s, sucio: false, estadoGuardado: undefined } : x)))
    avisarCambio()
  }

  async function borrar(s) {
    if (!window.confirm(`¿Borrar la solicitud de ${s.nombre}? Esta acción no se puede deshacer.`)) return
    setMensaje({ error: '', ok: '' })
    const { error } = await supabase.from('solicitudes').delete().eq('id', s.id)
    if (error) return setMensaje({ error: mensajeError(error, 'No se pudo borrar.'), ok: '' })
    setLista((l) => l.filter((x) => x.id !== s.id))
    avisarCambio()
  }

  const editar = (id, campo, valor) =>
    setLista((l) => l.map((x) => (x.id === id ? { ...x, estadoGuardado: x.estadoGuardado ?? x.estado, [campo]: valor, sucio: true } : x)))

  return (
    <section className="adm-pagina">
      <header className="adm-cabecera">
        <div>
          <h1>Solicitudes</h1>
          <p>Lo que las personas piden desde la página de Celebraciones del sitio.</p>
        </div>
        <button className="adm-btn" onClick={() => exportarCSV(lista || [])} disabled={!lista?.length}>
          Exportar todas (CSV)
        </button>
      </header>

      <div className="adm-barra">
        <div className="adm-pestanas" role="group" aria-label="Filtrar solicitudes por estado">
          {[['activas', 'Por atender'], ...Object.entries(ESTADOS), ['todas', 'Todas']].map(([k, v]) => (
            <button key={k} type="button" className={filtro === k ? 'is-on' : ''} aria-pressed={filtro === k} onClick={() => setFiltro(k)}>
              {v}
            </button>
          ))}
        </div>
      </div>

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
      {!lista && !mensaje.error && <p className="adm-vacio">Cargando…</p>}
      {lista && visibles.length === 0 && <p className="adm-vacio">No hay solicitudes aquí.</p>}

      <div className="adm-lista">
        {visibles.map((s) => {
          const abierto = abierta === s.id
          return (
            <article key={s.id} className={'adm-sol' + (abierto ? ' is-open' : '')}>
              <button className="adm-sol__cab" onClick={() => setAbierta(abierto ? null : s.id)} aria-expanded={abierto}>
                <span className={`adm-estado adm-estado--${s.estado}`}>{ESTADOS[s.estado]}</span>
                <strong>{s.tipo}</strong>
                <span>{s.nombre}</span>
                <span className="adm-tenue">
                  {fechaCorta(s.creado_en)} · {hora(s.creado_en)}
                </span>
              </button>
              {abierto && (
                <div className="adm-sol__cuerpo">
                  <dl>
                    {s.telefono && (
                      <>
                        <dt>Teléfono</dt>
                        <dd>
                          <a href={`tel:${s.telefono}`}>{s.telefono}</a>
                        </dd>
                      </>
                    )}
                    {s.correo && (
                      <>
                        <dt>Correo</dt>
                        <dd>
                          <a href={`mailto:${s.correo}`}>{s.correo}</a>
                        </dd>
                      </>
                    )}
                    {s.fecha_preferida && (
                      <>
                        <dt>Fecha preferida</dt>
                        <dd>{s.fecha_preferida.split('-').reverse().join('/')}</dd>
                      </>
                    )}
                    {s.mensaje && (
                      <>
                        <dt>Mensaje</dt>
                        <dd className="adm-pre">{s.mensaje}</dd>
                      </>
                    )}
                  </dl>
                  <div className="adm-fila">
                    <label className="adm-campo">
                      <span>Estado</span>
                      <select value={s.estado} onChange={(e) => editar(s.id, 'estado', e.target.value)}>
                        {Object.entries(ESTADOS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="adm-campo">
                    <span>Notas internas (no las ve la persona)</span>
                    <textarea rows={3} maxLength={3000} value={s.notas_internas} onChange={(e) => editar(s.id, 'notas_internas', e.target.value)} />
                  </label>
                  <div className="adm-botones">
                    <button className="adm-btn adm-btn--primario" disabled={!s.sucio} onClick={() => guardar(s)}>
                      Guardar cambios
                    </button>
                    <button className="adm-btn adm-btn--peligro" onClick={() => borrar(s)}>
                      Borrar
                    </button>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
