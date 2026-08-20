/* Cenizo — carta desde un solo array + reserva en la misma pantalla. */

(function () {
  'use strict';

  // Toda la carta vive aqui. Cambiar el menu = tocar este array.
  var CARTA = [
    { nombre: 'Costilla de res 8 horas', precio: 68000, tipo: 'brasa',   estrella: true,
      desc: 'Cocción lenta sobre carbón de encino, glaseada con su propio jugo reducido.' },
    { nombre: 'Pulpo a la brasa',        precio: 54000, tipo: 'brasa',
      desc: 'Marcado fuerte, papa aplastada al ajo y pimentón de la casa.' },
    { nombre: 'Pollo de campo entero',   precio: 46000, tipo: 'brasa',
      desc: 'Salmuera de 24 horas, piel crocante, limón asado.' },
    { nombre: 'Chorizo de la casa',      precio: 22000, tipo: 'entrada', estrella: true,
      desc: 'Molido grueso, curado en casa, servido sobre arepa de maíz peto.' },
    { nombre: 'Provoleta al carbón',     precio: 26000, tipo: 'entrada',
      desc: 'Queso provolone fundido, orégano fresco y aceite de ají.' },
    { nombre: 'Berenjena ahumada',       precio: 24000, tipo: 'entrada',
      desc: 'Ahumada entera en la parrilla, tahini y granada.' },
    { nombre: 'Flan de panela quemada',  precio: 18000, tipo: 'postre',
      desc: 'Caramelo de panela ahumada, crema agria.' },
    { nombre: 'Helado de ceniza',        precio: 16000, tipo: 'postre',  estrella: true,
      desc: 'Vainilla infusionada en carbón vegetal. El postre que da nombre a la casa.' }
  ];

  var HORAS = ['12:30', '13:30', '14:30', '19:00', '20:00', '21:00', '22:00', '23:00'];

  var pesos = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  });

  /* ---- Carta ---------------------------------------------------------- */

  var listaPlatos = document.getElementById('platos');
  var nota = document.getElementById('carta-nota');
  var filtroActual = 'todo';

  function pintarCarta() {
    var visibles = CARTA.filter(function (p) {
      return filtroActual === 'todo' || p.tipo === filtroActual;
    });

    listaPlatos.innerHTML = '';

    visibles.forEach(function (plato, i) {
      var li = document.createElement('li');
      li.className = 'plato';
      // Escalonado corto: da sensación de orden sin volverse decorativo.
      li.style.animationDelay = (i * 28) + 'ms';

      var nombre = document.createElement('span');
      nombre.className = 'plato__nombre';
      nombre.textContent = plato.nombre;
      if (plato.estrella) {
        var marca = document.createElement('span');
        marca.className = 'plato__marca';
        marca.textContent = 'de la casa';
        nombre.appendChild(marca);
      }

      var precio = document.createElement('span');
      precio.className = 'plato__precio';
      precio.textContent = pesos.format(plato.precio);

      var desc = document.createElement('p');
      desc.className = 'plato__desc';
      desc.textContent = plato.desc;

      li.append(nombre, precio, desc);
      listaPlatos.appendChild(li);
    });

    nota.textContent = visibles.length + ' de ' + CARTA.length +
      ' platos · la carta cambia según lo que haya en el horno.';
  }

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      filtroActual = chip.dataset.filtro;
      document.querySelectorAll('.chip').forEach(function (otro) {
        otro.setAttribute('aria-pressed', String(otro === chip));
      });
      pintarCarta();
    });
  });

  /* ---- Reserva -------------------------------------------------------- */

  var selPersonas = document.getElementById('personas');
  var selDia = document.getElementById('dia');
  var rejillaHoras = document.getElementById('horas');
  var estado = document.getElementById('estado');
  var horaElegida = null;

  for (var n = 1; n <= 10; n++) {
    selPersonas.add(new Option(n + (n === 1 ? ' persona' : ' personas'), String(n)));
  }
  selPersonas.value = '2';

  // Próximos 14 días, saltando lunes: el restaurante cierra.
  var formatoDia = new Intl.DateTimeFormat('es-CO', {
    weekday: 'short', day: 'numeric', month: 'short'
  });
  var hoy = new Date();
  for (var d = 0; d < 14; d++) {
    var fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + d);
    if (fecha.getDay() === 1) continue;
    var etiqueta = d === 0 ? 'Hoy' : formatoDia.format(fecha);
    selDia.add(new Option(etiqueta, fecha.toISOString().slice(0, 10)));
  }

  function pintarHoras() {
    rejillaHoras.innerHTML = '';
    var esHoy = selDia.selectedIndex === 0 &&
                selDia.options[0].textContent === 'Hoy';
    var ahora = new Date();

    HORAS.forEach(function (hora) {
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'hora';
      boton.textContent = hora;
      boton.setAttribute('aria-pressed', 'false');

      // Si es hoy, no se puede reservar una hora que ya pasó.
      if (esHoy) {
        var partes = hora.split(':');
        var cuando = new Date();
        cuando.setHours(Number(partes[0]), Number(partes[1]), 0, 0);
        if (cuando <= ahora) {
          boton.disabled = true;
          boton.title = 'Ya pasó';
        }
      }

      boton.addEventListener('click', function () {
        horaElegida = hora;
        rejillaHoras.querySelectorAll('.hora').forEach(function (otro) {
          otro.setAttribute('aria-pressed', String(otro === boton));
        });
      });

      rejillaHoras.appendChild(boton);
    });

    horaElegida = null;
  }

  selDia.addEventListener('change', pintarHoras);

  document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();
    var datos = new FormData(e.target);
    var nombre = String(datos.get('nombre') || '').trim();

    estado.removeAttribute('data-ok');
    estado.removeAttribute('data-error');

    if (!nombre) {
      estado.setAttribute('data-error', '');
      estado.textContent = 'Falta tu nombre.';
      return;
    }
    if (!horaElegida) {
      estado.setAttribute('data-error', '');
      estado.textContent = 'Elige una hora.';
      return;
    }

    estado.setAttribute('data-ok', '');
    estado.textContent = 'Mesa para ' + datos.get('personas') + ' a las ' +
      horaElegida + ', ' + selDia.options[selDia.selectedIndex].textContent.toLowerCase() +
      '. Te esperamos, ' + nombre + '.';
    e.target.reset();
    selPersonas.value = '2';
    pintarHoras();
  });

  pintarCarta();
  pintarHoras();
})();
