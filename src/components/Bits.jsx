/** Piezas pequeñas que se repiten en varias páginas. */

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

/** Marcador de imagen: se reemplaza cuando la parroquia entregue las fotos. */
export function Foto({ children, alto = '' }) {
  return <div className={'ph ' + alto}>{children}</div>
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
