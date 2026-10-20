import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { esErrorDeRed, SIN_CONEXION } from '../lib/errores.js'
import Emblema from '../components/Emblema.jsx'

/** Solo un 400 de Supabase significa credenciales malas; lo demás no es culpa de quien escribe. */
function textoError(error, modo) {
  if (esErrorDeRed(error) || error?.status === 0) return SIN_CONEXION
  if (modo === 'entrar') {
    if (error?.status === 400) return 'Correo o contraseña incorrectos.'
    if (error?.status === 429) return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
    return 'No se pudo iniciar sesión. Inténtalo de nuevo en unos minutos.'
  }
  if (error?.status === 429) return 'Ya se enviaron varios correos. Espera unos minutos antes de pedir otro.'
  return 'No se pudo enviar el correo. Inténtalo de nuevo.'
}

export default function Login() {
  const [modo, setModo] = useState('entrar') // entrar | recuperar
  const [estado, setEstado] = useState({ cargando: false, error: '', aviso: '' })

  async function enviar(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setEstado({ cargando: true, error: '', aviso: '' })
    try {
      if (modo === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email: f.get('correo'), password: f.get('clave') })
        setEstado({ cargando: false, error: error ? textoError(error, 'entrar') : '', aviso: '' })
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(f.get('correo'), {
          redirectTo: `${window.location.origin}/admin`,
        })
        setEstado({
          cargando: false,
          error: error ? textoError(error, 'recuperar') : '',
          aviso: error ? '' : 'Si el correo está registrado, te llegará un enlace para cambiar la contraseña.',
        })
      }
    } catch (err) {
      setEstado({ cargando: false, error: textoError(err, modo), aviso: '' })
    }
  }

  return (
    <div className="adm-centro">
      <main className="adm-caja">
        <form className="adm-login" onSubmit={enviar}>
          <div className="adm-login__marca">
            <Emblema size={36} />
            <div>
              <strong>Cerrito del Carmen</strong>
              <span>Panel del santuario</span>
            </div>
          </div>
          <h1>{modo === 'entrar' ? 'Iniciar sesión' : 'Recuperar contraseña'}</h1>
          <label className="adm-campo">
            <span>Correo</span>
            <input type="email" name="correo" required autoComplete="username" />
          </label>
          {modo === 'entrar' && (
            <label className="adm-campo">
              <span>Contraseña</span>
              <input type="password" name="clave" required autoComplete="current-password" />
            </label>
          )}
          {estado.error && (
            <p className="adm-error" role="alert">
              {estado.error}
            </p>
          )}
          {estado.aviso && (
            <p className="adm-ok" role="status">
              {estado.aviso}
            </p>
          )}
          <button className="adm-btn adm-btn--primario" disabled={estado.cargando}>
            {estado.cargando ? 'Un momento…' : modo === 'entrar' ? 'Entrar' : 'Enviar enlace'}
          </button>
          <button
            type="button"
            className="adm-enlace"
            onClick={() => {
              setModo(modo === 'entrar' ? 'recuperar' : 'entrar')
              setEstado({ cargando: false, error: '', aviso: '' })
            }}
          >
            {modo === 'entrar' ? '¿Olvidaste tu contraseña?' : 'Volver a iniciar sesión'}
          </button>
        </form>
      </main>
    </div>
  )
}
