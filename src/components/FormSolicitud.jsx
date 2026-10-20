import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { enviarSolicitud } from '../lib/datos.js'
import { deISO } from '../lib/fechas.js'

const TIPOS = ['Bautismo', 'Primera Comunión', 'Confirmación', 'Matrimonio', 'Reconciliación', 'Unción de los enfermos', 'Otra celebración']

/** Formulario público: la solicitud llega a la sección Solicitudes del panel. */
export default function FormSolicitud() {
  const [estado, setEstado] = useState('listo') // listo | enviando | enviado | error | limite
  const [aviso, setAviso] = useState('') // aviso de validación: nombre o datos de contacto
  const [campoAviso, setCampoAviso] = useState('') // 'nombre' | 'contacto'
  const exitoRef = useRef(null)
  const nombreRef = useRef(null)
  const telefonoRef = useRef(null)

  // Al enviarse, el foco pasa al mensaje de confirmación para que se anuncie
  useEffect(() => {
    if (estado === 'enviado') exitoRef.current?.focus()
  }, [estado])

  // Hoy según la hora de Guatemala (con UTC, después de las 18:00 no dejaba elegir hoy)
  const hoy = deISO(new Date().toISOString()).fecha

  async function enviar(e) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    if (d.get('sitio_web')) return // campo trampa para bots
    const nombre = String(d.get('nombre') || '').trim()
    const telefono = String(d.get('telefono') || '').trim()
    const correo = String(d.get('correo') || '').trim()
    if (!nombre) {
      setCampoAviso('nombre')
      setAviso('Escribe tu nombre.')
      nombreRef.current?.focus()
      return
    }
    if (!telefono && !correo) {
      setCampoAviso('contacto')
      setAviso('Déjanos un teléfono o un correo para poder responderte.')
      telefonoRef.current?.focus()
      return
    }
    setAviso('')
    setCampoAviso('')
    setEstado('enviando')
    try {
      await enviarSolicitud({
        tipo: d.get('tipo'),
        nombre,
        telefono,
        correo,
        fecha_preferida: d.get('fecha') || null,
        mensaje: String(d.get('mensaje') || '').trim(),
        consentimiento: true,
      })
      setEstado('enviado')
      form.reset()
    } catch (err) {
      setEstado(err?.codigo === 'limite' ? 'limite' : 'error')
    }
  }

  if (estado === 'enviado') {
    return (
      <div className="exito" role="status" tabIndex={-1} ref={exitoRef}>
        Recibimos tu solicitud. El despacho parroquial te contactará para confirmar la fecha y explicarte los requisitos.
      </div>
    )
  }

  const errorNombre = campoAviso === 'nombre' && !!aviso
  const errorContacto = campoAviso === 'contacto' && !!aviso
  const describeContacto = 'ayuda-contacto' + (errorContacto ? ' aviso-contacto' : '')

  return (
    <form className="form" onSubmit={enviar}>
      <div className="form__row">
        <label>
          <span className="label">Celebración</span>
          <select name="tipo" required aria-required="true" defaultValue="">
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
          <input type="date" name="fecha" min={hoy} />
        </label>
      </div>
      <label>
        <span className="label">Nombre</span>
        <input
          ref={nombreRef}
          type="text"
          name="nombre"
          required
          aria-required="true"
          aria-invalid={errorNombre}
          aria-describedby={errorNombre ? 'aviso-contacto' : undefined}
          maxLength={120}
          autoComplete="name"
          placeholder="Tu nombre completo"
        />
      </label>
      <div className="form__row">
        <label>
          <span className="label">Teléfono</span>
          <input
            ref={telefonoRef}
            type="tel"
            name="telefono"
            maxLength={40}
            autoComplete="tel"
            placeholder="5555 5555"
            aria-describedby={describeContacto}
            aria-invalid={errorContacto}
          />
        </label>
        <label>
          <span className="label">Correo</span>
          <input
            type="email"
            name="correo"
            maxLength={160}
            autoComplete="email"
            placeholder="tu@correo.com"
            aria-describedby={describeContacto}
            aria-invalid={errorContacto}
          />
        </label>
      </div>
      <small id="ayuda-contacto" className="note" style={{ marginTop: '-8px' }}>
        Déjanos al menos uno de los dos.
      </small>
      <label>
        <span className="label">Mensaje (opcional)</span>
        <textarea name="mensaje" maxLength={3000} placeholder="Cuéntanos lo que necesitas…" />
      </label>
      <input type="text" name="sitio_web" className="form__trampa" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="form__consentimiento">
        <input type="checkbox" required aria-required="true" />
        <span>
          Acepto que el santuario use estos datos solo para atender mi solicitud. Más información en la{' '}
          <Link to="/privacidad">política de privacidad</Link>.
        </span>
      </label>
      {aviso && (
        <p className="form__error" id="aviso-contacto" role="alert">
          {aviso}
        </p>
      )}
      {estado === 'error' && (
        <p className="form__error" role="alert">
          No pudimos enviar tu solicitud. Inténtalo de nuevo o llámanos.
        </p>
      )}
      {estado === 'limite' && (
        <p className="form__error" role="alert">
          Recibimos muchas solicitudes en poco tiempo. Inténtalo más tarde o llámanos.
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
