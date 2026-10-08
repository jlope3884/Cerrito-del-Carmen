import { useEffect, useState } from 'react'
import './music.css'

/**
 * Música ambiental: «Veni Sancte Spiritus», canto gregoriano (dominio público,
 * Wikimedia Commons). Archivo: public/audio/canto-gregoriano.mp3
 *
 * Hay un solo reproductor para todo el sitio, aunque el botón aparezca en la barra
 * superior y en el menú móvil: así la música no se duplica y sigue sonando al
 * cambiar de página. Los navegadores no permiten reproducir sin un clic, por eso
 * empieza en pausa.
 */
let audio = null
const oyentes = new Set()

function obtenerAudio() {
  if (!audio && typeof Audio !== 'undefined') {
    audio = new Audio('/audio/canto-gregoriano.mp3')
    audio.loop = true
    audio.preload = 'none'
    audio.volume = 0.45
    const avisar = () => oyentes.forEach((fn) => fn())
    audio.addEventListener('play', avisar)
    audio.addEventListener('pause', avisar)
    audio.addEventListener('error', avisar)
  }
  return audio
}

export default function MusicControl() {
  const [, refrescar] = useState(0)

  useEffect(() => {
    const fn = () => refrescar((n) => n + 1)
    oyentes.add(fn)
    return () => oyentes.delete(fn)
  }, [])

  const a = audio
  const sonando = !!a && !a.paused
  const disponible = !a || !a.error

  async function alternar() {
    const reproductor = obtenerAudio()
    if (!reproductor) return
    try {
      if (reproductor.paused) await reproductor.play()
      else reproductor.pause()
    } catch {
      oyentes.forEach((fn) => fn())
    }
  }

  if (!disponible) return null

  return (
    <button
      type="button"
      className={'music' + (sonando ? ' is-on' : '')}
      onClick={alternar}
      aria-pressed={sonando}
      title={sonando ? 'Pausar la música ambiental' : 'Escuchar canto gregoriano'}
    >
      <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true">
        <circle cx="3" cy="9.2" r="2.4" fill="currentColor" />
        <rect x="4.9" y="1.2" width="1.2" height="8" fill="currentColor" />
        <path d="M6.1 1.2 L10 0.2 V2.9 L6.1 3.9 Z" fill="currentColor" />
      </svg>
      <span>{sonando ? 'Pausar música' : 'Música'}</span>
      {sonando && <i className="music__dot" aria-hidden="true" />}
    </button>
  )
}
