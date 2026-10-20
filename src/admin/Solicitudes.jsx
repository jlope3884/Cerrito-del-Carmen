import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { fechaCorta, hora } from '../lib/fechas.js'

export const ESTADOS = {
  nueva: 'Nueva',
  en_proceso: 'En proceso',
  confirmada: 'Confirmada',
  cerrada: 'Cerrada',
}

function exportarCSV(filas) {
  const cols = ['creado_en', 'tipo', 'nombre', 'telefono', 'correo', 'fecha_preferida', 'estado', 'mensaje', 'notas_internas']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [cols.join(','), ...filas.map((f) => cols.map((c) => esc(f[c])).join(','))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  a.download = `solicitudes-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function Solicitudes() {
  const [lista, setLista] = useState(null)
  const [filtro, setFiltro] = useState('activas')
  const [abierta, setAbierta] = useState(null)
  const [mensaje, setMensaje] = useState({ error: '', ok: '' })

  async function cargar() {
    const { data, error } = await supabase.from('solicitudes').select('*').order('creado_en', { ascending: false })
    if (error) setMensaje({ error: 'No se pudieron cargar las solicitudes.', ok: '' })
    else setLista(data)
  }
  useEffect(() => {
    cargar()
  }, [])

  const visibles = (lista || []).filter((s) =>
    filtro === 'activas' ? s.estado === 'nueva' || s.estado === 'en_proceso' : filtro === 'todas' ? true : s.estado === filtro,
  )

  async function guardar(s) {
    const { error } = await supabase.from('solicitudes').update({ estado: s.estado, notas_internas: s.notas_internas }).eq('id', s.id)
    if (error) return setMensaje({ error: 'No se pudo guardar.', ok: '' })
    setMensaje({ error: '', ok: 'Solicitud actualizada.' })
    setLista((l) => l.map((x) => (x.id === s.id ? { ...s, sucio: false } : x)))
  }

  async function borrar(s) {
    if (!window.confirm(`¿Borrar la solicitud de ${s.nombre}? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('solicitudes').delete().eq('id', s.id)
    if (error) return setMensaje({ error: 'No se pudo borrar.', ok: '' })
    setLista((l) => l.filter((x) => x.id !== s.id))
  }

  const editar = (id, campo, valor) => setLista((l) => l.map((x) => (x.id === id ? { ...x, [campo]: valor, sucio: true } : x)))

  return (
    <section className="adm-pagina">
      <header className="adm-cabecera">
        <div>
          <h1>Solicitudes</h1>
          <p>Lo que las personas piden desde la página de Celebraciones del sitio.</p>
        </div>
        <button className="adm-btn" onClick={() => exportarCSV(lista || [])} disabled={!lista?.length}>
          Exportar a Excel (CSV)
        </button>
      </header>

      <div className="adm-barra">
        <div className="adm-pestanas">
          {[['activas', 'Por atender'], ...Object.entries(ESTADOS), ['todas', 'Todas']].map(([k, v]) => (
            <button key={k} className={filtro === k ? 'is-on' : ''} onClick={() => setFiltro(k)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {mensaje.error && <p className="adm-error">{mensaje.error}</p>}
      {mensaje.ok && <p className="adm-ok">{mensaje.ok}</p>}
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
                    <textarea rows={3} value={s.notas_internas} onChange={(e) => editar(s.id, 'notas_internas', e.target.value)} />
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
