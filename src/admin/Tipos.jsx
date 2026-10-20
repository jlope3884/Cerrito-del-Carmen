import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { mensajeError } from '../lib/errores.js'

const repetido = (error, porDefecto) => (error.code === '23505' ? 'Ya existe un tipo con ese nombre.' : mensajeError(error, porDefecto))

export default function Tipos() {
  const [tipos, setTipos] = useState(null)
  const [nuevo, setNuevo] = useState({ nombre: '', color: '#C6A15B' })
  const [mensaje, setMensaje] = useState({ error: '', ok: '' })
  const nombreNuevo = useRef(null)

  async function cargar() {
    const { data, error } = await supabase.from('tipos_evento').select('*').order('orden').order('nombre')
    if (error) setMensaje({ error: mensajeError(error, 'No se pudieron cargar los tipos.'), ok: '' })
    else setTipos(data)
  }
  useEffect(() => {
    cargar()
  }, [])

  const editar = (id, campo, valor) => setTipos((l) => l.map((t) => (t.id === id ? { ...t, [campo]: valor, sucio: true } : t)))

  async function guardar(t) {
    setMensaje({ error: '', ok: '' })
    const nombre = t.nombre.trim()
    if (!nombre) return setMensaje({ error: 'Escribe el nombre del tipo.', ok: '' })
    const orden = Math.round(Number(t.orden)) || 0
    const { data, error } = await supabase.from('tipos_evento').update({ nombre, color: t.color, orden }).eq('id', t.id).select('id')
    if (error) return setMensaje({ error: repetido(error, 'No se pudo guardar.'), ok: '' })
    if (data.length === 0) return setMensaje({ error: 'Este tipo ya no existe; quizá alguien lo borró.', ok: '' })
    setMensaje({ error: '', ok: `«${nombre}» guardado.` })
    setTipos((l) => l.map((x) => (x.id === t.id ? { ...x, nombre, orden, sucio: false } : x)))
  }

  async function agregar(e) {
    e.preventDefault()
    setMensaje({ error: '', ok: '' })
    if (!nuevo.nombre.trim()) {
      nombreNuevo.current?.focus()
      return setMensaje({ error: 'Escribe el nombre del tipo.', ok: '' })
    }
    const orden = (tipos?.length || 0) + 1
    const { error } = await supabase.from('tipos_evento').insert({ nombre: nuevo.nombre.trim(), color: nuevo.color, orden })
    if (error) return setMensaje({ error: repetido(error, 'No se pudo agregar.'), ok: '' })
    setNuevo({ nombre: '', color: '#C6A15B' })
    setMensaje({ error: '', ok: 'Tipo agregado.' })
    cargar()
  }

  async function borrar(t) {
    if (!window.confirm(`¿Borrar el tipo «${t.nombre}»? Los eventos de este tipo quedarán «Sin tipo».`)) return
    setMensaje({ error: '', ok: '' })
    const { error } = await supabase.from('tipos_evento').delete().eq('id', t.id)
    if (error) return setMensaje({ error: mensajeError(error, 'No se pudo borrar.'), ok: '' })
    setTipos((l) => l.filter((x) => x.id !== t.id))
  }

  return (
    <section className="adm-pagina">
      <header className="adm-cabecera">
        <div>
          <h1>Tipos de evento</h1>
          <p>Cada tipo tiene su color, que se ve en la agenda del sitio y en el panel.</p>
        </div>
      </header>

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

      {tipos && (
        <table className="adm-tabla">
          <thead>
            <tr>
              <th>Color</th>
              <th>Nombre</th>
              <th>Orden</th>
              <th>
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((t, i) => (
              <tr key={t.id}>
                <td data-label="Color">
                  <input type="color" value={t.color} onChange={(e) => editar(t.id, 'color', e.target.value)} aria-label={`Color de «${t.nombre}»`} />
                </td>
                <td data-label="Nombre">
                  <input
                    className="adm-input-tabla"
                    value={t.nombre}
                    maxLength={60}
                    onChange={(e) => editar(t.id, 'nombre', e.target.value)}
                    aria-label={`Nombre del tipo ${i + 1}`}
                  />
                </td>
                <td data-label="Orden">
                  <input
                    className="adm-input-tabla adm-input-num"
                    type="number"
                    step={1}
                    value={t.orden}
                    onChange={(e) => editar(t.id, 'orden', e.target.value)}
                    aria-label={`Orden de «${t.nombre}»`}
                  />
                </td>
                <td className="adm-acciones">
                  <button className="adm-btn adm-btn--chico adm-btn--primario" disabled={!t.sucio} onClick={() => guardar(t)} aria-label={`Guardar «${t.nombre}»`}>
                    Guardar
                  </button>
                  <button className="adm-btn adm-btn--chico adm-btn--peligro" onClick={() => borrar(t)} aria-label={`Borrar «${t.nombre}»`}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form className="adm-nuevo-tipo" onSubmit={agregar}>
        <input type="color" value={nuevo.color} onChange={(e) => setNuevo((n) => ({ ...n, color: e.target.value }))} aria-label="Color del nuevo tipo" />
        <input
          ref={nombreNuevo}
          placeholder="Nombre del nuevo tipo (ej. Retiro espiritual)"
          aria-label="Nombre del nuevo tipo"
          maxLength={60}
          value={nuevo.nombre}
          onChange={(e) => setNuevo((n) => ({ ...n, nombre: e.target.value }))}
        />
        <button className="adm-btn adm-btn--primario">+ Agregar tipo</button>
      </form>
    </section>
  )
}
