import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Historia from './pages/Historia.jsx'
import Arquitectura from './pages/Arquitectura.jsx'
import Galeria from './pages/Galeria.jsx'
import Visita from './pages/Visita.jsx'
import Celebraciones from './pages/Celebraciones.jsx'
import Ubicacion from './pages/Ubicacion.jsx'
import Contacto from './pages/Contacto.jsx'
import Donar from './pages/Donar.jsx'
import Privacidad from './pages/Privacidad.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'

// El panel se descarga aparte: los visitantes del sitio no lo cargan.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

const BASE = 'Cerrito del Carmen'
const META = {
  '/': ['Cerrito del Carmen · Santuario mariano de la Ciudad de Guatemala', 'Santuario de la Virgen del Carmen en la cima del cerro del Carmen, Centro Histórico de la Ciudad de Guatemala. Patrimonio Cultural de la Nación.'],
  '/historia': ['Historia', 'Del valle de las Vacas al santuario: Juan Corz, la Virgen del Carmen, los terremotos y la reconstrucción del Cerrito.'],
  '/arquitectura': ['Arquitectura ultrabarroca', 'Fachada ultrabarroca, torreón, retablo mayor, catacumbas, campanas y cruz papal del Cerrito del Carmen.'],
  '/galeria': ['Galería', 'Fotografías del santuario, la fiesta y la procesión, el parque y el archivo histórico de la reconstrucción.'],
  '/visita': ['Horarios y visita', 'Horarios, misas, qué ver y recomendaciones para visitar el Cerrito del Carmen y su parque.'],
  '/celebraciones': ['Celebraciones', 'Sacramentos, horarios de misa y la fiesta patronal de la Virgen del Carmen cada 16 de julio.'],
  '/ubicacion': ['Cómo llegar al Cerrito del Carmen', 'Cómo llegar al Cerrito del Carmen, en la cima del cerro en la zona 1 de la Ciudad de Guatemala: dirección, mapa, parqueo y puntos de referencia.'],
  '/contacto': ['Contacto', 'Escríbenos o llámanos: datos de contacto del santuario y preguntas frecuentes.'],
  '/donar': ['Donaciones al santuario', 'Apoya la conservación del Cerrito del Carmen: cuentas para transferencia o depósito, a dónde va tu aporte y otras formas de ayudar al santuario.'],
  '/privacidad': ['Privacidad y créditos', 'Política de privacidad y créditos del sitio del Cerrito del Carmen.'],
}
const NO_ENCONTRADA = ['Página no encontrada', 'La página que buscas no existe en el sitio del Cerrito del Carmen.']

/** Crea (si hace falta) y llena una etiqueta <meta>; con contenido null la quita. */
function ponerMeta(attr, nombre, contenido) {
  let el = document.head.querySelector(`meta[${attr}="${nombre}"]`)
  if (contenido == null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, nombre)
    document.head.appendChild(el)
  }
  el.setAttribute('content', contenido)
}

function Meta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const existe = Object.prototype.hasOwnProperty.call(META, pathname)
    const [titulo, desc] = existe ? META[pathname] : NO_ENCONTRADA
    // Sin repetir el nombre si el título ya lo lleva («Cómo llegar al Cerrito del Carmen»).
    const completo = pathname === '/' || titulo.includes(BASE) ? titulo : `${titulo} · ${BASE}`
    document.title = completo
    ponerMeta('name', 'description', desc)
    ponerMeta('property', 'og:title', completo)
    ponerMeta('property', 'og:description', desc)
    ponerMeta('name', 'twitter:title', completo)
    ponerMeta('name', 'twitter:description', desc)
    // El 404 no debe aparecer en buscadores.
    ponerMeta('name', 'robots', existe ? null : 'noindex')
  }, [pathname])
  return null
}

function leerScroll(key) {
  try {
    const v = sessionStorage.getItem('scroll:' + key)
    return v == null ? null : Number(v)
  } catch {
    return null
  }
}

function guardarScroll(key, y) {
  try {
    sessionStorage.setItem('scroll:' + key, String(Math.round(y)))
  } catch {
    /* sin sessionStorage (modo privado, bloqueado): no se recuerda la posición */
  }
}

/** ¿La página se cargó por recarga o con Atrás/Adelante (y no desde un enlace o la barra)? */
function volvioConHistorial() {
  try {
    const tipo = performance.getEntriesByType('navigation')[0]?.type
    return tipo === 'reload' || tipo === 'back_forward'
  } catch {
    return false
  }
}

const sinAnimacion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Posición de la página al navegar:
 * - ruta nueva: arriba del todo, sin animación (subir animando descargaría todas las fotos lazy)
 *   y con el foco en el contenido para lectores de pantalla y teclado;
 * - con #ancla: baja hasta la sección y la enfoca;
 * - Atrás / Adelante: vuelve a donde estabas.
 */
function ScrollManager() {
  const { hash, key } = useLocation()
  const tipo = useNavigationType()
  // Clave de la entrada con la que se abrió el sitio (en StrictMode el efecto corre dos veces).
  const claveInicial = useRef(key)
  // Pasa a true con la primera navegación dentro del sitio (volver luego a la entrada inicial ya no es «primera carga»).
  const yaNavego = useRef(false)

  // El navegador no debe restaurar por su cuenta: lo hacemos aquí.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // useLayoutEffect: se ejecuta antes de pintar la página nueva, sin saltos visibles,
  // y su limpieza lee la posición de la página anterior antes de cambiar el contenido.
  useLayoutEffect(() => {
    if (key !== claveInicial.current) yaNavego.current = true
    const esPrimera = !yaNavego.current

    // Al abrir el sitio, la entrada inicial siempre se llama 'default' y su posición guardada
    // podría ser de otra visita en la misma pestaña: solo se restaura si la pestaña se recargó
    // o se volvió al sitio con Atrás/Adelante. Dentro del sitio, Atrás siempre restaura.
    const restaurar = tipo === 'POP' && (!esPrimera || volvioConHistorial())
    const guardada = restaurar ? leerScroll(key) : null
    if (guardada != null) {
      window.scrollTo({ top: guardada, left: 0, behavior: 'instant' })
    } else if (hash) {
      let destino = null
      try {
        destino = document.getElementById(decodeURIComponent(hash.slice(1)))
      } catch {
        destino = null
      }
      if (destino) {
        destino.scrollIntoView({ behavior: sinAnimacion() ? 'instant' : 'smooth', block: 'start' })
        if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1')
        destino.focus({ preventScroll: true })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      if (!esPrimera) document.getElementById('contenido')?.focus({ preventScroll: true })
    }

    // Al recargar la pestaña no hay limpieza de React: guardar también al salir.
    const alSalir = () => guardarScroll(key, window.scrollY)
    window.addEventListener('pagehide', alSalir)
    return () => {
      window.removeEventListener('pagehide', alSalir)
      guardarScroll(key, window.scrollY)
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

/** Si una página falla al pintarse, muestra un aviso en lugar de dejar la pantalla en blanco. */
class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  componentDidUpdate(prev) {
    // Al ir a otra página se vuelve a intentar.
    if (this.state.error && prev.ruta !== this.props.ruta) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <section className="section">
        <div className="shell stack stack--md" role="alert">
          <h1 style={{ fontSize: '1.8rem' }}>No pudimos cargar esta página</h1>
          <p className="lead">Revisa tu conexión e inténtalo de nuevo.</p>
          <div>
            <button type="button" className="btn btn--dark" onClick={() => window.location.reload()}>
              Recargar
            </button>
          </div>
        </div>
      </section>
    )
  }
}

export default function App() {
  const { pathname } = useLocation()
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return (
      <ErrorBoundary ruta={pathname}>
        <Suspense fallback={<p className="adm-vacio">Cargando el panel…</p>}>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    )
  }
  return (
    <>
      <ScrollManager />
      <Meta />
      <a
        href="#contenido"
        className="saltar"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('contenido')?.focus()
        }}
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <ErrorBoundary ruta={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/arquitectura" element={<Arquitectura />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/visita" element={<Visita />} />
            <Route path="/celebraciones" element={<Celebraciones />} />
            <Route path="/ubicacion" element={<Ubicacion />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/donar" element={<Donar />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
