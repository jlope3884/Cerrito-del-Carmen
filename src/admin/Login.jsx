import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import Emblema from '../components/Emblema.jsx'

export default function Login() {
  const [modo, setModo] = useState('entrar') // entrar | recuperar
  const [estado, setEstado] = useState({ cargando: false, error: '', aviso: '' })

  async function enviar(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setEstado({ cargando: true, error: '', aviso: '' })
    if (modo === 'entrar') {
      const { error } = await supabase.auth.signInWithPassword({ email: f.get('correo'), password: f.get('clave') })
      setEstado({ cargando: false, error: error ? 'Correo o contraseña incorrectos.' : '', aviso: '' })
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(f.get('correo'), {
        redirectTo: `${window.location.origin}/admin`,
      })
      setEstado({
        cargando: false,
        error: error ? 'No se pudo enviar el correo. Inténtalo de nuevo.' : '',
        aviso: error ? '' : 'Si el correo está registrado, te llegará un enlace para cambiar la contraseña.',
      })
    }
  }

  return (
    <div className="adm-centro">
      <form className="adm-caja adm-login" onSubmit={enviar}>
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
        {estado.error && <p className="adm-error">{estado.error}</p>}
        {estado.aviso && <p className="adm-ok">{estado.aviso}</p>}
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
    </div>
  )
}
