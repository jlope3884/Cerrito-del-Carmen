/** Piezas pequeñas que se repiten en varias páginas. */
import { Link } from 'react-router-dom'

/** Encabezado oscuro de página interior. */
export function PageHero({ eyebrow, titulo, texto }) {
  return (
    <section className="pagehero">
      <div className="shell stack stack--md">
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>{titulo}</h1>
        {texto && <p className="pagehero__text">{texto}</p>}
      </div>
    </section>
  )
}

/**
 * Foto del sitio.
 * Con `src` muestra la imagen real; sin ella, el marcador gris con el texto.
 * Así, cuando la parroquia entregue el material, solo se llena `img` en site.js.
 * Con `prioridad` la imagen se pide de inmediato (solo para las que se ven al cargar).
 */
export function Foto({ src, alt = '', tam = 'foto--md', pos, pie, prioridad = false, children }) {
  if (src) {
    return (
      <figure className={'foto ' + tam} style={{ margin: 0 }}>
        <img
          src={src}
          alt={alt}
          loading={prioridad ? 'eager' : 'lazy'}
          fetchpriority={prioridad ? 'high' : undefined /* en minúsculas: React 18 no conoce fetchPriority */}
          decoding="async"
          style={pos ? { objectPosition: pos } : undefined}
        />
        {pie && <figcaption className="foto__pie">{pie}</figcaption>}
      </figure>
    )
  }
  return (
    <div className={'foto foto--vacia ' + tam} role="img" aria-label={alt}>
      <span className="foto__emblema" aria-hidden="true">✝</span>
      {children || <span className="foto__vacia-texto">{alt}</span>}
    </div>
  )
}

/** Encabezado de sección con filete dorado. */
export function TituloSeccion({ eyebrow, titulo, texto, claro = false }) {
  return (
    <div className="section__head">
      <hr className="rule" />
      <p className={'eyebrow' + (claro ? ' eyebrow--light' : '')}>{eyebrow}</p>
      <h2>{titulo}</h2>
      {texto && <p className="lead">{texto}</p>}
    </div>
  )
}

/** Bloque "Siguiente" al pie de cada página (con <Link> para no recargar el sitio ni cortar la música). */
export function Siguiente({ titulo, to, children }) {
  return (
    <section className="section section--tight">
      <div className="shell stack stack--md">
        <p className="eyebrow">Siguiente</p>
        <h2>{titulo}</h2>
        <div>
          <Link to={to} className="btn btn--dark">
            {children} →
          </Link>
        </div>
      </div>
    </section>
  )
}
