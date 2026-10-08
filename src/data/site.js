/* ==========================================================================
   Contenido del sitio en un solo lugar.
   Editar aquí es lo único que necesita la parroquia para actualizar el sitio.

   FOTOS: cada bloque con imagen tiene un campo `img`. Mientras esté vacío
   se muestra el marcador gris con el texto de `alt`. Para poner la foto real:
   1. copiar el archivo a  public/img/
   2. escribir la ruta:    img: '/img/fachada.jpg'
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
  { label: 'Arquitectura', to: '/arquitectura' },
  { label: 'Galería', to: '/galeria' },
  { label: 'Visita', to: '/visita' },
  { label: 'Celebraciones', to: '/celebraciones' },
  { label: 'Ubicación', to: '/ubicacion' },
  { label: 'Contacto', to: '/contacto' },
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
  { num: '01', titulo: 'Conservación', texto: 'Restauración de la fachada barroca, el torreón y las cuatro capillas de la plazuela.' },
  { num: '02', titulo: 'Las campanas', texto: 'Cuidado y afinación de las cuatro campanas históricas, fundidas entre 1748 y 1925.' },
  { num: '03', titulo: 'Culto vivo', texto: 'Sostenimiento de las celebraciones marianas y de la vida diaria del santuario.' },
  { num: '04', titulo: 'El atrio', texto: 'Mantenimiento del atrio, las jardineras y los accesos al cerro.' },
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
    img: '/img/cupula-atardecer.jpg',
    alt: 'La cúpula del Cerrito al atardecer, con el valle y las montañas al fondo',
  },
  {
    num: '02',
    epoca: 'Principios del s. XVII',
    titulo: 'Juan Corz y la Virgen del Carmen',
    texto:
      'El ermitaño genovés Juan Corz llegó a Guatemala con una pequeña imagen de la Virgen del Carmen que las carmelitas descalzas de Ávila le confiaron: era el último deseo de santa Teresa de Ávila en su lecho de muerte. Le aseguraron que donde fuera venerada la imagen surgiría una gran ciudad. Se estableció en unas cuevas del cerro y allí, viendo semejanza con el monte Carmelo, levantó la primera ermita.',
    img: '/img/juan-corz-cueva.jpg',
    alt: 'Juan Corz en oración ante la Virgen del Carmen en la cueva del cerro',
  },
  {
    num: '03',
    epoca: '1620',
    titulo: 'El templo de cal y canto',
    texto:
      'Un incendio arrasó la primera ermita y solo se salvó la imagen. En 1620 se concluyó un nuevo templo de paredes de cal y canto, levantado con el apoyo de los vecinos del valle.',
    img: '/img/muro-contrafuertes-noche.jpg',
    alt: 'Muro lateral y contrafuertes de la ermita, de noche',
  },
  {
    num: '04',
    epoca: '1647–1723',
    titulo: 'Sede parroquial e Inquisición',
    texto:
      'La iglesia del cerro fue sede parroquial durante 76 años. Corz, en cambio, fue denunciado ante la Inquisición en 1620 y desapareció del Cerrito sin dejar rastro: su expediente pasó al Tribunal de México y se cree que huyó hacia allá. Nunca se volvió a saber de él en el vecindario.',
    img: '/img/juan-corz-estatua.jpg',
    alt: 'Estatua de piedra de Juan Corz sosteniendo la imagen de la Virgen',
  },
  {
    num: '05',
    epoca: 'Siglo XVIII',
    titulo: 'Juan José Morales, el reconstructor',
    texto:
      'El cofrade Juan José Morales financió la reconstrucción cuando la madera amenazaba con desplomarse: levantó la iglesia con bóveda de medio cañón, las dos torres de la fachada y el torreón central. Pasó a la historia como «el reconstructor de la ermita».',
    img: '/img/torreon-fachada-atardecer.jpg',
    alt: 'El torreón y la fachada levantados en la reconstrucción de Juan José Morales',
  },
  {
    num: '06',
    epoca: '1773–1776',
    titulo: 'El traslado de la capital',
    texto:
      'Tras los terremotos de Santa Marta de 1773, los notables votaron trasladar la capital al valle de la Ermita. La Nueva Guatemala de la Asunción se trazó desde el Cerrito, cumpliendo la promesa que acompañó a la imagen.',
    img: '/img/torreon-redonda-plaza.jpg',
    alt: 'El torreón y la plaza del cerro con la ciudad al fondo',
  },
  {
    num: '07',
    epoca: '1784–1959',
    titulo: 'Cambios administrativos',
    texto:
      'En 1784 la ermita fue constituida en capellanía filial de la parroquia de Candelaria, condición que ostenta hasta hoy. Desde 1959 el santuario está al cuidado de los frailes franciscanos.',
    img: '/img/despacho-parroquial.jpg',
    alt: 'El despacho parroquial del santuario',
  },
  {
    num: '08',
    epoca: '1917 y 1976',
    titulo: 'Los terremotos del siglo XX',
    texto:
      'El terremoto de 1917-18 derrumbó el templo, reinaugurado el 22 de noviembre de 1925. El de 1976 derribó la torre derecha y el tercer nivel de la fachada y dañó el torreón; su restauración concluyó entre 1981 y 1984. Los planos estructurales de la fachada y el atrio se trazaron en septiembre de 1979.',
    img: '/img/historia/ruinas-interior.jpg',
    alt: 'Interior de la ermita en ruinas tras un terremoto: el arco del retablo y la cúpula agrietada',
  },
  {
    num: '09',
    epoca: '29 de octubre de 1995',
    titulo: 'Santuario de la Virgen del Carmen',
    texto:
      'Por resolución del arzobispo metropolitano de Guatemala, monseñor Próspero Penados del Barrio, vigente desde el 29 de octubre de 1995, la antigua ermita y excabecera de la parroquia de Nuestra Señora de la Asunción fue elevada en su categoría canónica a Santuario de la Virgen del Carmen.',
    img: '/img/historia/santuario-1995.jpg',
    alt: 'Portada de 1995 «Santuario de la Virgen del Carmen» con la fachada y el torreón',
  },
]

/* Documentos de la reconstrucción (escaneos entregados por el equipo) */
export const documentosReconstruccion = [
  {
    img: '/img/historia/ruinas-interior.jpg',
    fecha: 'Siglo XX',
    titulo: 'La ermita en ruinas',
    texto:
      'Parte interior de la ermita después del terremoto: se ve el retablo que existe hasta hoy y las pinturas de las pechinas de la cúpula, hoy desaparecidas.',
  },
  {
    img: '/img/historia/boceto-fachada.jpg',
    fecha: 'Reconstrucción',
    titulo: 'Boceto para proteger la bóveda',
    texto:
      'Croquis a mano de la fachada: indica cubrir la abertura de la bóveda con plástico, prensado con reglas y pegado con chapopote sobre la superficie del cañón.',
  },
  {
    img: '/img/historia/plano-1979-cimentacion.jpg',
    fecha: 'Septiembre de 1979',
    titulo: 'Planos estructurales · hoja 1',
    texto:
      'Planta de cimentación y detalles del atrio y la elevación frontal. Departamento de Estudios y Proyectos de Edificios Públicos de la Dirección General de Obras Públicas.',
  },
  {
    img: '/img/historia/plano-1979-vigas.jpg',
    fecha: 'Septiembre de 1979',
    titulo: 'Planos estructurales · hoja 2',
    texto: 'Localización de vigas, tacos y detalles de la fachada y la torre con su escalera de caracol.',
  },
  {
    img: '/img/historia/diario-1987.jpg',
    fecha: '22 de octubre de 1987',
    titulo: 'El Cerrito, «escuela sin muros»',
    texto:
      'Nota del Diario de Centro América sobre los pintores que cada domingo suben al Cerrito, convertido en el lugar más pintado de la ciudad.',
  },
  {
    img: '/img/historia/santuario-1995.jpg',
    fecha: '29 de octubre de 1995',
    titulo: 'Elevado a santuario',
    texto:
      'Resolución de monseñor Próspero Penados del Barrio que eleva la antigua ermita a Santuario de la Virgen del Carmen.',
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

export const fotosVirgen = [
  { img: '/img/virgen-del-carmen.jpg', alt: 'La Virgen del Carmen con su resplandor y corona', pie: 'La Virgen del Carmen' },
  { img: '/img/santa-teresa.jpg', alt: 'Imagen de santa Teresa de Ávila con hábito carmelita', pie: 'Santa Teresa de Ávila' },
  { img: '/img/escapularios.jpg', alt: 'Escapularios del Carmen', pie: 'El escapulario del Carmen' },
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

/* ---------- Arquitectura ---------- */

export const arquitectura = [
  {
    num: '01',
    titulo: 'La fachada ultrabarroca',
    texto:
      'Fachada de estilo ultrabarroco con pilastras serlianas y hornacinas. En ellas aparecen las figuras carmelitas: san Juan de la Cruz, el profeta Elías, santa Teresa de Ávila y santa María Magdalena de Pazzi.',
    img: '/img/fachada-guirnaldas.jpg',
    alt: 'Fachada barroca de la ermita con guirnaldas',
  },
  {
    num: '02',
    titulo: 'Las torres y el torreón',
    texto:
      'Las dos torres de la fachada y el torreón central son obra de la reconstrucción de Juan José Morales. Del torreón —«la Redonda»— se cree que sirvió como bautisterio de la iglesia antes de las reconstrucciones del siglo XX.',
    img: '/img/torreon-dia.jpg',
    alt: 'El torreón «la Redonda» sobre la plaza empedrada',
  },
  {
    num: '03',
    titulo: 'El retablo mayor',
    texto:
      'Retablo ultrabarroco del siglo XVIII, dorado, donde se venera a la Virgen del Carmen acompañada de san Simón Stock y santa Teresa de Jesús. Es la pieza central del arte del santuario.',
    img: '/img/retablo-detalle.jpg',
    alt: 'Retablo mayor dorado con flores',
  },
  {
    num: '04',
    titulo: 'La nave y la bóveda',
    texto:
      'Nave única cubierta con bóveda de medio cañón y coro elevado a los pies del templo, solución habitual en las ermitas coloniales del valle.',
    img: '/img/nave-interior.jpg',
    alt: 'Nave única del templo hacia el retablo mayor',
  },
  {
    num: '05',
    titulo: 'Las catacumbas',
    texto:
      'Bajo el templo se conservan las catacumbas del cerro, parte del conjunto histórico del santuario. Su acceso está restringido y se abre solo en visitas guiadas especiales.',
    img: '',
    alt: 'Acceso a las catacumbas del santuario',
  },
  {
    num: '06',
    titulo: 'La campana',
    texto:
      'El campanario conserva cuatro campanas históricas, fundidas en 1748, 1872, 1921 y 1925. La más antigua acompaña las celebraciones del Cerrito desde antes del traslado de la capital.',
    img: '/img/campana.jpg',
    alt: 'Campana del campanario con el torreón y la ciudad abajo',
  },
  {
    num: '07',
    titulo: 'La cruz papal',
    texto:
      'La cruz papal que guarda el santuario, memoria de la devoción mariana de la ciudad y de las celebraciones que ha acogido el cerro.',
    img: '/img/cruz-atrio.jpg',
    alt: 'La cruz del atrio al anochecer',
  },
  {
    num: '08',
    titulo: 'El confesionario y la imaginería',
    texto:
      'Confesionario ultrabarroco decorado con espejos, junto a la imaginería y los óleos que forman el patrimonio artístico del templo.',
    img: '/img/angeles-ruega.jpg',
    alt: 'Ángeles de la imaginería del santuario con el listón «Ruega por nosotros»',
  },
]

/* ---------- Galería ---------- */

export const galeriaFiltros = ['Todo', 'Exterior', 'Interior', 'Fiesta y procesión', 'Detalles', 'Parque']

export const galeria = [
  { cat: 'Exterior', alt: 'Costado del templo y sus capillas en la hora dorada', img: '/img/costado-hora-dorada.jpg' },
  { cat: 'Interior', alt: 'El retablo mayor con la Virgen del Carmen', img: '/img/retablo-mayor.jpg' },
  { cat: 'Fiesta y procesión', alt: 'Pólvora y humo frente a la fachada durante la fiesta', img: '/img/fiesta-polvora.jpg' },
  { cat: 'Detalles', alt: 'Pequeña imagen dorada de la Virgen en procesión', img: '/img/virgen-procesion-detalle.jpg' },
  { cat: 'Parque', alt: 'Pérgola de buganvilias sobre el camino de piedra', img: '/img/pergola-buganvilias.jpg' },
  { cat: 'Exterior', alt: 'La fachada iluminada de noche desde las gradas del atrio', img: '/img/fachada-noche.jpg' },
  { cat: 'Interior', alt: 'La nave con sus bancas hacia el retablo', img: '/img/nave-bancas.jpg' },
  { cat: 'Fiesta y procesión', alt: 'Salida de la procesión entre papel picado', img: '/img/salida-procesion.jpg' },
  { cat: 'Detalles', alt: 'Ángel del anda con corona de plata', img: '/img/angel-detalle.jpg' },
  { cat: 'Exterior', alt: 'El templo y sus jardines con rayos de sol', img: '/img/exterior-rayos-sol.jpg' },
  { cat: 'Parque', alt: 'La cúpula enmarcada por flores rojas', img: '/img/cupula-flores.jpg' },
  { cat: 'Interior', alt: 'La nave decorada para la fiesta patronal', img: '/img/nave-fiesta.jpg' },
  { cat: 'Fiesta y procesión', alt: 'El anda de la Virgen con flores bajo el cielo azul', img: '/img/procesion-anda.jpg' },
  { cat: 'Exterior', alt: 'El torreón iluminado de noche', img: '/img/torreon-noche.jpg' },
  { cat: 'Detalles', alt: 'Ángeles del anda de la Virgen', img: '/img/angeles-anda.jpg' },
  { cat: 'Interior', alt: 'El camarín de la Virgen en el retablo dorado', img: '/img/camarin-virgen.jpg' },
  { cat: 'Fiesta y procesión', alt: 'Arco de flores en la puerta del templo', img: '/img/arco-flores-fiesta.jpg' },
  { cat: 'Parque', alt: 'La fuente del parque', img: '/img/fuente-parque.jpg' },
  { cat: 'Exterior', alt: 'Silueta de las torres y la cruz al atardecer', img: '/img/silueta-torres.jpg' },
  { cat: 'Interior', alt: 'El retablo con las cortinas amarillo y blanco', img: '/img/retablo-cortinas.jpg' },
  { cat: 'Fiesta y procesión', alt: 'El anda «Reina de los Ángeles» dentro del templo', img: '/img/anda-reina-angeles.jpg' },
  { cat: 'Detalles', alt: 'El anda de la Virgen en penumbra', img: '/img/anda-penumbra.jpg' },
  { cat: 'Parque', alt: 'Jardín con buganvilias al atardecer', img: '/img/jardin-buganvilias.jpg' },
  { cat: 'Fiesta y procesión', alt: 'Cuaresma: el Nazareno frente al templo iluminado en morado', img: '/img/cuaresma-nazareno.jpg' },
  { cat: 'Parque', alt: 'Plaza del cerro con palmera, de noche', img: '/img/plaza-palmera.jpg' },
  { cat: 'Exterior', alt: 'El torreón al atardecer', img: '/img/torreon-poste.jpg' },
]

export const creditos =
  'Fotografías del santuario compartidas por la comunidad del Cerrito del Carmen. Algunas imágenes son de Mario Cruz Álvarez; se usan con fines de demostración y su publicación final requiere la autorización de sus autores.'

/* ---------- Celebraciones (antes Eventos) ---------- */

export const sacramentos = [
  {
    nombre: 'Bautismo',
    requisitos: 'Partida de nacimiento del niño, datos de los padres y padrinos, y charla prebautismal.',
  },
  {
    nombre: 'Primera Comunión',
    requisitos: 'Constancia de bautismo y catequesis completa en la parroquia o en el colegio.',
  },
  {
    nombre: 'Confirmación',
    requisitos: 'Constancia de bautismo y primera comunión, más el curso de confirmación.',
  },
  {
    nombre: 'Matrimonio',
    requisitos: 'Constancias de bautismo y confirmación de ambos, charlas prematrimoniales y reserva de fecha con tiempo.',
  },
  {
    nombre: 'Reconciliación',
    requisitos: 'Confesiones antes de cada misa o con cita previa en la sacristía.',
  },
  {
    nombre: 'Unción de los enfermos',
    requisitos: 'Se atiende a domicilio o en el templo; comunicarse con la parroquia para coordinar.',
  },
]

export const agenda = [
  {
    dia: '16',
    cuando: 'De julio · cada año',
    tipo: 'Fiesta patronal',
    titulo: 'Fiesta de la Virgen del Carmen · misas solemnes durante todo el día',
  },
  {
    dia: '18',
    cuando: 'De julio · 2026',
    tipo: 'Procesión',
    titulo: 'La Virgen recorre el Centro Histórico · sale a las 15:00 y entra al santuario a las 20:00',
  },
  {
    dia: 'Jul',
    cuando: 'Dos semanas de feria',
    tipo: 'Feria del Cerrito',
    titulo: 'Feria y Festival del Cerrito sobre la avenida Juan Chapín, entre 1a y 4a calle, zona 1',
  },
]

/* ---------- Ubicación ---------- */

export const comoLlegar = [
  {
    label: 'Dirección',
    titulo: 'Dónde está',
    texto: '1a calle y 12 avenida, Zona 1, Ciudad de Guatemala, 01001. En la cima del cerro del Carmen.',
  },
  {
    label: 'Cómo llegar',
    titulo: 'En transporte',
    texto: 'En pleno Centro Histórico (Zona 1), accesible a pie desde las calles cercanas y desde la avenida Juan Chapín.',
  },
  {
    label: 'Estacionamiento',
    titulo: 'Dónde aparcar',
    texto: 'Parqueo gratuito para visitantes junto al acceso del cerro.',
  },
  {
    label: 'Servicios',
    titulo: 'Baños y comida',
    texto: 'Hay servicios sanitarios abajo, en el área del parque. Dentro del santuario no hay venta de comida; alrededor del cerro hay tiendas cercanas.',
  },
]

export const referencias = [
  {
    titulo: 'Parroquia de la Candelaria',
    texto: 'La ermita es filial de esta parroquia cercana, condición que conserva desde 1784.',
  },
  {
    titulo: 'La Plaza México',
    texto: 'En el parque que rodea el cerro, punto de encuentro del barrio y acceso a la ladera arbolada.',
  },
  {
    titulo: 'Vistas de la ciudad',
    texto: 'Desde la cima se domina el Centro Histórico: las mismas panorámicas que Muybridge fotografió en 1875.',
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
  { p: '¿Hay parqueo?', r: 'Sí. El santuario cuenta con parqueo gratuito para visitantes en el Centro Histórico, zona 1.' },
  {
    p: '¿Cuál es el horario?',
    r: 'El santuario abre todos los días de 6:00 a 18:00 h. Las misas son de martes a viernes a las 7:00 y los domingos a las 9:00, 11:00 y 16:00 h.',
  },
  {
    p: '¿Es seguro visitarlo?',
    r: 'Se recomienda visitarlo de día y por el acceso principal del atrio. El cerro está dentro del Centro Histórico y hay presencia de seguridad durante las celebraciones y la feria.',
  },
  { p: '¿Hay baños?', r: 'Sí, hay servicios sanitarios abajo, en el área del parque.' },
  {
    p: '¿Venden comida dentro?',
    r: 'Dentro del santuario no hay venta de comida. Alrededor del Cerrito hay tiendas y ventas cercanas, y durante la feria de julio la oferta se amplía en la avenida Juan Chapín.',
  },
]

export const agradecimientos = [
  { nombre: 'Familia Us Similox', nota: 'Restauración del retablo mayor' },
  { nombre: 'Cofradía de Nuestra Señora del Carmen', nota: 'Fiesta patronal 2026' },
  { nombre: 'Vecinos del barrio del Cerrito', nota: 'Mantenimiento del atrio' },
  { nombre: 'Colegio San José', nota: 'Bandas de la procesión' },
  { nombre: 'Anónimo', nota: 'Cuidado de las campanas' },
]
