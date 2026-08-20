/* Ánima Studio — catalogo editorial con reordenamiento animado.
   Al filtrar, las piezas que siguen visibles se DESPLAZAN a su nueva posicion
   en vez de desaparecer y volver a dibujarse. */

(function () {
  'use strict';

  var PIEZAS = [
    { id: 'velo',    nombre: 'Abrigo Velo',      col: 'ritual', precio: 480000, ancha: true,  tallas: { XS: 1, S: 1, M: 1, L: 0 } },
    { id: 'ceniza',  nombre: 'Blusa Ceniza',     col: 'umbra',  precio: 190000, ancha: false, tallas: { XS: 1, S: 1, M: 1, L: 1 } },
    { id: 'aurora',  nombre: 'Vestido Aurora',   col: 'lumen',  precio: 350000, ancha: false, tallas: { XS: 0, S: 1, M: 1, L: 1 } },
    { id: 'sombra',  nombre: 'Pantalón Sombra',  col: 'umbra',  precio: 240000, ancha: false, tallas: { XS: 1, S: 1, M: 0, L: 1 } },
    { id: 'ofrenda', nombre: 'Kimono Ofrenda',   col: 'ritual', precio: 520000, ancha: true,  tallas: { XS: 1, S: 0, M: 1, L: 1 } },
    { id: 'lucero',  nombre: 'Camisa Lucero',    col: 'lumen',  precio: 210000, ancha: false, tallas: { XS: 1, S: 1, M: 1, L: 1 } },
    { id: 'eclipse', nombre: 'Falda Eclipse',    col: 'umbra',  precio: 230000, ancha: false, tallas: { XS: 0, S: 0, M: 0, L: 0 } },
    { id: 'alba',    nombre: 'Chaleco Alba',     col: 'lumen',  precio: 280000, ancha: false, tallas: { XS: 1, S: 1, M: 1, L: 0 } },
    { id: 'invoca',  nombre: 'Túnica Invocación', col: 'ritual', precio: 610000, ancha: false, tallas: { XS: 1, S: 1, M: 1, L: 1 } }
  ];

  var NOMBRE_COL = { ritual: 'Ritual', umbra: 'Umbra', lumen: 'Lumen' };

  var pesos = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  });

  var rejilla = document.getElementById('rejilla');
  var conteo = document.getElementById('conteo');
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var filtro = 'todo';

  function agotada(pieza) {
    return Object.keys(pieza.tallas).every(function (t) { return !pieza.tallas[t]; });
  }

  function crearPieza(pieza) {
    var li = document.createElement('li');
    li.className = 'pieza';
    li.dataset.id = pieza.id;
    if (pieza.ancha) li.dataset.ancha = '';

    var marco = document.createElement('div');
    marco.className = 'pieza__marco';

    var tela = document.createElement('span');
    tela.className = 'pieza__tela';
    tela.dataset.col = pieza.col;

    var sello = document.createElement('span');
    sello.className = 'pieza__sello';
    sello.textContent = pieza.nombre.charAt(0);
    sello.setAttribute('aria-hidden', 'true');

    marco.append(tela, sello);

    if (agotada(pieza)) {
      var agot = document.createElement('span');
      agot.className = 'pieza__agotado';
      agot.textContent = 'Agotado';
      marco.appendChild(agot);
    }

    var pie = document.createElement('div');
    pie.className = 'pieza__pie';

    var izq = document.createElement('div');
    var nombre = document.createElement('span');
    nombre.className = 'pieza__nombre';
    nombre.textContent = pieza.nombre;
    var col = document.createElement('span');
    col.className = 'pieza__col';
    col.textContent = NOMBRE_COL[pieza.col];
    izq.append(nombre, col);

    var precio = document.createElement('span');
    precio.className = 'pieza__precio';
    precio.textContent = pesos.format(pieza.precio);

    pie.append(izq, precio);

    var tallas = document.createElement('ul');
    tallas.className = 'pieza__tallas';
    tallas.setAttribute('aria-label', 'Tallas disponibles');
    Object.keys(pieza.tallas).forEach(function (t) {
      var li2 = document.createElement('li');
      li2.textContent = t;
      if (!pieza.tallas[t]) {
        li2.dataset.ida = '';
        li2.setAttribute('aria-label', t + ' agotada');
      }
      tallas.appendChild(li2);
    });

    li.append(marco, pie, tallas);
    return li;
  }

  function visibles() {
    return PIEZAS.filter(function (p) {
      return filtro === 'todo' || p.col === filtro;
    });
  }

  /** Reemplaza el contenido de la rejilla sin animar. */
  function pintar() {
    var lista = visibles();
    rejilla.replaceChildren.apply(rejilla, lista.map(crearPieza));
    conteo.textContent = lista.length +
      (lista.length === 1 ? ' pieza' : ' piezas') +
      (filtro === 'todo' ? '' : ' · ' + NOMBRE_COL[filtro]);
  }

  /**
   * FLIP: mide donde esta cada pieza, repinta, y anima desde la posicion
   * vieja hasta la nueva. Las que sobreviven al filtro se deslizan.
   */
  function pintarAnimado() {
    if (sinMovimiento.matches) { pintar(); return; }

    // First: posiciones actuales.
    var antes = new Map();
    rejilla.querySelectorAll('.pieza').forEach(function (nodo) {
      antes.set(nodo.dataset.id, nodo.getBoundingClientRect());
    });

    pintar();   // Last

    rejilla.querySelectorAll('.pieza').forEach(function (nodo) {
      var previo = antes.get(nodo.dataset.id);
      var actual = nodo.getBoundingClientRect();

      if (previo) {
        // Invert + Play: se mueve desde donde estaba.
        var dx = previo.left - actual.left;
        var dy = previo.top - actual.top;
        if (dx || dy) {
          nodo.animate(
            [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' },
             { transform: 'none' }],
            { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' }
          );
        }
      } else {
        // Pieza nueva en la vista: entra levantandose.
        nodo.animate(
          [{ opacity: 0, transform: 'translateY(12px)' },
           { opacity: 1, transform: 'none' }],
          { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
      }
    });
  }

  document.querySelectorAll('.filtro').forEach(function (boton) {
    boton.addEventListener('click', function () {
      if (filtro === boton.dataset.col) return;
      filtro = boton.dataset.col;

      document.querySelectorAll('.filtro').forEach(function (otro) {
        otro.setAttribute('aria-pressed', String(otro === boton));
      });

      // View Transitions donde exista; FLIP en el resto.
      if (document.startViewTransition && !sinMovimiento.matches) {
        document.startViewTransition(function () { pintar(); });
      } else {
        pintarAnimado();
      }
    });
  });

  pintar();
})();
