/**
 * Fuente unica de verdad del portafolio.
 *
 * Agregar un proyecto = agregar un objeto a este array. Quitarlo = borrarlo.
 * Nada mas hay que tocar: el carrusel, el panel de detalle, el contador y los
 * indicadores de movil se generan a partir de aqui.
 *
 * Campos:
 *   slug        identificador y nombre de la carpeta en proyectos/<slug>/
 *   categoria   se muestra en el eyebrow, en mayusculas
 *   tipo        subtitulo tecnico, ej. "LANDING DE RESERVAS"
 *   nombre      nombre del negocio, va en la tipografia display
 *   descripcion 2-3 lineas: que es, que resuelve, que tiene de especial
 *   tags        tecnologias, tal cual se pintan en las pildoras
 *   metrica     { valor, etiqueta } el unico dato que va en dorado
 *   url         ruta al deploy real, relativa a la raiz del sitio
 *   urlVisible  lo que se lee en la barra del mockup de navegador
 *   logo        ruta al logo, usado en la tarjeta del mazo
 *   enVivo      si false, el boton queda deshabilitado y no se marca EN VIVO
 */
export const proyectos = [
  {
    slug: 'cenizo',
    categoria: 'Restaurante',
    tipo: 'Landing de reservas',
    nombre: 'Cenizo',
    descripcion:
      'Cocina a la brasa con reserva en dos toques. El menú se arma desde ' +
      'un solo archivo de datos y el formulario de mesa vive en la misma ' +
      'pantalla que la carta, sin saltos de página.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Schema.org'],
    metrica: { valor: '+38%', etiqueta: 'reservas online' },
    url: 'proyectos/cenizo/',
    urlVisible: 'cenizo.just-king.dev',
    logo: 'assets/marcas/cenizo/logo.png',
    enVivo: true,
  },
  {
    slug: 'tostado-nueve',
    categoria: 'Cafetería',
    tipo: 'Menú digital + pedido',
    nombre: 'Tostado Nueve',
    descripcion:
      'Menú vivo que cambia según el tueste del día. El pedido se arma en ' +
      'un panel lateral persistente y el total se recalcula sin recargar; ' +
      'todo el estado cabe en localStorage.',
    tags: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    metrica: { valor: '1.240', etiqueta: 'pedidos al mes' },
    url: 'proyectos/tostado-nueve/',
    urlVisible: 'tostadonueve.just-king.dev',
    logo: 'assets/marcas/tostado-nueve/logo.png',
    enVivo: true,
  },
  {
    slug: 'anima-studio',
    categoria: 'Tienda',
    tipo: 'Catálogo editorial',
    nombre: 'Ánima Studio',
    descripcion:
      'Ropa de autor presentada como editorial, no como grilla de fichas. ' +
      'El filtro por colección reordena el catálogo con transiciones de ' +
      'posición en vez de recargar la vista.',
    tags: ['HTML', 'CSS Grid', 'JavaScript', 'View Transitions'],
    metrica: { valor: '4:12', etiqueta: 'min. por sesión' },
    url: 'proyectos/anima-studio/',
    urlVisible: 'animastudio.just-king.dev',
    logo: 'assets/marcas/anima-studio/logo.jpg',
    enVivo: true,
  },
  {
    slug: 'raiz-y-tallo',
    categoria: 'Floristería',
    tipo: 'Tienda con entrega',
    nombre: 'Raíz y Tallo',
    descripcion:
      'Ramos ordenados por ocasión en vez de por especie, que es como los ' +
      'busca la gente. El selector de franja de entrega descarta solo los ' +
      'horarios que ya no alcanzan para el mismo día.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Intl.DateTimeFormat'],
    metrica: { valor: '92%', etiqueta: 'entregas en menos de 3 h' },
    url: 'proyectos/raiz-y-tallo/',
    urlVisible: 'raizytallo.just-king.dev',
    logo: 'assets/marcas/raiz-y-tallo/logo.png',
    enVivo: true,
  },
  {
    slug: 'horno-cinco',
    categoria: 'Panadería',
    tipo: 'Encargos por hornada',
    nombre: 'Horno Cinco',
    descripcion:
      'Se encarga por hornada, no por stock: cada tanda tiene hora de ' +
      'salida y cupo. La barra de cupo se agota en vivo y el encargo se ' +
      'cierra solo cuando la hornada llega a cero.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Web Animations'],
    metrica: { valor: '6', etiqueta: 'hornadas agotadas por semana' },
    url: 'proyectos/horno-cinco/',
    urlVisible: 'hornocinco.just-king.dev',
    logo: 'assets/marcas/horno-cinco/logo.png',
    enVivo: true,
  },
];
