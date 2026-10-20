import { useEffect, useId, useRef } from 'react'

const ENFOCABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Visor a pantalla completa para fotos y documentos (Galería y Documentos).
 * Usa las clases .visor de pages.css. Al abrir enfoca «Cerrar», mantiene el foco
 * dentro del visor y, al cerrar, lo devuelve al elemento que lo abrió.
 */
export default function Visor({ img, alt = '', titulo, pie, enlaceOriginal, onCerrar }) {
  const idPie = useId()
  const cajaRef = useRef(null)
  const cerrarRef = useRef(null)
  const onCerrarRef = useRef(onCerrar)
  onCerrarRef.current = onCerrar

  useEffect(() => {
    const previo = document.activeElement
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrarRef.current?.focus()

    function teclas(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCerrarRef.current?.()
        return
      }
      if (e.key !== 'Tab' || !cajaRef.current) return
      const lista = [...cajaRef.current.querySelectorAll(ENFOCABLES)]
      if (!lista.length) return
      const primero = lista[0]
      const ultimo = lista[lista.length - 1]
      const dentro = cajaRef.current.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === primero || !dentro)) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && (document.activeElement === ultimo || !dentro)) {
        e.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', teclas)
    return () => {
      document.removeEventListener('keydown', teclas)
      document.body.style.overflow = overflowPrevio
      if (previo && typeof previo.focus === 'function' && document.contains(previo)) previo.focus()
    }
  }, [])

  return (
    <div
      className="visor"
      role="dialog"
      aria-modal="true"
      aria-labelledby={idPie}
      ref={cajaRef}
      onClick={() => onCerrar?.()}
    >
      <figure className="visor__fig" onClick={(e) => e.stopPropagation()}>
        <img src={img} alt={alt} />
        <figcaption>
          <span id={idPie}>{pie ?? titulo ?? alt}</span>
          <span style={{ display: 'flex', gap: '10px' }}>
            {enlaceOriginal && (
              <a className="visor__cerrar" href={enlaceOriginal} target="_blank" rel="noreferrer">
                Ver original<span className="visually-hidden"> (se abre en una pestaña nueva)</span>
              </a>
            )}
            <button type="button" className="visor__cerrar" ref={cerrarRef} onClick={() => onCerrar?.()}>
              Cerrar <span aria-hidden="true">✕</span>
            </button>
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
