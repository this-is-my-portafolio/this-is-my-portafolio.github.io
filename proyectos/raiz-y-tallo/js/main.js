/* Raíz y Tallo — ramos por ocasion + franjas de entrega que caducan solas. */

(function () {
  'use strict';

  var PREPARACION_MIN = 90;   // lo que toma armar un ramo desde que entra el pedido

  var RAMOS = [
    { nombre: 'Primer Sol',    oc: 'celebrar',  precio: 95000,  tallos: 12,
      flor: '#F2C879', hoja: '#7E8B63',
      desc: 'Girasoles pequeños y solidago. Para cumpleaños que empiezan temprano.' },
    { nombre: 'Buen Camino',   oc: 'celebrar',  precio: 120000, tallos: 15,
      flor: '#E9A0B4', hoja: '#6B7A63',
      desc: 'Gerberas y eucalipto. Grados, ascensos, mudanzas.' },
    { nombre: 'Sosiego',       oc: 'acompanar', precio: 140000, tallos: 18,
      flor: '#EDE7DC', hoja: '#5F6B58',
      desc: 'Lilium blanco y hojas de olivo. Discreto, sin nada estridente.' },
    { nombre: 'Memoria',       oc: 'acompanar', precio: 165000, tallos: 20,
      flor: '#DCD5CA', hoja: '#5A6553',
      desc: 'Rosas crema y gypsophila. Para cuando las palabras no bastan.' },
    { nombre: 'Gracias Mil',   oc: 'gracias',   precio: 88000,  tallos: 10,
      flor: '#F0B96E', hoja: '#77855F',
      desc: 'Alstroemerias en tonos cálidos. Compacto, cabe en cualquier mesa.' },
    { nombre: 'Detalle Justo', oc: 'gracias',   precio: 62000,  tallos: 7,
      flor: '#E8C9A0', hoja: '#7E8B63',
      desc: 'Ramo pequeño de temporada. El que se manda sin ocasión.' },
    { nombre: 'Rubor',         oc: 'amor',      precio: 155000, tallos: 16,
      flor: '#DDB3AC', hoja: '#6B7A63',
      desc: 'Rosa palo y ranúnculos. Menos obvio que las rojas.' },
    { nombre: 'Lazo Rojo',     oc: 'amor',      precio: 185000, tallos: 24,
      flor: '#C2564F', hoja: '#5F6B58',
      desc: 'Dos docenas de rosas rojas. El clásico, bien hecho.' }
  ];

  var NOMBRE_OC = {
    celebrar: 'Celebrar', acompanar: 'Acompañar',
    gracias: 'Dar las gracias', amor: 'Amor'
  };

  // Franjas de entrega del día, en minutos desde medianoche.
  var FRANJAS = [
    { rango: '9:00 – 12:00',  cierre: 12 * 60 },
    { rango: '12:00 – 15:00', cierre: 15 * 60 },
    { rango: '15:00 – 18:00', cierre: 18 * 60 },
    { rango: '18:00 – 21:00', cierre: 21 * 60 }
  ];

  var pesos = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  });
  var hora = new Intl.DateTimeFormat('es-CO', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });

  var filtro = 'todo';
  var franjaElegida = null;

  /* ---- Ramos ----------------------------------------------------------- */

  function pintarRamos() {
    var lista = document.getElementById('ramos-lista');
    var visibles = RAMOS.filter(function (r) {
      return filtro === 'todo' || r.oc === filtro;
    });

    lista.innerHTML = '';

    visibles.forEach(function (ramo, i) {
      var li = document.createElement('li');
      li.className = 'ramo';
      li.style.animationDelay = (i * 30) + 'ms';

      var visual = document.createElement('div');
      visual.className = 'ramo__visual';

      var tallo = document.createElement('span');
      tallo.className = 'ramo__tallo';

      var flor = document.createElement('span');
      flor.className = 'ramo__flor';
      // Arreglo dibujado: corola clara al centro sobre follaje.
      flor.style.background =
        'radial-gradient(circle at 38% 34%, ' + ramo.flor + ' 0 26%, ' +
        'rgba(255,255,255,.55) 27% 32%, ' + ramo.flor + ' 33% 52%, ' +
        ramo.hoja + ' 53% 100%)';

      visual.append(tallo, flor);

      var cuerpo = document.createElement('div');
      cuerpo.className = 'ramo__cuerpo';

      var oc = document.createElement('span');
      oc.className = 'ramo__oc';
      oc.textContent = NOMBRE_OC[ramo.oc];

      var nombre = document.createElement('span');
      nombre.className = 'ramo__nombre';
      nombre.textContent = ramo.nombre;

      var desc = document.createElement('p');
      desc.className = 'ramo__desc';
      desc.textContent = ramo.desc;

      var pie = document.createElement('div');
      pie.className = 'ramo__pie';
      var precio = document.createElement('span');
      precio.className = 'ramo__precio';
      precio.textContent = pesos.format(ramo.precio);
      var tallos = document.createElement('span');
      tallos.className = 'ramo__tallos';
      tallos.textContent = ramo.tallos + ' tallos';
      pie.append(precio, tallos);

      cuerpo.append(oc, nombre, desc, pie);
      li.append(visual, cuerpo);
      lista.appendChild(li);
    });
  }

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      filtro = tab.dataset.oc;
      document.querySelectorAll('.tab').forEach(function (otro) {
        otro.setAttribute('aria-pressed', String(otro === tab));
      });
      pintarRamos();
    });
  });

  /* ---- Entrega ---------------------------------------------------------
     Una franja sirve solo si su cierre deja margen para preparar el ramo.
     Si ya no alcanza ninguna, el pedido pasa a mañana. */

  function minutosAhora() {
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function pintarFranjas() {
    var contenedor = document.getElementById('franjas');
    var ahora = minutosAhora();
    var limite = ahora + PREPARACION_MIN;
    contenedor.innerHTML = '';

    var algunaHoy = false;

    FRANJAS.forEach(function (franja) {
      var alcanza = franja.cierre >= limite;
      if (alcanza) algunaHoy = true;

      // La franja elegida cae si deja de alcanzar mientras la página vive.
      if (!alcanza && franjaElegida === franja.rango) franjaElegida = null;

      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'franja';
      boton.disabled = !alcanza;
      boton.setAttribute('aria-pressed',
        String(alcanza && franjaElegida === franja.rango));

      var rango = document.createElement('span');
      rango.className = 'franja__rango';
      rango.textContent = franja.rango;

      var estado = document.createElement('span');
      estado.className = 'franja__estado';
      estado.textContent = alcanza ? 'Hoy · disponible' : 'Ya no alcanza';

      boton.append(rango, estado);

      if (alcanza) {
        boton.addEventListener('click', function () {
          franjaElegida = franja.rango;
          contenedor.querySelectorAll('.franja').forEach(function (otro) {
            otro.setAttribute('aria-pressed', String(otro === boton));
          });
          pintarResumen();
        });
      }

      contenedor.appendChild(boton);
    });

    var reloj = document.getElementById('reloj');
    reloj.innerHTML = '';
    reloj.append('Son las ');
    var b = document.createElement('b');
    // es-CO devuelve "1:28 a. m." con punto final: se quita para no duplicarlo.
    b.textContent = hora.format(new Date()).replace(/\.$/, '');
    reloj.append(b, '. Preparar un ramo toma ' + PREPARACION_MIN +
      ' minutos, así que ');
    reloj.append(algunaHoy
      ? 'todavía hay franjas para hoy.'
      : 'lo de hoy ya cerró: el próximo turno es mañana a las 9:00.');

    document.getElementById('barra-aviso').textContent = algunaHoy
      ? 'Entregando hoy'
      : 'Pedidos para mañana';

    pintarResumen();
  }

  function pintarResumen() {
    var resumen = document.getElementById('resumen');
    if (!franjaElegida) {
      resumen.textContent = '';
      resumen.removeAttribute('data-listo');
      return;
    }
    resumen.setAttribute('data-listo', '');
    resumen.textContent = 'Entrega hoy entre ' + franjaElegida +
      '. Te escribimos al despachar.';
  }

  pintarRamos();
  pintarFranjas();
  // Las franjas caducan mientras la página está abierta.
  setInterval(pintarFranjas, 60000);
})();
