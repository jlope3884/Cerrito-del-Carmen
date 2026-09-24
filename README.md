# Cerrito del Carmen — sitio web (demo)

Demo del sitio del Santuario del Cerrito del Carmen, hecha en **React + Vite** con CSS propio
(sin frameworks de estilos). Sigue el diseño de Figma del proyecto de Horas de Extensión (UVG).

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:5173
```

Para generar la versión de producción:

```bash
npm run build    # queda en dist/
npm run preview  # sirve dist/ para revisarlo
```

## Estructura

```
src/
  data/site.js          ← TODO el contenido del sitio (textos, horarios, cuentas, FAQ)
  components/           ← Header, Footer, control de música, piezas compartidas
  pages/                ← Inicio, Historia, Visita, Donar
  styles/global.css     ← tokens de color y tipografía + utilidades
public/
  audio/                ← aquí va canto-gregoriano.mp3 (música ambiental)
  img/                  ← aquí van las fotos cuando la parroquia las entregue
```

**Regla práctica:** casi todo lo que la parroquia querrá cambiar está en `src/data/site.js`.

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| `--cream` | `#FAF7F1` | fondo general |
| `--ink` | `#211A15` | texto principal, header y footer |
| `--gold` | `#C6A15B` | acento, filetes, estados activos |
| `--gold-deep` | `#B38C47` | eyebrows sobre fondo claro |
| `--muted` | `#4D4238` | texto de párrafo |
| `--border` | `#D1C4B3` | bordes de tarjetas |

Tipografías (Google Fonts): **Cinzel** para títulos, **Inter** para interfaz y texto,
**Cormorant Garamond** itálica para citas.

## Pendientes

- Fotografías reales: los bloques grises con texto son marcadores; se sustituyen por `<img>`.
- Música ambiental: colocar `public/audio/canto-gregoriano.mp3`. Si el archivo no existe, el
  control desaparece solo.
- Confirmar con la parroquia: números de cuenta, correos, horarios de misa y el aviso legal.
- Faltan las secciones de Arquitectura, Galería, Eventos/Celebraciones, Ubicación y Contacto,
  y el panel administrativo.
