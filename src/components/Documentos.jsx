import { useState } from 'react'
import Visor from './Visor.jsx'

/** Rejilla de documentos históricos (escaneos). Se muestran completos y se amplían al hacer clic. */
export default function Documentos({ items, claro = false }) {
  const [abierto, setAbierto] = useState(null)

  return (
    <>
      <div className={'docs' + (claro ? ' docs--claro' : '')}>
        {items.map((d) => (
          <button key={d.img} type="button" className="doc" onClick={() => setAbierto(d)}>
            <span className="visually-hidden">Ampliar: </span>
            <span className="doc__img">
              <img src={d.img} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="doc__fecha">{d.fecha}</span>
            <span className="doc__titulo">{d.titulo}</span>
            <span className="doc__texto">{d.texto}</span>
          </button>
        ))}
      </div>

      {abierto && (
        <Visor
          img={abierto.img}
          alt={abierto.titulo}
          pie={
            <>
              <strong>{abierto.titulo}</strong> · {abierto.fecha}
            </>
          }
          enlaceOriginal={abierto.img}
          onCerrar={() => setAbierto(null)}
        />
      )}
    </>
  )
}
