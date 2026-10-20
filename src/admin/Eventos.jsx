import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { fechaCorta, hora } from '../lib/fechas.js'
import { mensajeError } from '../lib/errores.js'

const FILTROS = ['Próximos', 'Pasados', 'Todos']

export default function Eventos() {
  const [eventos, setEventos] = useState(null)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('Próximos')
  const [busqueda, setBusqueda] = useState('')
  const navegar = useNavigate()

  async function cargar() {
    const { data, error } = await supabase
      .from('eventos')
      .select('*, tipo:tipos_evento(nombre, color)')
      .order('inicio', { ascending: true })
    if (error) setError(mensajeError(error, 'No se pudieron cargar los eventos.'))
    else setEventos(data)
  }
  useEffect(() => {
    cargar()
  }, [])

  const visibles = useMemo(() => {
    if (!eventos) return []
    const ahora = Date.now()
    const termina = (e) => new Date(e.fin || e.inicio).getTime() + (e.todo_el_dia && !e.fin ? 86400000 : 0)
    let lista = eventos
    if (filtro === 'Próximos') lista = lista.filter((e) => termina(e) >= ahora)
    if (filtro === 'Pasados') lista = lista.filter((e) => termina(e) < ahora).reverse()
    const q = busqueda.trim().toLowerCase()
    if (q) lista = lista.filter((e) => `${e.titulo} ${e.lugar} ${e.tipo?.nombre || ''}`.toLowerCase().includes(q))
    return lista
  }, [eventos, filtro, busqueda])

  async function borrar(ev) {
    if (!window.confirm(`¿Borrar el evento «${ev.titulo}»? Esta acción no se puede deshacer.`)) return
    setError('')
    const { error } = await supabase.from('eventos').delete().eq('id', ev.id)
    if (error) return setError(mensajeError(error, 'No se pudo borrar el evento.'))
    const compartida = eventos.some((x) => x.id !== ev.id && x.imagen_url === ev.imagen_url)
    if (ev.imagen_url && !compartida) borrarImagen(ev.imagen_url)
    setEventos((l) => l.filter((x) => x.id !== ev.id))
  }

  async function alternar(ev, campo) {
    const valor = !ev[campo]
    setError('')
    setEventos((l) => l.map((x) => (x.id === ev.id ? { ...x, [campo]: valor } : x)))
    const { error } = await supabase.from('eventos').update({ [campo]: valor }).eq('id', ev.id)
    if (error) {
      setError(mensajeError(error, 'No se pudo guardar el cambio.'))
      cargar()
    }
  }

  return (
    <section className="adm-pagina">
      <header className="adm-cabecera">
        <div>
          <h1>Eventos</h1>
          <p>Lo que publiques aquí aparece en la agenda del sitio. Los eventos pasados se ocultan solos.</p>
        </div>
        <Link to="/admin/eventos/nuevo" className="adm-btn adm-btn--primario">
          + Nuevo evento
        </Link>
      </header>

      <div className="adm-barra">
        <div className="adm-pestanas" role="group" aria-label="Filtrar eventos">
          {FILTROS.map((f) => (
            <button key={f} type="button" aria-pressed={filtro === f} className={filtro === f ? 'is-on' : ''} onClick={() => setFiltro(f)}>
              {f}
            </button>
          ))}
        </div>
        <input
          className="adm-buscar"
          type="search"
          placeholder="Buscar…"
          aria-label="Buscar eventos por título, lugar o tipo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}
      {!eventos && !error && <p className="adm-vacio">Cargando…</p>}
      {eventos && visibles.length === 0 && (
        <div className="adm-vacio">
          <p>{filtro === 'Próximos' ? 'No hay eventos próximos.' : 'No hay eventos aquí.'}</p>
          <Link to="/admin/eventos/nuevo" className="adm-btn">
            Crear un evento
          </Link>
        </div>
      )}

      {visibles.length > 0 && (
        <table className="adm-tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Evento</th>
              <th>Tipo</th>
              <th>En el sitio</th>
              <th>Destacado</th>
              <th>
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((ev) => (
              <tr key={ev.id}>
                <td className="adm-nowrap" data-label="Fecha">
                  {fechaCorta(ev.inicio)}
                  {!ev.todo_el_dia && <small>{hora(ev.inicio)}</small>}
                </td>
                <td data-label="Evento">
                  <button className="adm-enlace adm-enlace--fuerte" onClick={() => navegar(`/admin/eventos/${ev.id}`)}>
                    {ev.titulo}
                  </button>
                  {ev.lugar && <small>{ev.lugar}</small>}
                </td>
                <td data-label="Tipo">
                  {ev.tipo ? (
                    <span className="adm-chip" style={{ '--c': ev.tipo.color }}>
                      {ev.tipo.nombre}
                    </span>
                  ) : (
                    <span className="adm-tenue">Sin tipo</span>
                  )}
                </td>
                <td data-label="En el sitio">
                  <label className="adm-switch">
                    <input
                      type="checkbox"
                      checked={ev.publicado}
                      onChange={() => alternar(ev, 'publicado')}
                      aria-label={`Publicar «${ev.titulo}» en el sitio`}
                    />
                    <span aria-hidden="true">{ev.publicado ? 'Publicado' : 'Borrador'}</span>
                  </label>
                </td>
                <td data-label="Destacado">
                  <label className="adm-switch">
                    <input
                      type="checkbox"
                      checked={ev.destacado}
                      onChange={() => alternar(ev, 'destacado')}
                      aria-label={`Destacar «${ev.titulo}» en Inicio`}
                    />
                    <span aria-hidden="true">{ev.destacado ? 'En Inicio' : 'No destacado'}</span>
                  </label>
                </td>
                <td className="adm-acciones">
                  <Link to={`/admin/eventos/${ev.id}`} className="adm-btn adm-btn--chico" aria-label={`Editar «${ev.titulo}»`}>
                    Editar
                  </Link>
                  <Link to={`/admin/eventos/nuevo?copiar=${ev.id}`} className="adm-btn adm-btn--chico" aria-label={`Duplicar «${ev.titulo}»`}>
                    Duplicar
                  </Link>
                  <button className="adm-btn adm-btn--chico adm-btn--peligro" onClick={() => borrar(ev)} aria-label={`Borrar «${ev.titulo}»`}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

/** Borra del almacenamiento una imagen subida desde el panel. */
export async function borrarImagen(url) {
  const marca = '/storage/v1/object/public/eventos/'
  const i = url.indexOf(marca)
  if (i === -1) return
  // no borrar si otro evento (por ejemplo, uno duplicado) todavía la usa
  const { count } = await supabase.from('eventos').select('id', { count: 'exact', head: true }).eq('imagen_url', url)
  if (count) return
  await supabase.storage.from('eventos').remove([decodeURIComponent(url.slice(i + marca.length))])
}
