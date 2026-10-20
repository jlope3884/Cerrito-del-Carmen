import { useEffect } from 'react'

export const PREGUNTA_SALIR = 'Tienes cambios sin guardar. ¿Salir?'

/** Mientras haya cambios sin guardar, el navegador pregunta antes de cerrar o recargar la pestaña. */
export function useAvisoSinGuardar(sucio) {
  useEffect(() => {
    if (!sucio) return
    const aviso = (e) => {
      e.preventDefault()
      e.returnValue = '' // necesario en algunos navegadores para que aparezca el aviso
    }
    window.addEventListener('beforeunload', aviso)
    return () => window.removeEventListener('beforeunload', aviso)
  }, [sucio])
}

/** Para enlaces de salida (Cancelar, ← Eventos): si hay cambios, pide confirmación. */
export const confirmarSalida = (sucio) => (e) => {
  if (sucio && !window.confirm(PREGUNTA_SALIR)) e.preventDefault()
}
