/* ==========================================================================
   Contenido del sitio en un solo lugar.
   Editar aquí es lo único que necesita la parroquia para actualizar el sitio.
   ========================================================================== */

export const site = {
  nombre: 'Cerrito del Carmen',
  ciudad: 'Ciudad de Guatemala',
  tagline: 'Santuario mariano · Patrimonio Cultural de la Nación',
  descripcion:
    'Santuario mariano en la cima del cerro del Carmen, uno de los monumentos coloniales más antiguos de la Ciudad de Guatemala.',
  parroco: 'Padre Edwin Muñoz',
  direccion: '1a calle y 12 avenida, Zona 1, Ciudad de Guatemala, 01001',
  telefono: '2232 4988',
  // TODO: confirmar con la parroquia antes de publicar
  correo: 'info@cerritodelcarmen.gt',
  correoDonaciones: 'donaciones@cerritodelcarmen.gt',
}

export const nav = [
  { label: 'Historia', to: '/historia' },
  { label: 'Visita', to: '/visita' },
  { label: 'Donar', to: '/donar' },
]

export const redes = [
  { nombre: 'Facebook', url: '#', icono: 'facebook' },
  { nombre: 'Instagram', url: '#', icono: 'instagram' },
  { nombre: 'YouTube', url: '#', icono: 'youtube' },
]

export const horarios = {
  visita: 'Todos los días, de 6:00 a 18:00 h',
  misas: [
    {
      dias: 'Martes a viernes',
      hora: '7:00 h',
      detalle: 'Misa diaria entre semana en el templo del santuario.',
    },
    {
      dias: 'Domingo',
      hora: '9:00, 11:00 y 16:00 h',
      detalle: 'Tres celebraciones dominicales; la de 11:00 se transmite en línea.',
    },
    {
      dias: 'Sábado y lunes',
      hora: 'Sin misa',
      detalle: 'El sábado no hay celebración y el lunes el templo permanece cerrado.',
    },
  ],
  aviso:
    'Los horarios pueden variar durante la fiesta patronal y las celebraciones especiales. Confírmalos con el santuario antes de tu visita.',
}

export const cuentas = [
  {
    banco: 'Banco Industrial',
    tipo: 'Monetaria en quetzales (GTQ)',
    numero: '123-456789-0', // TODO: número real de la parroquia
    titular: 'Parroquia Santuario del Cerrito del Carmen',
  },
  {
    banco: 'Banrural',
    tipo: 'Monetaria en quetzales (GTQ)',
    numero: '3-456-78901-2', // TODO: número real de la parroquia
    titular: 'Parroquia Santuario del Cerrito del Carmen',
  },
]

export const destinoAporte = [
  {
    num: '01',
    titulo: 'Conservación',
    texto:
      'Restauración de la fachada barroca, el torreón y las cuatro capillas de la plazuela.',
  },
  {
    num: '02',
    titulo: 'Las campanas',
    texto:
      'Cuidado y afinación de las cuatro campanas históricas, fundidas entre 1748 y 1925.',
  },
  {
    num: '03',
    titulo: 'Culto vivo',
    texto:
      'Sostenimiento de las celebraciones marianas y de la vida diaria del santuario.',
  },
  {
    num: '04',
    titulo: 'El atrio',
    texto: 'Mantenimiento del atrio, las jardineras y los accesos al cerro.',
  },
]

export const lineaDeTiempo = [
  { año: 'S. XVII', hito: 'Juan Corz funda la primera ermita en el cerro' },
  { año: '1620', hito: 'Se concluye el nuevo templo de cal y canto' },
  { año: '1730', hito: 'Reconstrucción de Juan José Morales' },
  { año: '1776', hito: 'Se funda la Nueva Guatemala de la Asunción' },
  { año: '1917 · 1976', hito: 'Terremotos y sus reconstrucciones' },
  { año: '2003', hito: 'Recuperación de la imagen de la Virgen' },
]

export const capitulos = [
  {
    num: '01',
    epoca: 'Siglo XVI–XVII',
    titulo: 'El Valle de las Vacas',
    texto:
      'Al conquistador Héctor de la Barreda le fue otorgado este valle despoblado. Mandó traer vacas y toros desde Cuba, que muy pronto se multiplicaron entre sus fértiles pastos; por eso se le llegó a conocer como el valle de las Vacas.',
  },
  {
    num: '02',
    epoca: 'Principios del s. XVII',
    titulo: 'Juan Corz y la Virgen del Carmen',
    texto:
      'El ermitaño genovés Juan Corz llegó a Guatemala con una pequeña imagen de la Virgen del Carmen que las carmelitas descalzas de Ávila le confiaron: era el último deseo de santa Teresa de Ávila en su lecho de muerte. Le aseguraron que donde fuera venerada la imagen surgiría una gran ciudad. Se estableció en unas cuevas del cerro y allí, viendo semejanza con el monte Carmelo, levantó la primera ermita.',
  },
  {
    num: '03',
    epoca: '1620',
    titulo: 'El templo de cal y canto',
    texto:
      'Un incendio arrasó la primera ermita y solo se salvó la imagen. En 1620 se concluyó un nuevo templo de paredes de cal y canto, levantado con el apoyo de los vecinos del valle.',
  },
  {
    num: '04',
    epoca: '1647–1723',
    titulo: 'Sede parroquial e Inquisición',
    texto:
      'La iglesia del cerro fue sede parroquial durante 76 años. Corz, en cambio, fue denunciado ante la Inquisición en 1620 y desapareció del Cerrito sin dejar rastro: su expediente pasó al Tribunal de México y se cree que huyó hacia allá. Nunca se volvió a saber de él en el vecindario.',
  },
  {
    num: '05',
    epoca: 'Siglo XVIII',
    titulo: 'Juan José Morales, el reconstructor',
    texto:
      'El cofrade Juan José Morales financió la reconstrucción cuando la madera amenazaba con desplomarse: levantó la iglesia con bóveda de medio cañón, las dos torres de la fachada y el torreón central. Pasó a la historia como «el reconstructor de la ermita».',
  },
  {
    num: '06',
    epoca: '1773–1776',
    titulo: 'El traslado de la capital',
    texto:
      'Tras los terremotos de Santa Marta de 1773, los notables votaron trasladar la capital al valle de la Ermita. La Nueva Guatemala de la Asunción se trazó desde el Cerrito, cumpliendo la promesa que acompañó a la imagen.',
  },
  {
    num: '07',
    epoca: '1784–1959',
    titulo: 'Cambios administrativos',
    texto:
      'En 1784 la ermita fue constituida en capellanía filial de la parroquia de Candelaria, condición que ostenta hasta hoy. Desde 1959 el santuario está al cuidado de los frailes franciscanos.',
  },
  {
    num: '08',
    epoca: '1917 y 1976',
    titulo: 'Los terremotos del siglo XX',
    texto:
      'El terremoto de 1917-18 derrumbó el templo, reinaugurado el 22 de noviembre de 1925. El de 1976 derribó la torre derecha y el tercer nivel de la fachada y dañó el torreón; su restauración concluyó entre 1981 y 1984.',
  },
]

export const laVirgen = [
  {
    titulo: 'Un encargo de santa Teresa',
    texto:
      'Las carmelitas descalzas de Ávila entregaron la imagen a Juan Corz cumpliendo el último deseo de santa Teresa en su lecho de muerte, con una promesa: donde fuera venerada surgiría una gran ciudad.',
  },
  {
    titulo: 'Ciudadana número uno',
    texto:
      'La Virgen del Carmen es tenida como la ciudadana número uno de la Ciudad de Guatemala; la capital se trazó y creció alrededor de su ermita.',
  },
  {
    titulo: 'La talla y su historia',
    texto:
      'Imagen de madera de cedro con el hábito carmelita. Fue robada en 2001 y recuperada en 2003; sus vestiduras de plata del siglo XVIII se perdieron.',
  },
]

export const actualidad = [
  {
    eyebrow: 'La fiesta',
    titulo: 'La fiesta del Cerrito',
    parrafos: [
      'Cada 16 de julio el santuario celebra a la Virgen del Carmen con misas solemnes, y el sábado siguiente la imagen recorre el Centro Histórico en procesión acompañada por bandas escolares. Alrededor de la fiesta, la feria del Cerrito ocupa la avenida Juan Chapín durante dos semanas.',
      'La costumbre viene de antiguo: los aniversarios de la ermita se turnaban entre los pueblos vecinos —Mixco celebró el primero y Santa Catarina Pinula el siguiente— y era la cofradía de Nuestra Señora del Carmen la que organizaba la celebración.',
    ],
  },
  {
    eyebrow: 'Cuentos y leyendas',
    titulo: 'Leyendas del cerro',
    parrafos: [
      'El Cerrito ocupa un lugar propio en las leyendas de la ciudad. La más conocida es la de Pie de Lana, el ladrón que calzaba calcetas de lana para robar sin hacer ruido y que, según se cuenta, fue ajusticiado en el cerro; durante la feria se advertía a los niños que no anduvieran solos de noche.',
      'El parque también ha sido escenario de noches de leyendas, donde los personajes de la tradición guatemalteca vuelven a recorrer el cerro cada año.',
    ],
  },
]

export const queVer = [
  {
    titulo: 'La fachada barroca y sus torres',
    texto:
      'Fachada ultrabarroca con pilastras serlianas y las figuras carmelitas: san Juan de la Cruz, el profeta Elías, santa Teresa de Ávila y santa María Magdalena de Pazzi.',
  },
  {
    titulo: 'El retablo mayor',
    texto:
      'Retablo ultrabarroco del siglo XVIII donde se venera a la Virgen del Carmen, acompañada de san Simón Stock y santa Teresa de Jesús.',
  },
  {
    titulo: 'El torreón «la Redonda»',
    texto:
      'El torreón central que levantó Juan José Morales. Se cree que sirvió como bautisterio de la iglesia antes de las reconstrucciones.',
  },
  {
    titulo: 'El campanario',
    texto:
      'Cuatro campanas históricas fundidas en 1748, 1872, 1921 y 1925, que siguen marcando las celebraciones del santuario.',
  },
  {
    titulo: 'El atrio y las capillas',
    texto:
      'El atrio empedrado que sube al templo y las cuatro capillas de la plazuela, parte del conjunto declarado patrimonio.',
  },
  {
    titulo: 'El parque y la Plaza México',
    texto:
      'El parque arbolado que rodea el cerro, con la Plaza México y las vistas de la ciudad que Muybridge fotografió en 1875.',
  },
]

export const recomendaciones = [
  'Usa calzado cómodo: se sube por el atrio empedrado y algunas gradas.',
  'Visítalo de día para disfrutar las panorámicas de la ciudad.',
  'Es un santuario activo: mantén respeto y silencio dentro del templo.',
  'Aprovecha para recorrer el parque, la Plaza México y las capillas de la plazuela.',
]

export const faqs = [
  {
    p: '¿Hay parqueo?',
    r: 'Sí. El santuario cuenta con parqueo gratuito para visitantes en el Centro Histórico, zona 1.',
  },
  {
    p: '¿Cuál es el horario?',
    r: 'El santuario abre todos los días de 6:00 a 18:00 h. Las misas son de martes a viernes a las 7:00 y los domingos a las 9:00, 11:00 y 16:00 h.',
  },
  {
    p: '¿Es seguro visitarlo?',
    r: 'Se recomienda visitarlo de día y por el acceso principal del atrio. El cerro está dentro del Centro Histórico y hay presencia de seguridad durante las celebraciones y la feria.',
  },
  {
    p: '¿Hay baños?',
    r: 'Sí, hay servicios sanitarios abajo, en el área del parque.',
  },
  {
    p: '¿Venden comida dentro?',
    r: 'Dentro del santuario no hay venta de comida. Alrededor del Cerrito hay tiendas y ventas cercanas, y durante la feria de julio la oferta se amplía en la avenida Juan Chapín.',
  },
]
