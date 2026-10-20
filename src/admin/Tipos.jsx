import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Tipos() {
  const [tipos, setTipos] = useState(null)
  const [nuevo, setNuevo] = useState({ nombre: '', color: '#C6A15B' })
  const [mensaje, setMensaje] = useState({ error: '', ok: '' })

  async function cargar() {
    const { data, error } = await supabase.from('tipos_evento').select('*').order('orden').order('nombre')
    if (error) setMensaje({ error: 'No se pudieron cargar los tipos.', ok: '' })
    else setTipos(data)
  }
  useEffect(() => {
    cargar()
  }, [])

  const editar = (id, campo, valor) => setTipos((l) => l.map((t) => (t.id === id ? { ...t, [campo]: valor, sucio: true } : t)))

  async function guardar(t) {
    if (!t.nombre.trim()) return setMensaje({ error: 'El nombre no puede quedar vacío.', ok: '' })
    const { error } = await supabase.from('tipos_evento').update({ nombre: t.nombre.trim(), color: t.color, orden: Number(t.orden) || 0 }).eq('id', t.id)
    if (error) return setMensaje({ error: error.code === '23505' ? 'Ya existe un tipo con ese nombre.' : 'No se pudo guardar.', ok: '' })
    setMensaje({ error: '', ok: `«${t.nombre}» guardado.` })
    setTipos((l) => l.map((x) => (x.id === t.id ? { ...x, sucio: false } : x)))
  }

  async function agregar(e) {
    e.preventDefault()
    if (!nuevo.nombre.trim()) return
    const orden = (tipos?.length || 0) + 1
    const { error } = await supabase.from('tipos_evento').insert({ nombre: nuevo.nombre.trim(), color: nuevo.color, orden })
    if (error) return setMensaje({ error: error.code === '23505' ? 'Ya existe un tipo con ese nombre.' : 'No se pudo agregar.', ok: '' })
    setNuevo({ nombre: '', color: '#C6A15B' })
    setMensaje({ error: '', ok: 'Tipo agregado.' })
    cargar()
  }

  async function borrar(t) {
    if (!window.confirm(`¿Borrar el tipo «${t.nombre}»? Los eventos de este tipo quedarán «Sin tipo».`)) return
    const { error } = await supabase.from('tipos_evento').delete().eq('id', t.id)
    if (error) return setMensaje({ error: 'No se pudo borrar.', ok: '' })
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

      {mensaje.error && <p className="adm-error">{mensaje.error}</p>}
      {mensaje.ok && <p className="adm-ok">{mensaje.ok}</p>}

      {tipos && (
        <table className="adm-tabla">
          <thead>
            <tr>
              <th>Color</th>
              <th>Nombre</th>
              <th>Orden</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {tipos.map((t) => (
              <tr key={t.id}>
                <td>
                  <input type="color" value={t.color} onChange={(e) => editar(t.id, 'color', e.target.value)} aria-label={`Color de ${t.nombre}`} />
                </td>
                <td>
                  <input className="adm-input-tabla" value={t.nombre} maxLength={60} onChange={(e) => editar(t.id, 'nombre', e.target.value)} />
                </td>
                <td>
                  <input className="adm-input-tabla adm-input-num" type="number" value={t.orden} onChange={(e) => editar(t.id, 'orden', e.target.value)} />
                </td>
                <td className="adm-acciones">
                  <button className="adm-btn adm-btn--chico adm-btn--primario" disabled={!t.sucio} onClick={() => guardar(t)}>
                    Guardar
                  </button>
                  <button className="adm-btn adm-btn--chico adm-btn--peligro" onClick={() => borrar(t)}>
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
        <input placeholder="Nombre del nuevo tipo (ej. Retiro espiritual)" maxLength={60} value={nuevo.nombre} onChange={(e) => setNuevo((n) => ({ ...n, nombre: e.target.value }))} />
        <button className="adm-btn adm-btn--primario">+ Agregar tipo</button>
      </form>
    </section>
  )
}
