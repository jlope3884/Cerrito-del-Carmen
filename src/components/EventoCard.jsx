import { diaNumero, mesCorto, cuando } from '../lib/fechas.js'
import './evento.css'

/** Tarjeta de un evento del CRM. Se usa en el sitio y en la vista previa del panel. */
export default function EventoCard({ ev, compacta = false }) {
  const color = ev.tipo?.color || 'var(--gold-deep)'
  return (
    <article className={'evento' + (compacta ? ' evento--compacta' : '') + (ev.imagen_url ? ' evento--foto' : '')}>
      {ev.imagen_url && (
        <div className="evento__foto">
          <img src={ev.imagen_url} alt="" loading="lazy" />
        </div>
      )}
      <div className="evento__fecha" style={{ borderColor: color }}>
        <span className="evento__dia">{diaNumero(ev.inicio)}</span>
        <span className="evento__mes">{mesCorto(ev.inicio)}</span>
      </div>
      <div className="evento__cuerpo">
        {ev.tipo?.nombre && (
          <span className="evento__tipo" style={{ color }}>
            <i style={{ background: color }} aria-hidden="true" />
            {ev.tipo.nombre}
          </span>
        )}
        <h3 className="evento__titulo">{ev.titulo || 'Título del evento'}</h3>
        <p className="evento__cuando">{cuando(ev)}</p>
        {ev.lugar && <p className="evento__lugar">{ev.lugar}</p>}
        {!compacta && ev.descripcion && <p className="evento__desc">{ev.descripcion}</p>}
        {ev.boton_texto && ev.boton_url && (
          <a className="btn btn--ghost-dark evento__boton" href={ev.boton_url} target="_blank" rel="noreferrer">
            {ev.boton_texto} →
          </a>
        )}
      </div>
    </article>
  )
}
