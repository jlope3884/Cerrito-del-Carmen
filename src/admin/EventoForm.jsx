import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { aISO, deISO, diaSiguiente } from '../lib/fechas.js'
import { mensajeError } from '../lib/errores.js'
import EventoCard from '../components/EventoCard.jsx'
import { borrarImagen } from './Eventos.jsx'
import { confirmarSalida, useAvisoSinGuardar } from './sinGuardar.js'

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
    // Si termina pasada la medianoche del día siguiente, basta con la hora de fin
    fechaFin: !ev.todo_el_dia && ev.fin && f.fecha === diaSiguiente(i.fecha) && f.hora < i.hora ? '' : f.fecha,
    horaFin: ev.todo_el_dia ? '' : f.hora,
    descripcion: ev.descripcion ?? '',
    lugar: ev.lugar ?? '',
    boton_texto: ev.boton_texto ?? '',
    boton_url: ev.boton_url ?? '',
  }
}

/** ¿La hora de fin, sin fecha de fin, cae en el día siguiente (por ejemplo, de 22:00 a 01:00)? */
const terminaDiaSiguiente = (f) => !f.todo_el_dia && !f.fechaFin && Boolean(f.horaFin && f.horaInicio) && f.horaFin < f.horaInicio

/**
 * Convierte el formulario en la fila de la base.
 * Devuelve { registro } o, si falta algo, { campo, mensaje } con el campo que hay que corregir.
 */
function armarRegistro(f) {
  if (!f.titulo.trim()) return { campo: 'titulo', mensaje: 'Escribe el título del evento.' }
  if (!f.fechaInicio) return { campo: 'fechaInicio', mensaje: 'Elige la fecha del evento.' }
  if (!f.todo_el_dia && !f.horaInicio) return { campo: 'horaInicio', mensaje: 'Escribe la hora de inicio o marca «Todo el día».' }
  const inicio = aISO(f.fechaInicio, f.todo_el_dia ? '00:00' : f.horaInicio)
  let fin = null
  if (f.todo_el_dia) {
    fin = f.fechaFin ? aISO(f.fechaFin, '23:59') : null
  } else if (terminaDiaSiguiente(f)) {
    fin = aISO(diaSiguiente(f.fechaInicio), f.horaFin)
  } else if (f.fechaFin || f.horaFin) {
    fin = aISO(f.fechaFin || f.fechaInicio, f.horaFin || f.horaInicio)
  }
  if (fin && new Date(fin) < new Date(inicio)) {
    return { campo: f.fechaFin ? 'fechaFin' : 'horaFin', mensaje: 'El final no puede ser antes del inicio.' }
  }
  const texto = f.boton_texto.trim()
  let enlace = f.boton_url.trim()
  if (Boolean(texto) !== Boolean(enlace)) {
    return { campo: texto ? 'boton_url' : 'boton_texto', mensaje: 'Completa el texto y el enlace del botón, o deja ambos vacíos.' }
  }
  if (enlace && !/^https?:\/\/\S/i.test(enlace)) return { campo: 'boton_url', mensaje: 'El enlace del botón debe empezar con https://' }
  enlace = enlace.replace(/^https?/i, (esquema) => esquema.toLowerCase())
  return {
    registro: {
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
      boton_texto: texto,
      boton_url: enlace,
    },
  }
}

const MAX_MB = 5
const FORMATOS = ['image/jpeg', 'image/png', 'image/webp']
const EXTENSION = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export default function EventoForm() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const copiarDe = params.get('copiar')
  const navegar = useNavigate()
  const [f, setF] = useState(VACIO)
  const [tipos, setTipos] = useState([])
  const [cargando, setCargando] = useState(Boolean(id || copiarDe))
  const [errorCarga, setErrorCarga] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const [campoError, setCampoError] = useState('')
  const [imagenOriginal, setImagenOriginal] = useState('')
  const [sucio, setSucio] = useState(false)

  // Imágenes subidas en esta edición: si no se guardan, se borran del almacenamiento
  const subidas = useRef(new Set())
  const guardado = useRef(false)
  const desmontado = useRef(false)
  const campos = useRef({})
  const ref = (campo) => (el) => {
    campos.current[campo] = el
  }

  useAvisoSinGuardar(sucio && !guardando)

  useEffect(() => {
    let vivo = true
    supabase
      .from('tipos_evento')
      .select('*')
      .order('orden')
      .then(({ data }) => vivo && setTipos(data || []))
    return () => {
      vivo = false
    }
  }, [])

  useEffect(() => {
    let vivo = true
    const fuente = id || copiarDe
    setCargando(Boolean(fuente))
    setErrorCarga('')
    setF(VACIO)
    setImagenOriginal('')
    setSucio(false)
    if (!fuente) return
    supabase
      .from('eventos')
      .select('*')
      .eq('id', fuente)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!vivo) return
        if (error) setErrorCarga(mensajeError(error, 'No se pudo cargar el evento. Inténtalo de nuevo.'))
        else if (!data) setErrorCarga(copiarDe && !id ? 'No se encontró el evento que quieres duplicar; quizá alguien lo borró.' : 'Este evento no existe; quizá alguien lo borró.')
        else {
          const datos = aFormulario(data)
          if (copiarDe && !id) {
            datos.titulo = `${data.titulo} (copia)`.slice(0, 140)
            datos.publicado = false
          } else setImagenOriginal(data.imagen_url)
          setF(datos)
        }
        setCargando(false)
      })
      .catch((err) => {
        if (!vivo) return
        setErrorCarga(mensajeError(err, 'No se pudo cargar el evento. Inténtalo de nuevo.'))
        setCargando(false)
      })
    return () => {
      vivo = false
    }
  }, [id, copiarDe])

  // Al salir sin guardar, se borran las imágenes que se subieron aquí y no quedaron en ningún evento
  useEffect(() => {
    desmontado.current = false
    const lista = subidas.current
    return () => {
      desmontado.current = true
      if (guardado.current) return
      for (const url of lista) borrarImagen(url)
      lista.clear()
    }
  }, [])

  /** Borra una imagen solo si se subió en esta edición (la original o la del evento copiado se respetan). */
  function descartarSubida(url) {
    if (!url || url === imagenOriginal || !subidas.current.has(url)) return
    subidas.current.delete(url)
    borrarImagen(url)
  }

  const cambiar = (campo) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setF((x) => ({ ...x, [campo]: v }))
    setSucio(true)
    if (campoError && (campo === campoError || (campo === 'todo_el_dia' && campoError.startsWith('hora')))) {
      setCampoError('')
      setError('')
    }
  }

  async function subirImagen(e) {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    setError('')
    setCampoError('')
    if (!FORMATOS.includes(archivo.type)) return setError('La imagen debe ser JPG, PNG o WebP.')
    if (archivo.size > MAX_MB * 1024 * 1024) return setError(`La imagen pesa más de ${MAX_MB} MB. Usa una más liviana.`)
    setSubiendo(true)
    const ruta = `${new Date().getFullYear()}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${EXTENSION[archivo.type]}`
    let resultado
    try {
      resultado = await supabase.storage.from('eventos').upload(ruta, archivo, { cacheControl: '31536000', contentType: archivo.type })
    } catch (err) {
      resultado = { error: err }
    }
    setSubiendo(false)
    if (resultado.error) return setError(mensajeError(resultado.error, 'No se pudo subir la imagen.'))
    const { data } = supabase.storage.from('eventos').getPublicUrl(ruta)
    subidas.current.add(data.publicUrl)
    // Si ya se salió del formulario mientras subía, no se usará
    if (desmontado.current) return descartarSubida(data.publicUrl)
    // si la imagen anterior se subió en esta misma edición, ya no sirve
    descartarSubida(f.imagen_url)
    setF((x) => ({ ...x, imagen_url: data.publicUrl }))
    setSucio(true)
  }

  function quitarImagen() {
    descartarSubida(f.imagen_url)
    setF((x) => ({ ...x, imagen_url: '' }))
    setSucio(true)
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setCampoError('')
    const r = armarRegistro(f)
    if (!r.registro) {
      setError(r.mensaje)
      setCampoError(r.campo)
      campos.current[r.campo]?.focus()
      return
    }
    const { registro } = r
    setGuardando(true)
    let respuesta
    try {
      respuesta = await (id
        ? supabase.from('eventos').update(registro).eq('id', id).select('id')
        : supabase.from('eventos').insert(registro))
    } catch (err) {
      respuesta = { error: err }
    }
    setGuardando(false)
    if (respuesta.error) return setError(mensajeError(respuesta.error, 'No se pudo guardar. Revisa los datos e inténtalo de nuevo.'))
    if (id && respuesta.data?.length === 0) return setError('Este evento ya no existe; quizá alguien lo borró.')
    if (id && imagenOriginal && imagenOriginal !== registro.imagen_url) borrarImagen(imagenOriginal)
    guardado.current = true
    setSucio(false)
    navegar('/admin/eventos')
  }

  if (cargando) {
    return (
      <section className="adm-pagina">
        <p className="adm-vacio">Cargando…</p>
      </section>
    )
  }

  if (errorCarga) {
    return (
      <section className="adm-pagina">
        <header className="adm-cabecera">
          <div>
            <h1>{id ? 'Editar evento' : 'Nuevo evento'}</h1>
          </div>
        </header>
        <p className="adm-error" role="alert">
          {errorCarga}
        </p>
        <Link to="/admin/eventos" className="adm-volver">
          ← Volver a Eventos
        </Link>
      </section>
    )
  }

  const r = armarRegistro(f)
  const vista = r.registro ? { ...r.registro, tipo: tipos.find((t) => t.id === r.registro.tipo_id) } : null
  const salir = confirmarSalida(sucio)
  // Atributos de accesibilidad del campo que tiene el error
  const marca = (campo) => (campoError === campo ? { 'aria-invalid': true, 'aria-describedby': 'evento-error' } : {})
  const diaSig = terminaDiaSiguiente(f)

  return (
    <section className="adm-pagina">
      <header className="adm-cabecera">
        <div>
          <Link to="/admin/eventos" className="adm-volver" onClick={salir}>
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
              <input
                ref={ref('titulo')}
                value={f.titulo}
                onChange={cambiar('titulo')}
                maxLength={140}
                aria-required="true"
                placeholder="Ej. Fiesta de la Virgen del Carmen"
                {...marca('titulo')}
              />
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
                Los tipos y sus colores se cambian en{' '}
                <Link to="/admin/tipos" onClick={salir}>
                  Tipos de evento
                </Link>
                .
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
                <input ref={ref('fechaInicio')} type="date" value={f.fechaInicio} onChange={cambiar('fechaInicio')} aria-required="true" {...marca('fechaInicio')} />
              </label>
              {!f.todo_el_dia && (
                <label className="adm-campo">
                  <span>Hora de inicio *</span>
                  <input ref={ref('horaInicio')} type="time" value={f.horaInicio} onChange={cambiar('horaInicio')} aria-required="true" {...marca('horaInicio')} />
                </label>
              )}
            </div>
            <div className="adm-fila">
              <label className="adm-campo">
                <span>Fecha de fin</span>
                <input ref={ref('fechaFin')} type="date" value={f.fechaFin} onChange={cambiar('fechaFin')} min={f.fechaInicio} {...marca('fechaFin')} />
                <small>Para eventos de varios días, como la feria.</small>
              </label>
              {!f.todo_el_dia && (
                <label className="adm-campo">
                  <span>Hora de fin</span>
                  <input
                    ref={ref('horaFin')}
                    type="time"
                    value={f.horaFin}
                    onChange={cambiar('horaFin')}
                    {...marca('horaFin')}
                    aria-describedby={[campoError === 'horaFin' && 'evento-error', diaSig && 'aviso-dia-siguiente'].filter(Boolean).join(' ') || undefined}
                  />
                  {diaSig && <small id="aviso-dia-siguiente">Termina el día siguiente</small>}
                </label>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend>Imagen</legend>
            {f.imagen_url ? (
              <div className="adm-imagen">
                <img src={f.imagen_url} alt="Imagen actual del evento" />
                <div>
                  <label className="adm-btn adm-btn--chico">
                    {subiendo ? 'Subiendo…' : 'Cambiar imagen'}
                    <input
                      type="file"
                      className="visually-hidden"
                      accept={FORMATOS.join(',')}
                      onChange={subirImagen}
                      disabled={subiendo}
                      aria-label={`Cambiar imagen del evento (JPG, PNG o WebP, máx. ${MAX_MB} MB)`}
                    />
                  </label>
                  <button type="button" className="adm-btn adm-btn--chico adm-btn--peligro" onClick={quitarImagen} disabled={subiendo}>
                    Quitar
                  </button>
                </div>
              </div>
            ) : (
              <label className="adm-subir">
                {subiendo ? 'Subiendo…' : `+ Subir una imagen (opcional, JPG, PNG o WebP, máx. ${MAX_MB} MB)`}
                <input
                  type="file"
                  className="visually-hidden"
                  accept={FORMATOS.join(',')}
                  onChange={subirImagen}
                  disabled={subiendo}
                  aria-label={`Subir imagen del evento (máx. ${MAX_MB} MB)`}
                />
              </label>
            )}
          </fieldset>

          <fieldset>
            <legend>Botón (opcional)</legend>
            <div className="adm-fila">
              <label className="adm-campo">
                <span>Texto del botón</span>
                <input ref={ref('boton_texto')} value={f.boton_texto} onChange={cambiar('boton_texto')} maxLength={40} placeholder="Ej. Ver transmisión" {...marca('boton_texto')} />
              </label>
              <label className="adm-campo">
                <span>Enlace</span>
                <input ref={ref('boton_url')} type="url" value={f.boton_url} onChange={cambiar('boton_url')} placeholder="https://…" {...marca('boton_url')} />
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

          <div className="adm-guardar">
            {error && (
              <p className="adm-error" id="evento-error" role="alert">
                {error}
              </p>
            )}
            <div className="adm-botones">
              <button className="adm-btn adm-btn--primario" disabled={guardando || subiendo}>
                {guardando ? 'Guardando…' : 'Guardar evento'}
              </button>
              <Link to="/admin/eventos" className="adm-btn" onClick={salir}>
                Cancelar
              </Link>
              {sucio && !guardando && <span className="adm-sin-guardar">Cambios sin guardar</span>}
            </div>
          </div>
        </form>

        <aside className="adm-vista" aria-label="Vista previa">
          <p className="adm-vista__titulo">Así se verá en el sitio</p>
          {vista ? <EventoCard ev={vista} /> : <p className="adm-tenue">Completa el título y la fecha para ver la vista previa.</p>}
        </aside>
      </div>
    </section>
  )
}
