# Just King — Portafolio (GitHub Pages)

Portafolio de **Just King** enfocado en sitios web para **restaurantes y
tiendas**. Un carrusel de tarjetas apiladas a la izquierda, un panel de
detalle a la derecha, y cinco proyectos de demostración navegables dentro del
mismo repositorio.

Stack: **HTML5 + CSS3 + JavaScript vanilla** (módulos ES). Sin build, sin
dependencias que instalar. Solo Google Fonts por CDN.

En vivo: <https://this-is-my-portafolio.github.io>

---

## Estructura

```
site/
├── index.html                  ← el portafolio (carrusel + panel de detalle)
├── css/portafolio.css
├── js/
│   ├── proyectos.js            ← ★ FUENTE ÚNICA DE DATOS
│   └── carrusel.js             ← render y navegación; no conoce ningún proyecto
├── proyectos/                  ← los cinco sitios de demostración
│   ├── cenizo/                 restaurante · carta + reserva
│   ├── tostado-nueve/          cafetería · menú por tueste + pedido
│   ├── anima-studio/           tienda · catálogo editorial
│   ├── raiz-y-tallo/           floristería · franjas de entrega
│   └── horno-cinco/            panadería · hornadas con cupo
├── assets/
│   ├── logo.png
│   └── marcas/<slug>/          logo y banner de cada negocio
└── inicio-anterior/            ← landing anterior de Just King, archivada
```

---

## Agregar o quitar un proyecto

Todo vive en [`js/proyectos.js`](js/proyectos.js). Es un array: agregar un
objeto agrega una tarjeta al mazo, un punto en móvil y una entrada en el
contador. **No hay que tocar el HTML ni el carrusel.**

```js
{
  slug:        'mi-negocio',
  categoria:   'Restaurante',            // eyebrow, se pone en mayúsculas
  tipo:        'Landing de reservas',    // subtítulo técnico
  nombre:      'Mi Negocio',             // título grande
  descripcion: '2-3 líneas: qué es, qué resuelve, qué tiene de especial.',
  tags:        ['HTML', 'CSS', 'JavaScript'],
  metrica:     { valor: '+38%', etiqueta: 'reservas online' },
  url:         'proyectos/mi-negocio/',  // relativa a la raíz del sitio
  urlVisible:  'minegocio.just-king.dev',// lo que se lee en el mockup
  logo:        'assets/marcas/mi-negocio/logo.png',
  enVivo:      true,                     // false → botón "Próximamente"
}
```

---

## Sistema visual

Negro absoluto, neón blanco, y **oro como único color de acción**.

| Rol | Hex | Uso |
|---|---|---|
| Fondo | `#000000` | Toda la página, sin gradientes |
| Neón blanco | `#F5F5FF` | Títulos, bordes activos, glow |
| Gris cuerpo | `#A8A8B8` | Párrafos — 9.0:1 sobre negro |
| Gris meta | `#787884` | Etiquetas mono — 4.8:1, pasa AA |
| Oro | `#D4AF37` | **Solo** CTA y la métrica destacada |
| Verde | `#2BE38F` | **Solo** el punto de 6 px de "EN VIVO" |

Tipografías: **Space Grotesk** (títulos, tracking negativo) y **JetBrains
Mono** (etiquetas, datos, siempre en mayúsculas con tracking abierto).

El glow es `box-shadow` multicapa real, no un `border` de color: cuatro capas
hasta 60 px para el blanco, tres hasta 32 px para el oro — por eso el oro se
lee más cálido y compacto al lado del blanco.

**El color de cada marca vive solo dentro del mockup del navegador.** En el
cromo del portafolio los logos van en escala de grises: así el oro sigue
siendo el único acento y los sitios reales resaltan por contraste.

---

## Accesibilidad

- Carrusel con patrón `tablist` / `tab`, un solo tab stop (roving tabindex).
- Flechas ←→↑↓, `Home` y `End` navegan entre proyectos.
- Panel de detalle con `aria-live="polite"`.
- Foco visible en todo lo interactivo; nunca `outline: none` a secas.
- Todo el texto pasa WCAG AA (≥ 4.5:1) sobre negro.
- `prefers-reduced-motion: reduce` apaga transiciones, el latido de "EN VIVO"
  y el desplazamiento del mazo.

---

## Responsive

| Ancho | Comportamiento |
|---|---|
| ≥ 1180 px | Dos columnas: mazo 360 px + detalle |
| 1000–1180 px | Dos columnas, mazo 300 px |
| 780–1000 px | Una columna; el mazo conserva el 3D, ahora a lo ancho |
| < 780 px | Sin apilado 3D: una tarjeta plana, swipe + flechas, puntos |

---

## Probar localmente

Hace falta servirlo por HTTP: `js/carrusel.js` es un módulo ES y el mockup
carga los proyectos en `iframe`.

```bash
python3 -m http.server 8731
```

Luego abre <http://localhost:8731>.

---

## Desplegar

GitHub Pages sirve la rama `main` desde la raíz. Hacer commit y push publica.

```bash
git add -A && git commit -m "..." && git push
```

---

## Nota sobre el contenido

Los cinco negocios son **ficticios** y las métricas son inventadas: es un
portafolio de demostración. Cada sitio lo dice en su pie de página.

---

Hecho con ☕ y IA — **Just King**
