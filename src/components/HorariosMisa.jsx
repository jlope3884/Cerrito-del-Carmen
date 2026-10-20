import { sinViuda } from '../lib/texto.js'

/**
 * Tarjetas con los horarios de misa (de Ajustes del CRM o de site.js).
 * Se usa en Visita y en Celebraciones.
 */
export default function HorariosMisa({ misas = [] }) {
  return (
    <div className="horarios">
      {misas.map((m) => (
        // El CRM puede tener dos filas con los mismos días: la clave no puede ser solo m.dias.
        <div key={m.id ?? `${m.dias}-${m.hora}`} className="card horario">
          <span className="label">{m.dias}</span>
          <h3 className="horario__hora">{sinViuda(m.hora)}</h3>
          {m.detalle && <p>{m.detalle}</p>}
        </div>
      ))}
    </div>
  )
}
