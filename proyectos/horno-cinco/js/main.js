/* Horno Cinco — hornadas con hora de salida y cupo que se agota en vivo. */

(function () {
  'use strict';

  /* Cada hornada tiene hora de salida, cupo total y cuantas quedan. El cupo
     baja por los encargos del visitante y tambien solo, simulando el resto de
     la clientela: es lo que hace que la barra se sienta viva. */
  var HORNADAS = [
    { hora: '06:30', pan: 'Masa madre de campo', precio: 14000, total: 40,
      desc: 'Hogaza de 900 g, corteza gruesa, fermentación de 18 horas.' },
    { hora: '09:00', pan: 'Croissants de mantequilla', precio: 5500, total: 60,
      desc: 'Laminado a mano, 27 capas. Salen y se van.' },
    { hora: '11:30', pan: 'Pan de centeno y nuez', precio: 16000, total: 25,
      desc: 'Denso, húmedo, aguanta cuatro días envuelto en tela.' },
    { hora: '14:00', pan: 'Conchas de vainilla', precio: 3500, total: 80,
      desc: 'Costra crujiente, miga suave. La hornada de la tarde.' },
    { hora: '16:30', pan: 'Baguette tradición', precio: 7000, total: 45,
      desc: 'Harina T65, sin mejorantes. Para la cena.' },
    { hora: '18:00', pan: 'Rol de canela', precio: 6500, total: 35,
      desc: 'Con glaseado de queso crema. La última del día.' }
  ];

  var pesos = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  });

  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var elegida = null;
  var cantidad = 1;

  /* ---- Estado inicial de cada hornada ---------------------------------
     Las que ya pasaron estan mas vendidas; las de mas tarde, casi intactas. */

  function minutosDe(hhmm) {
    var p = hhmm.split(':');
    return Number(p[0]) * 60 + Number(p[1]);
  }

  /* Fuera de la jornada del horno (6:30–18:00) no habria nada que mostrar:
     todas las hornadas saldrian "programadas" y llenas, que es justo el estado
     mas aburrido. Como es una demostracion, fuera de ese rango la pagina se
     situa a media manana, con la mezcla habitual de agotadas y por salir. */
  var DIA_INICIO = 6 * 60 + 30;
  var DIA_FIN = 18 * 60;
  var reloj = new Date().getHours() * 60 + new Date().getMinutes();
  var ahora = (reloj >= DIA_INICIO && reloj <= DIA_FIN) ? reloj : 11 * 60 + 30;

  HORNADAS.forEach(function (h, i) {
    var minutos = minutosDe(h.hora);
    var vendidoBase;

    if (minutos < ahora - 60) {
      vendidoBase = 1;                      // agotada hace rato
    } else if (minutos < ahora) {
      vendidoBase = 0.82 + (i % 3) * 0.05;  // saliendo ahora
    } else if (minutos < ahora + 180) {
      vendidoBase = 0.35 + (i % 4) * 0.08;  // proxima
    } else {
      vendidoBase = 0.05 + (i % 3) * 0.04;  // lejana
    }

    h.quedan = Math.max(0, Math.round(h.total * (1 - vendidoBase)));
    h.minutos = minutos;
  });

  /* ---- Pintado --------------------------------------------------------- */

  function estadoDe(h) {
    if (h.quedan === 0) return { texto: 'Agotada', tono: null };
    if (h.minutos <= ahora) return { texto: 'Recién salida', tono: 'vivo' };
    if (h.minutos <= ahora + 120) return { texto: 'Sale pronto', tono: 'pronto' };
    return { texto: 'Programada', tono: null };
  }

  function pintar() {
    var lista = document.getElementById('lista');
    lista.innerHTML = '';

    HORNADAS.forEach(function (h, indice) {
      var agotada = h.quedan === 0;
      var estado = estadoDe(h);
      var porcentaje = (h.quedan / h.total) * 100;

      var li = document.createElement('li');
      li.className = 'hornada';
      if (agotada) li.dataset.agotada = '';
      if (elegida === indice) li.dataset.elegida = '';

      var cabeza = document.createElement('div');
      cabeza.className = 'hornada__cabeza';
      var hora = document.createElement('span');
      hora.className = 'hornada__hora';
      hora.textContent = h.hora;
      var etiqueta = document.createElement('span');
      etiqueta.className = 'hornada__etiqueta';
      etiqueta.textContent = estado.texto;
      if (estado.tono) etiqueta.dataset.tono = estado.tono;
      cabeza.append(hora, etiqueta);

      var pan = document.createElement('span');
      pan.className = 'hornada__pan';
      pan.textContent = h.pan;

      var desc = document.createElement('p');
      desc.className = 'hornada__desc';
      desc.textContent = h.desc;

      var cupo = document.createElement('div');
      cupo.className = 'cupo';
      var pista = document.createElement('div');
      pista.className = 'cupo__pista';
      pista.setAttribute('role', 'progressbar');
      pista.setAttribute('aria-valuenow', String(h.quedan));
      pista.setAttribute('aria-valuemin', '0');
      pista.setAttribute('aria-valuemax', String(h.total));
      pista.setAttribute('aria-label', 'Cupo restante de la hornada de ' + h.hora);
      var relleno = document.createElement('span');
      relleno.className = 'cupo__relleno';
      relleno.style.width = porcentaje + '%';
      if (porcentaje < 25) relleno.dataset.bajo = '';
      pista.appendChild(relleno);

      var texto = document.createElement('p');
      texto.className = 'cupo__texto';
      texto.style.margin = '0';
      var izq = document.createElement('span');
      if (agotada) {
        izq.textContent = 'Sin cupo';
      } else {
        var b = document.createElement('b');
        b.textContent = String(h.quedan);
        izq.append(b, ' de ' + h.total + ' piezas');
      }
      var der = document.createElement('span');
      der.className = 'hornada__precio';
      der.textContent = pesos.format(h.precio);
      texto.append(izq, der);
      cupo.append(pista, texto);

      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'elegir';
      boton.disabled = agotada;
      boton.textContent = agotada ? 'Agotada'
        : (elegida === indice ? 'Elegida' : 'Elegir esta hornada');
      boton.addEventListener('click', function () {
        elegida = indice;
        cantidad = 1;
        pintar();
        pintarEncargo();
        document.getElementById('encargo').scrollIntoView({
          behavior: sinMovimiento.matches ? 'auto' : 'smooth',
          block: 'nearest'
        });
      });

      li.append(cabeza, pan, desc, cupo, boton);
      lista.appendChild(li);
    });

    var vivas = HORNADAS.filter(function (h) { return h.quedan > 0; }).length;
    document.getElementById('barra-estado').textContent =
      vivas + (vivas === 1 ? ' hornada con cupo' : ' hornadas con cupo');
  }

  /* ---- Encargo ---------------------------------------------------------- */

  var cuerpo = document.getElementById('encargo-cuerpo');
  var titulo = document.getElementById('encargo-titulo');
  var aviso = document.getElementById('encargo-aviso');

  function pintarEncargo() {
    if (elegida === null) {
      cuerpo.hidden = true;
      titulo.textContent = titulo.dataset.vacio;
      return;
    }

    var h = HORNADAS[elegida];
    cuerpo.hidden = false;
    titulo.textContent = h.pan;

    var linea = document.getElementById('encargo-linea');
    linea.innerHTML = '';
    var b = document.createElement('b');
    b.textContent = 'Hornada de las ' + h.hora;
    linea.append(b, ' · quedan ' + h.quedan + ' piezas · ' +
      pesos.format(h.precio) + ' cada una');

    cantidad = Math.min(cantidad, h.quedan);
    document.getElementById('cantidad').textContent = String(cantidad);
    document.getElementById('menos').disabled = cantidad <= 1;
    document.getElementById('mas').disabled = cantidad >= h.quedan;
  }

  document.getElementById('menos').addEventListener('click', function () {
    if (cantidad > 1) { cantidad--; pintarEncargo(); }
  });

  document.getElementById('mas').addEventListener('click', function () {
    if (elegida !== null && cantidad < HORNADAS[elegida].quedan) {
      cantidad++;
      pintarEncargo();
    }
  });

  document.getElementById('reservar').addEventListener('click', function () {
    if (elegida === null) return;
    var h = HORNADAS[elegida];

    h.quedan = Math.max(0, h.quedan - cantidad);
    aviso.setAttribute('data-ok', '');
    aviso.textContent = cantidad + (cantidad === 1 ? ' pieza reservada' : ' piezas reservadas') +
      ' de la hornada de las ' + h.hora + ' · ' + pesos.format(h.precio * cantidad) +
      '. Pasa a recoger a partir de esa hora.';

    if (h.quedan === 0) elegida = null;
    cantidad = 1;
    pintar();
    pintarEncargo();
  });

  /* ---- El cupo baja solo ----------------------------------------------
     Un encargo ajeno cada tanto en las hornadas que aun no salieron. */

  function ventaAjena() {
    var candidatas = HORNADAS.filter(function (h) {
      return h.quedan > 0 && h.minutos >= ahora - 30;
    });
    if (!candidatas.length) return;

    var h = candidatas[Math.floor(Math.random() * candidatas.length)];
    h.quedan = Math.max(0, h.quedan - (Math.random() < 0.7 ? 1 : 2));

    if (elegida !== null && HORNADAS[elegida].quedan === 0) elegida = null;
    pintar();
    pintarEncargo();
  }

  pintar();
  pintarEncargo();
  if (!sinMovimiento.matches) setInterval(ventaAjena, 9000);
})();
