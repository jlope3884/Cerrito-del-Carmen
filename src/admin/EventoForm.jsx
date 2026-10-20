import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { aISO, deISO } from '../lib/fechas.js'
import EventoCard from '../components/EventoCard.jsx'
import { borrarImagen } from './Eventos.jsx'

const VACIO = {
  titulo: '',
  tipo_id: '',
  fechaInicio: '',
  horaInicio: '',
  fechaFin: '',
  horaFin: '',
  todo_el_dia: false,
  lugar: 'Santuario del Cerrito del Carmen',
  descripcion: '',
  imagen_url: '',
  publicado: true,
  destacado: false,
  boton_texto: '',
  boton_url: '',
}

function aFormulario(ev) {
  const i = deISO(ev.inicio)
  const f = deISO(ev.fin)
  return {
    ...VACIO,
    ...ev,
    tipo_id: ev.tipo_id ?? '',
    fechaInicio: i.fecha,
    horaInicio: ev.todo_el_dia ? '' : i.hora,
    fechaFin: f.fecha,
    horaFin: ev.todo_el_dia ? '' : f.hora,
  }
}

const MAX_MB = 5

export default function EventoForm() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const copiarDe = params.get('copiar')
  const navegar = useNavigate()
  const [f, setF] = useState(VACIO)
  const [tipos, setTipos] = useState([])
  const [cargando, setCargando] = useState(Boolean(id || copiarDe))
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const [imagenOriginal, setImagenOriginal] = useState('')

  useEffect(() => {
    supabase.from('tipos_evento').select('*').order('orden').then(({ data }) => setTipos(data || []))
    const fuente = id || copiarDe
    if (!fuente) return
    supabase
      .from('eventos')
      .select('*')
      .eq('id', fuente)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setError('No se encontró el evento.')
        else {
          const datos = aFormulario(data)
          if (copiarDe) {
            datos.titulo = `${data.titulo} (copia)`
            datos.publicado = false
          } else setImagenOriginal(data.imagen_url)
          setF(datos)
        }
        setCargando(false)
      })
  }, [id, copiarDe])

  const cambiar = (campo) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setF((x) => ({ ...x, [campo]: v }))
  }

  async function subirImagen(e) {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) return setError('El archivo debe ser una imagen (JPG, PNG o WebP).')
    if (archivo.size > MAX_MB * 1024 * 1024) return setError(`La imagen pesa más de ${MAX_MB} MB. Usa una más liviana.`)
    setError('')
    setSubiendo(true)
    const ext = (archivo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
    const ruta = `${new Date().getFullYear()}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('eventos').upload(ruta, archivo, { cacheControl: '31536000', contentType: archivo.type })
    setSubiendo(false)
    if (error) return setError('No se pudo subir la imagen.')
    const { data } = supabase.storage.from('eventos').getPublicUrl(ruta)
    // si la imagen anterior se subió en esta misma edición, ya no sirve
    if (f.imagen_url && f.imagen_url !== imagenOriginal && !copiarDe) borrarImagen(f.imagen_url)
    setF((x) => ({ ...x, imagen_url: data.publicUrl }))
  }

  function armarRegistro() {
    if (!f.titulo.trim()) throw new Error('Escribe el título del evento.')
    if (!f.fechaInicio) throw new Error('Elige la fecha del evento.')
    if (!f.todo_el_dia && !f.horaInicio) throw new Error('Escribe la hora de inicio o marca «Todo el día».')
    const inicio = aISO(f.fechaInicio, f.todo_el_dia ? '00:00' : f.horaInicio)
    let fin = null
    if (f.todo_el_dia) {
      fin = f.fechaFin ? aISO(f.fechaFin, '23:59') : null
    } else if (f.fechaFin || f.horaFin) {
      fin = aISO(f.fechaFin || f.fechaInicio, f.horaFin || f.horaInicio)
    }
    if (fin && new Date(fin) < new Date(inicio)) throw new Error('El final no puede ser antes del inicio.')
    if (f.boton_texto && !/^https?:\/\//.test(f.boton_url)) throw new Error('El enlace del botón debe empezar con https://')
    return {
      titulo: f.titulo.trim(),
      tipo_id: f.tipo_id ? Number(f.tipo_id) : null,
      inicio,
      fin,
      todo_el_dia: f.todo_el_dia,
      lugar: f.lugar.trim(),
      descripcion: f.descripcion.trim(),
      imagen_url: f.imagen_url,
      publicado: f.publicado,
      destacado: f.destacado,
      boton_texto: f.boton_url ? f.boton_texto.trim() : '',
      boton_url: f.boton_texto ? f.boton_url.trim() : '',
    }
  }

  async function guardar(e) {
    e.preventDefault()
    let registro
    try {
      registro = armarRegistro()
    } catch (err) {
      return setError(err.message)
    }
    setGuardando(true)
    setError('')
    const consulta = id ? supabase.from('eventos').update(registro).eq('id', id) : supabase.from('eventos').insert(registro)
    const { error } = await consulta
    setGuardando(false)
    if (error) return setError('No se pudo guardar. Revisa los datos e inténtalo de nuevo.')
    if (id && imagenOriginal && imagenOriginal !== registro.imagen_url) borrarImagen(imagenOriginal)
    navegar('/admin/eventos')
  }

  let vista = null
  try {
    const r = armarRegistro()
    vista = { ...r, tipo: tipos.find((t) => t.id === r.tipo_id) }
  } catch {
    vista = null
  }

  if (cargando) return <section className="adm-pagina"><p className="adm-vacio">Cargando…</p></section>

  return (
    <section className="adm-pagina">
      <header className="adm-cabecera">
        <div>
          <Link to="/admin/eventos" className="adm-volver">
            ← Eventos
          </Link>
          <h1>{id ? 'Editar evento' : 'Nuevo evento'}</h1>
        </div>
      </header>

      <div className="adm-dos">
        <form className="adm-form" onSubmit={guardar} noValidate>
          <fieldset>
            <legend>Información</legend>
            <label className="adm-campo">
              <span>Título *</span>
              <input value={f.titulo} onChange={cambiar('titulo')} maxLength={140} placeholder="Ej. Fiesta de la Virgen del Carmen" />
            </label>
            <label className="adm-campo">
              <span>Tipo</span>
              <select value={f.tipo_id} onChange={cambiar('tipo_id')}>
                <option value="">Sin tipo</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              <small>
                Los tipos y sus colores se cambian en <Link to="/admin/tipos">Tipos de evento</Link>.
              </small>
            </label>
            <label className="adm-campo">
              <span>Lugar</span>
              <input value={f.lugar} onChange={cambiar('lugar')} maxLength={140} />
            </label>
            <label className="adm-campo">
              <span>Descripción</span>
              <textarea value={f.descripcion} onChange={cambiar('descripcion')} maxLength={4000} rows={5} placeholder="Programa, horarios de cada actividad, indicaciones…" />
            </label>
          </fieldset>

          <fieldset>
            <legend>Fecha y hora (hora de Guatemala)</legend>
            <label className="adm-check">
              <input type="checkbox" checked={f.todo_el_dia} onChange={cambiar('todo_el_dia')} />
              <span>Todo el día (sin hora)</span>
            </label>
            <div className="adm-fila">
              <label className="adm-campo">
                <span>Fecha de inicio *</span>
                <input type="date" value={f.fechaInicio} onChange={cambiar('fechaInicio')} />
              </label>
              {!f.todo_el_dia && (
                <label className="adm-campo">
                  <span>Hora de inicio *</span>
                  <input type="time" value={f.horaInicio} onChange={cambiar('horaInicio')} />
                </label>
              )}
            </div>
            <div className="adm-fila">
              <label className="adm-campo">
                <span>Fecha de fin</span>
                <input type="date" value={f.fechaFin} onChange={cambiar('fechaFin')} min={f.fechaInicio} />
                <small>Para eventos de varios días, como la feria.</small>
              </label>
              {!f.todo_el_dia && (
                <label className="adm-campo">
                  <span>Hora de fin</span>
                  <input type="time" value={f.horaFin} onChange={cambiar('horaFin')} />
                </label>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend>Imagen</legend>
            {f.imagen_url ? (
              <div className="adm-imagen">
                <img src={f.imagen_url} alt="" />
                <div>
                  <label className="adm-btn adm-btn--chico">
                    Cambiar imagen
                    <input type="file" accept="image/*" onChange={subirImagen} hidden />
                  </label>
                  <button type="button" className="adm-btn adm-btn--chico adm-btn--peligro" onClick={() => setF((x) => ({ ...x, imagen_url: '' }))}>
                    Quitar
                  </button>
                </div>
              </div>
            ) : (
              <label className="adm-subir">
                {subiendo ? 'Subiendo…' : '+ Subir una imagen (opcional, máx. 5 MB)'}
                <input type="file" accept="image/*" onChange={subirImagen} hidden disabled={subiendo} />
              </label>
            )}
          </fieldset>

          <fieldset>
            <legend>Botón (opcional)</legend>
            <div className="adm-fila">
              <label className="adm-campo">
                <span>Texto del botón</span>
                <input value={f.boton_texto} onChange={cambiar('boton_texto')} maxLength={40} placeholder="Ej. Ver transmisión" />
              </label>
              <label className="adm-campo">
                <span>Enlace</span>
                <input type="url" value={f.boton_url} onChange={cambiar('boton_url')} placeholder="https://…" />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Publicación</legend>
            <label className="adm-check">
              <input type="checkbox" checked={f.publicado} onChange={cambiar('publicado')} />
              <span>Publicado en el sitio (si no, queda como borrador)</span>
            </label>
            <label className="adm-check">
              <input type="checkbox" checked={f.destacado} onChange={cambiar('destacado')} />
              <span>Destacar en la página de Inicio</span>
            </label>
          </fieldset>

          {error && <p className="adm-error">{error}</p>}
          <div className="adm-botones">
            <button className="adm-btn adm-btn--primario" disabled={guardando || subiendo}>
              {guardando ? 'Guardando…' : 'Guardar evento'}
            </button>
            <Link to="/admin/eventos" className="adm-btn">
              Cancelar
            </Link>
          </div>
        </form>

        <aside className="adm-vista">
          <p className="adm-vista__titulo">Así se verá en el sitio</p>
          {vista ? <EventoCard ev={vista} /> : <p className="adm-tenue">Completa el título y la fecha para ver la vista previa.</p>}
        </aside>
      </div>
    </section>
  )
}
