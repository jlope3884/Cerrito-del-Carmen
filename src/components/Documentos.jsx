import { useState } from 'react'

/** Rejilla de documentos históricos (escaneos). Se muestran completos y se amplían al hacer clic. */
export default function Documentos({ items, claro = false }) {
  const [abierto, setAbierto] = useState(null)
  return (
    <>
      <div className={'docs' + (claro ? ' docs--claro' : '')}>
        {items.map((d) => (
          <button key={d.img} className="doc" onClick={() => setAbierto(d)} aria-label={'Ampliar: ' + d.titulo}>
            <span className="doc__img">
              <img src={d.img} alt={d.titulo} loading="lazy" />
            </span>
            <span className="doc__fecha">{d.fecha}</span>
            <span className="doc__titulo">{d.titulo}</span>
            <span className="doc__texto">{d.texto}</span>
          </button>
        ))}
      </div>

      {abierto && (
        <div className="visor" role="dialog" aria-modal="true" aria-label={abierto.titulo} onClick={() => setAbierto(null)}>
          <figure className="visor__fig" onClick={(e) => e.stopPropagation()}>
            <img src={abierto.img} alt={abierto.titulo} />
            <figcaption>
              <span>
                <strong>{abierto.titulo}</strong> · {abierto.fecha}
              </span>
              <span style={{ display: 'flex', gap: '10px' }}>
                <a className="visor__cerrar" href={abierto.img} target="_blank" rel="noreferrer">
                  Ver original
                </a>
                <button className="visor__cerrar" onClick={() => setAbierto(null)}>
                  Cerrar ✕
                </button>
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
