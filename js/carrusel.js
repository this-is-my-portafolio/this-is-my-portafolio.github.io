/**
 * Carrusel de mazo + panel de detalle.
 *
 * No conoce ningun proyecto: todo sale de js/proyectos.js. Agregar o quitar
 * entradas en ese array es suficiente, aqui no se toca nada.
 */
import { proyectos } from './proyectos.js';

const pila       = document.getElementById('pila');
const panel      = document.getElementById('detalle');
const contador   = document.getElementById('contador');
const puntos     = document.getElementById('puntos');
const btnAnterior = document.getElementById('anterior');
const btnSiguiente = document.getElementById('siguiente');

const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
const esMovil = window.matchMedia('(max-width: 780px)');

let activo = 0;

/* -- Utilidades ----------------------------------------------------------- */

const dosDigitos = (n) => String(n + 1).padStart(2, '0');

/** Crea un elemento con atributos y contenido en una sola llamada. */
function el(tag, atributos = {}, hijos = []) {
  const nodo = document.createElement(tag);
  for (const [clave, valor] of Object.entries(atributos)) {
    if (valor === false || valor == null) continue;
    if (clave === 'class') nodo.className = valor;
    else if (clave === 'text') nodo.textContent = valor;
    else nodo.setAttribute(clave, valor === true ? '' : valor);
  }
  for (const hijo of [].concat(hijos)) {
    if (hijo) nodo.append(hijo);
  }
  return nodo;
}

function insigniaEnVivo() {
  return el('span', { class: 'envivo', text: 'EN VIVO' });
}

/* -- Mazo ----------------------------------------------------------------- */

function construirMazo() {
  pila.replaceChildren(
    ...proyectos.map((p, i) => {
      const boton = el('button', {
        class: 'tarjeta__boton',
        type: 'button',
        role: 'tab',
        id: `tab-${p.slug}`,
        'aria-controls': 'detalle',
      }, [
        el('img', {
          class: 'tarjeta__fondo',
          src: p.logo,
          alt: '',
          'aria-hidden': 'true',
          loading: 'lazy',
        }),
        el('span', { class: 'tarjeta__cabeza' }, [
          el('span', { class: 'tarjeta__num', text: dosDigitos(i) }),
          p.enVivo ? insigniaEnVivo() : null,
        ]),
        el('span', { class: 'tarjeta__cuerpo' }, [
          el('span', { class: 'tarjeta__nombre', text: p.nombre }),
          el('span', { class: 'tarjeta__cat', text: p.categoria }),
        ]),
      ]);

      boton.addEventListener('click', () => irA(i));

      return el('li', { class: 'tarjeta', 'data-indice': i }, boton);
    })
  );

  puntos.replaceChildren(...proyectos.map(() => el('li')));
}

/**
 * Coloca cada tarjeta del mazo respecto de la activa.
 *
 * En escritorio la distancia se traduce a profundidad + desplazamiento
 * vertical (efecto baraja). En movil no hay 3D: la activa esta en 0 y las
 * demas se van a los lados, listas para el swipe.
 */
function posicionarMazo() {
  const total = proyectos.length;
  const tarjetas = pila.children;

  for (let i = 0; i < total; i++) {
    const tarjeta = tarjetas[i];
    const boton = tarjeta.firstElementChild;
    // Distancia con signo, tomando el camino corto del ciclo.
    let d = i - activo;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;

    const abs = Math.abs(d);
    const esActiva = d === 0;

    tarjeta.classList.toggle('tarjeta--activa', esActiva);
    boton.setAttribute('aria-selected', esActiva ? 'true' : 'false');
    // Roving tabindex: un solo tab stop para todo el mazo.
    boton.tabIndex = esActiva ? 0 : -1;

    // Escritorio: baraja en perspectiva. El desplazamiento vertical tiene que
    // ganarle a lo que encoge la escala, o las de atras quedan tapadas.
    tarjeta.style.setProperty('--desp',   -abs * 30);
    tarjeta.style.setProperty('--prof',   -abs * 70);
    tarjeta.style.setProperty('--escala', 1 - abs * 0.035);
    tarjeta.style.setProperty('--giro',   `${abs * 2}deg`);
    tarjeta.style.setProperty('--opa',    abs > 3 ? 0 : 1);
    tarjeta.style.setProperty('--capa',   total - abs);

    // Movil: fuera de pantalla salvo la activa.
    tarjeta.style.setProperty('--desliz',    d);
    tarjeta.style.setProperty('--opa-movil', esActiva ? 1 : 0);
  }

  puntos.querySelectorAll('li').forEach((punto, i) => {
    punto.toggleAttribute('data-activo', i === activo);
  });

  contador.innerHTML = '';
  contador.append(
    el('b', { text: dosDigitos(activo) }),
    ` / ${dosDigitos(proyectos.length - 1)}`
  );
}

/* -- Panel de detalle ------------------------------------------------------ */

function construirDetalle() {
  const p = proyectos[activo];

  const verProyecto = p.enVivo
    ? el('a', {
        class: 'boton boton--oro',
        href: p.url,
        target: '_blank',
        rel: 'noopener',
      }, [`Ver proyecto `, el('span', { 'aria-hidden': 'true', text: '→' })])
    : el('span', {
        class: 'boton',
        'aria-disabled': 'true',
        text: 'Próximamente',
      });

  panel.replaceChildren(
    el('div', { class: 'detalle__cabeza' }, [
      el('p', { class: 'detalle__eyebrow' }, [
        el('b', { text: dosDigitos(activo) }),
        ` · ${p.categoria.toUpperCase()}`,
      ]),
      p.enVivo ? insigniaEnVivo() : null,
    ]),

    el('p', { class: 'detalle__tipo', text: `${p.categoria} · ${p.tipo}` }),
    el('h2', { class: 'detalle__titulo', text: p.nombre }),
    el('p', { class: 'detalle__desc', text: p.descripcion }),

    el('ul', { class: 'detalle__tags' },
      p.tags.map((t) => el('li', { text: t }))),

    el('p', { class: 'metrica' }, [
      el('span', { class: 'metrica__valor', text: p.metrica.valor }),
      el('span', { class: 'metrica__etiqueta', text: p.metrica.etiqueta }),
    ]),

    el('div', { class: 'mockup' }, [
      el('div', { class: 'mockup__barra' }, [
        el('div', { class: 'mockup__puntos' },
          [el('span'), el('span'), el('span')]),
        el('div', { class: 'mockup__url', text: p.urlVisible }),
      ]),
      el('div', { class: 'mockup__lienzo' },
        el('iframe', {
          src: p.url,
          title: `Vista previa del sitio de ${p.nombre}`,
          loading: 'lazy',
          tabindex: '-1',       // el mockup es decorativo: se navega por el CTA
          'aria-hidden': 'true',
          scrolling: 'no',
        })),
    ]),

    verProyecto
  );

  panel.setAttribute('aria-labelledby', `tab-${p.slug}`);
  ajustarZoomMockup();

  if (!sinMovimiento.matches) {
    panel.style.animation = 'none';
    void panel.offsetWidth;              // reinicia la animacion
    panel.style.animation = 'entrar 260ms cubic-bezier(.2,.8,.2,1)';
  }
}

/**
 * El iframe se dibuja a 1280x800 y se reduce con transform, para que el
 * sitio se vea en su layout de escritorio dentro del marco en vez de
 * responder al ancho diminuto del mockup.
 */
function ajustarZoomMockup() {
  const lienzo = panel.querySelector('.mockup__lienzo');
  if (!lienzo) return;
  lienzo.style.setProperty('--zoom', lienzo.clientWidth / 1280);
}

/* -- Navegacion ------------------------------------------------------------ */

function irA(indice, { enfocar = false } = {}) {
  const total = proyectos.length;
  activo = ((indice % total) + total) % total;   // envuelve en ambos sentidos
  posicionarMazo();
  construirDetalle();

  if (enfocar) {
    pila.children[activo].firstElementChild.focus();
  }
}

const anterior = (opciones) => irA(activo - 1, opciones);
const siguiente = (opciones) => irA(activo + 1, opciones);

btnAnterior.addEventListener('click', () => anterior());
btnSiguiente.addEventListener('click', () => siguiente());

// Flechas del teclado dentro del mazo, como manda el patron de tablist.
pila.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    anterior({ enfocar: true });
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    siguiente({ enfocar: true });
  } else if (e.key === 'Home') {
    e.preventDefault();
    irA(0, { enfocar: true });
  } else if (e.key === 'End') {
    e.preventDefault();
    irA(proyectos.length - 1, { enfocar: true });
  }
});

/* -- Swipe en movil -------------------------------------------------------- */

let inicioX = 0;
let inicioY = 0;
let rastreando = false;

pila.addEventListener('touchstart', (e) => {
  if (!esMovil.matches) return;
  inicioX = e.touches[0].clientX;
  inicioY = e.touches[0].clientY;
  rastreando = true;
}, { passive: true });

pila.addEventListener('touchend', (e) => {
  if (!rastreando) return;
  rastreando = false;

  const dx = e.changedTouches[0].clientX - inicioX;
  const dy = e.changedTouches[0].clientY - inicioY;

  // Solo cuenta como swipe si fue claramente horizontal: si no, es scroll.
  if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
  dx < 0 ? siguiente() : anterior();
}, { passive: true });

/* -- Arranque -------------------------------------------------------------- */

window.addEventListener('resize', ajustarZoomMockup);

construirMazo();
irA(0);
