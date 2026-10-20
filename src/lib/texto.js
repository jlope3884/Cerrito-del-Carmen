/** Ayudas pequeñas para escribir bien los datos dentro de una frase. No cambian ningún dato. */

/**
 * «Padre Edwin Muñoz» → «padre Edwin Muñoz», para escribir «el padre Edwin Muñoz»
 * sin pasar a minúsculas el nombre propio.
 */
export function tratamiento(p = '') {
  return String(p).replace(/^(Padre|Fray|Monseñor|Hermano|Rector|Capellán)(?=\s|$)/, (m) => m.toLowerCase())
}

/** Enlace tel: con prefijo de Guatemala (+502), quite o no el número espacios o el prefijo. */
export function telHref(t = '') {
  const d = String(t).replace(/\D/g, '')
  return 'tel:+' + (d.startsWith('502') && d.length > 8 ? d : '502' + d)
}

/**
 * Une la hora con su unidad con un espacio de no separación («7:00 h», «6:00 p.m.»)
 * para que la unidad no quede sola al principio de una línea.
 */
export function sinViuda(s = '') {
  return String(s).replace(/ (h|a\.m\.|p\.m\.)(?=$|[\s,.;)])/g, ' $1')
}
