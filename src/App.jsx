import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

const BASE = 'Cerrito del Carmen'
const META = {
  '/': ['Cerrito del Carmen · Santuario mariano de la Ciudad de Guatemala', 'Santuario de la Virgen del Carmen en la cima del cerro del Carmen, Centro Histórico de la Ciudad de Guatemala. Patrimonio Cultural de la Nación.'],
  '/historia': ['Historia', 'Del valle de las Vacas al santuario: Juan Corz, la Virgen del Carmen, los terremotos y la reconstrucción del Cerrito.'],
  '/arquitectura': ['Arquitectura', 'Fachada ultrabarroca, torreón, retablo mayor, catacumbas, campanas y cruz papal del Cerrito del Carmen.'],
  '/galeria': ['Galería', 'Fotografías del santuario, la fiesta y la procesión, el parque y el archivo histórico de la reconstrucción.'],
  '/visita': ['Visita', 'Horarios, misas, qué ver y recomendaciones para visitar el Cerrito del Carmen y su parque.'],
  '/celebraciones': ['Celebraciones', 'Sacramentos, horarios de misa y la fiesta patronal de la Virgen del Carmen cada 16 de julio.'],
  '/ubicacion': ['Ubicación', 'Cómo llegar al Cerrito del Carmen en la Zona 1 de la Ciudad de Guatemala.'],
  '/contacto': ['Contacto', 'Escríbenos o llámanos: datos de contacto del santuario y preguntas frecuentes.'],
  '/donar': ['Donar', 'Apoya la conservación del santuario del Cerrito del Carmen.'],
  '/privacidad': ['Privacidad y créditos', 'Política de privacidad y créditos del sitio del Cerrito del Carmen.'],
}

function Meta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const [titulo, desc] = META[pathname] || ['Página no encontrada', META['/'][1]]
    document.title = pathname === '/' ? titulo : `${titulo} · ${BASE}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
  }, [pathname])
  return null
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Meta />
      <Header />
      <main>
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
      </main>
      <Footer />
    </>
  )
}
