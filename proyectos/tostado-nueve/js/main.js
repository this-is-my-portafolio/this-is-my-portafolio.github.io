/* Tostado Nueve — menu vivo segun el tueste del dia + pedido en localStorage. */

(function () {
  'use strict';

  var CLAVE = 'tostado9:pedido';

  /* El tueste rota por dia de la semana. `nivel` (0-1) mueve el marcador de la
     escala y `ajuste` multiplica el precio de los cafes de filtrado: es lo que
     hace que el menu se sienta "vivo" y no una carta fija. */
  var TUESTES = [
    { nombre: 'Huila — Lavado',        notas: 'Panela, mandarina, final limpio.',        nivel: .30, ajuste: 1.00 },
    { nombre: 'Nariño — Honey',        notas: 'Durazno, miel de caña, cuerpo medio.',    nivel: .45, ajuste: 1.08 },
    { nombre: 'Cauca — Natural',       notas: 'Fresa madura, cacao, mucho cuerpo.',      nivel: .62, ajuste: 1.15 },
    { nombre: 'Antioquia — Tueste medio', notas: 'Almendra, caramelo, acidez suave.',    nivel: .50, ajuste: 1.05 },
    { nombre: 'Sierra Nevada — Oscuro',notas: 'Chocolate amargo, tabaco dulce.',         nivel: .82, ajuste: 1.00 },
    { nombre: 'Tolima — Lavado',       notas: 'Manzana verde, caña, muy limpio.',        nivel: .35, ajuste: 1.03 },
    { nombre: 'Mezcla Nueve',          notas: 'La de la casa: equilibrada, para todo.',  nivel: .55, ajuste: 1.00 }
  ];

  var MENU = [
    { grupo: 'Filtrados',  nombre: 'V60',            base: 9000,  filtrado: true,  desc: 'Un solo origen, 250 ml.' },
    { grupo: 'Filtrados',  nombre: 'Chemex para dos', base: 16000, filtrado: true,  desc: 'Para compartir, 500 ml.' },
    { grupo: 'Filtrados',  nombre: 'Prensa francesa', base: 10000, filtrado: true,  desc: 'Más cuerpo, menos filtro.' },
    { grupo: 'Espresso',   nombre: 'Espresso',        base: 5500,  filtrado: false, desc: 'Doble, 40 ml.' },
    { grupo: 'Espresso',   nombre: 'Cortado',         base: 7000,  filtrado: false, desc: 'Espresso y leche texturizada.' },
    { grupo: 'Espresso',   nombre: 'Latte',           base: 9500,  filtrado: false, desc: 'Con arte en la crema.' },
    { grupo: 'Espresso',   nombre: 'Mocha de panela', base: 11000, filtrado: false, desc: 'Cacao 70% y panela ahumada.' },
    { grupo: 'Para picar', nombre: 'Croissant',       base: 6500,  filtrado: false, desc: 'Hojaldre de mantequilla, del día.' },
    { grupo: 'Para picar', nombre: 'Pan de bono',     base: 4000,  filtrado: false, desc: 'Recién salido, dos unidades.' },
    { grupo: 'Para picar', nombre: 'Torta de zanahoria', base: 12000, filtrado: false, desc: 'Con queso crema y nuez.' }
  ];

  var pesos = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  });

  var tueste = TUESTES[new Date().getDay()];
  var pedido = cargar();

  /* ---- Persistencia --------------------------------------------------- */

  function cargar() {
    try {
      var crudo = localStorage.getItem(CLAVE);
      return crudo ? JSON.parse(crudo) : {};
    } catch (e) {
      // Modo privado o storage lleno: el pedido simplemente no persiste.
      return {};
    }
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(pedido));
    } catch (e) { /* sin persistencia, la sesión sigue funcionando */ }
  }

  /* ---- Precio según tueste -------------------------------------------- */

  function precioDe(item) {
    if (!item.filtrado || tueste.ajuste === 1) return item.base;
    // Redondeo a los 100 más cercanos: nadie cobra $9.720 por un café.
    return Math.round(item.base * tueste.ajuste / 100) * 100;
  }

  /* ---- Tueste del día -------------------------------------------------- */

  function pintarTueste() {
    document.getElementById('tueste-nombre').textContent = tueste.nombre;
    document.getElementById('tueste-notas').textContent = tueste.notas;
    document.getElementById('tueste-relleno').style.left = (tueste.nivel * 100) + '%';
    document.getElementById('tueste-barra')
      .setAttribute('aria-label', 'Nivel de tueste: ' + Math.round(tueste.nivel * 100) + ' de 100');
    document.getElementById('barra-tueste').textContent = 'Hoy: ' + tueste.nombre;

    // El aviso solo aplica los días en que el tueste mueve el precio.
    document.getElementById('menu-nota').textContent = tueste.ajuste === 1
      ? 'El tueste de hoy va a precio de carta: sin ajuste en los filtrados.'
      : 'Los precios de café cambian con el tueste del día: hoy los filtrados ' +
        'llevan un ajuste de +' + Math.round((tueste.ajuste - 1) * 100) + '%.';
  }

  /* ---- Menú ------------------------------------------------------------ */

  function pintarMenu() {
    var contenedor = document.getElementById('grupos');
    contenedor.innerHTML = '';

    var grupos = [];
    MENU.forEach(function (item) {
      if (grupos.indexOf(item.grupo) === -1) grupos.push(item.grupo);
    });

    grupos.forEach(function (nombreGrupo) {
      var seccion = document.createElement('section');
      seccion.className = 'grupo';

      var titulo = document.createElement('h3');
      titulo.className = 'grupo__titulo';
      titulo.textContent = nombreGrupo;
      seccion.appendChild(titulo);

      MENU.filter(function (i) { return i.grupo === nombreGrupo; })
          .forEach(function (item) {
        var precio = precioDe(item);
        var ajustado = precio !== item.base;

        var fila = document.createElement('article');
        fila.className = 'item';

        var nombre = document.createElement('span');
        nombre.className = 'item__nombre';
        nombre.textContent = item.nombre;
        if (ajustado) {
          var marca = document.createElement('span');
          marca.className = 'item__ajuste';
          marca.textContent = 'tueste de hoy';
          nombre.appendChild(marca);
        }

        var celdaPrecio = document.createElement('span');
        celdaPrecio.className = 'item__precio';
        if (ajustado) {
          var antes = document.createElement('del');
          antes.textContent = pesos.format(item.base);
          celdaPrecio.appendChild(antes);
        }
        celdaPrecio.append(pesos.format(precio));

        var boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'agregar';
        boton.textContent = '+';
        boton.setAttribute('aria-label', 'Agregar ' + item.nombre + ' al pedido');
        boton.addEventListener('click', function () { agregar(item.nombre); });

        var desc = document.createElement('p');
        desc.className = 'item__desc';
        desc.textContent = item.desc;

        fila.append(nombre, celdaPrecio, boton, desc);
        seccion.appendChild(fila);
      });

      contenedor.appendChild(seccion);
    });
  }

  /* ---- Pedido ---------------------------------------------------------- */

  function agregar(nombre) {
    pedido[nombre] = (pedido[nombre] || 0) + 1;
    guardar();
    pintarPedido();
  }

  function quitar(nombre) {
    if (!pedido[nombre]) return;
    pedido[nombre] -= 1;
    if (pedido[nombre] <= 0) delete pedido[nombre];
    guardar();
    pintarPedido();
  }

  function pintarPedido() {
    var lista = document.getElementById('pedido-lista');
    var vacio = document.getElementById('pedido-vacio');
    var confirmar = document.getElementById('confirmar');
    var vaciar = document.getElementById('vaciar');

    lista.innerHTML = '';
    var subtotal = 0;
    var nombres = Object.keys(pedido);

    nombres.forEach(function (nombre) {
      var item = MENU.filter(function (i) { return i.nombre === nombre; })[0];
      if (!item) { delete pedido[nombre]; return; }   // menú cambió: se descarta

      var cantidad = pedido[nombre];
      subtotal += precioDe(item) * cantidad;

      var li = document.createElement('li');
      li.className = 'linea';

      var cant = document.createElement('span');
      cant.className = 'linea__cant';
      cant.textContent = cantidad + '×';

      var etiqueta = document.createElement('span');
      etiqueta.className = 'linea__nombre';
      etiqueta.textContent = nombre;

      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'linea__quitar';
      boton.innerHTML = '&minus;';
      boton.setAttribute('aria-label', 'Quitar uno de ' + nombre);
      boton.addEventListener('click', function () { quitar(nombre); });

      li.append(cant, etiqueta, boton);
      lista.appendChild(li);
    });

    var hayAlgo = Object.keys(pedido).length > 0;
    vacio.hidden = hayAlgo;
    confirmar.disabled = !hayAlgo;
    vaciar.hidden = !hayAlgo;

    document.getElementById('subtotal').textContent = pesos.format(subtotal);
    document.getElementById('total').textContent = pesos.format(subtotal);
  }

  document.getElementById('confirmar').addEventListener('click', function () {
    var unidades = Object.keys(pedido).reduce(function (suma, n) {
      return suma + pedido[n];
    }, 0);
    document.getElementById('pedido-estado').textContent =
      'Pedido de ' + unidades + (unidades === 1 ? ' ítem' : ' ítems') +
      ' recibido. Listo en unos 12 minutos.';
    pedido = {};
    guardar();
    pintarPedido();
  });

  document.getElementById('vaciar').addEventListener('click', function () {
    pedido = {};
    guardar();
    pintarPedido();
    document.getElementById('pedido-estado').textContent = '';
  });

  pintarTueste();
  pintarMenu();
  pintarPedido();
})();
