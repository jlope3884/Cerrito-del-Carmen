import { useState } from 'react'
import { Link } from 'react-router-dom'
import { enviarSolicitud } from '../lib/datos.js'

const TIPOS = ['Bautismo', 'Primera Comunión', 'Confirmación', 'Matrimonio', 'Reconciliación', 'Unción de los enfermos', 'Otra celebración']

/** Formulario público: la solicitud llega a la sección Solicitudes del panel. */
export default function FormSolicitud() {
  const [estado, setEstado] = useState('listo') // listo | enviando | enviado | error
  const [aviso, setAviso] = useState('')

  async function enviar(e) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    if (d.get('sitio_web')) return // campo trampa para bots
    const telefono = String(d.get('telefono') || '').trim()
    const correo = String(d.get('correo') || '').trim()
    if (!telefono && !correo) return setAviso('Déjanos un teléfono o un correo para poder responderte.')
    setAviso('')
    setEstado('enviando')
    try {
      await enviarSolicitud({
        tipo: d.get('tipo'),
        nombre: String(d.get('nombre')).trim(),
        telefono,
        correo,
        fecha_preferida: d.get('fecha') || null,
        mensaje: String(d.get('mensaje') || '').trim(),
        consentimiento: true,
      })
      setEstado('enviado')
      form.reset()
    } catch {
      setEstado('error')
    }
  }

  if (estado === 'enviado') {
    return (
      <div className="exito" role="status">
        Recibimos tu solicitud. El despacho parroquial te contactará para confirmar la fecha y explicarte los requisitos.
      </div>
    )
  }

  return (
    <form className="form" onSubmit={enviar}>
      <div className="form__row">
        <label>
          <span className="label">Celebración</span>
          <select name="tipo" required defaultValue="">
            <option value="" disabled>
              Elige una opción
            </option>
            {TIPOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Fecha que prefieres (opcional)</span>
          <input type="date" name="fecha" min={new Date().toISOString().slice(0, 10)} />
        </label>
      </div>
      <label>
        <span className="label">Nombre</span>
        <input type="text" name="nombre" required maxLength={120} autoComplete="name" placeholder="Tu nombre completo" />
      </label>
      <div className="form__row">
        <label>
          <span className="label">Teléfono</span>
          <input type="tel" name="telefono" maxLength={40} autoComplete="tel" placeholder="5555 5555" />
        </label>
        <label>
          <span className="label">Correo</span>
          <input type="email" name="correo" maxLength={160} autoComplete="email" placeholder="tu@correo.com" />
        </label>
      </div>
      <label>
        <span className="label">Mensaje (opcional)</span>
        <textarea name="mensaje" maxLength={3000} placeholder="Cuéntanos lo que necesitas…" />
      </label>
      <input type="text" name="sitio_web" className="form__trampa" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="form__consentimiento">
        <input type="checkbox" required />
        <span>
          Acepto que el santuario use estos datos solo para atender mi solicitud. Más información en la{' '}
          <Link to="/privacidad">política de privacidad</Link>.
        </span>
      </label>
      {aviso && <p className="form__error">{aviso}</p>}
      {estado === 'error' && (
        <p className="form__error" role="alert">
          No pudimos enviar tu solicitud. Inténtalo de nuevo o llámanos.
        </p>
      )}
      <div>
        <button type="submit" className="btn btn--dark" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando…' : 'Enviar solicitud →'}
        </button>
      </div>
    </form>
  )
}
