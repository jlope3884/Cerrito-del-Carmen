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
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
