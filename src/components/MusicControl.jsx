import { useEffect, useRef, useState } from 'react'
import './music.css'

/**
 * Música ambiental (canto gregoriano).
 * El archivo va en public/audio/canto-gregoriano.mp3 — si no existe,
 * el control se oculta solo en vez de reventar.
 */
export default function MusicControl() {
  const audioRef = useRef(null)
  const [sonando, setSonando] = useState(false)
  const [disponible, setDisponible] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const falla = () => setDisponible(false)
    audio.addEventListener('error', falla)
    return () => audio.removeEventListener('error', falla)
  }, [])

  async function alternar() {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (sonando) {
        audio.pause()
        setSonando(false)
      } else {
        await audio.play()
        setSonando(true)
      }
    } catch {
      setDisponible(false)
    }
  }

  if (!disponible) return null

  return (
    <>
      <button
        type="button"
        className={'music' + (sonando ? ' is-on' : '')}
        onClick={alternar}
        aria-pressed={sonando}
        title={sonando ? 'Silenciar la música ambiental' : 'Escuchar canto gregoriano'}
      >
        <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true">
          <circle cx="3" cy="9.2" r="2.4" fill="currentColor" />
          <rect x="4.9" y="1.2" width="1.2" height="8" fill="currentColor" />
          <path d="M6.1 1.2 L10 0.2 V2.9 L6.1 3.9 Z" fill="currentColor" />
        </svg>
        <span>Música</span>
        {sonando && <i className="music__dot" aria-hidden="true" />}
      </button>
      <audio ref={audioRef} loop preload="none" src="/audio/canto-gregoriano.mp3" />
    </>
  )
}
