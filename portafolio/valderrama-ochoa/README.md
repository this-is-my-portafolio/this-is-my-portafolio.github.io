# Valderrama & Ochoa — Landing ejecutiva

**Proyecto conceptual de portafolio** para la marca **Just King**.
Firma de abogados, tagline, socios, testimonios y datos numéricos son **completamente ficticios**, creados para demostrar capacidad de diseño y desarrollo de sitios corporativos de alto nivel.

## Stack

HTML5 + CSS3 + JavaScript vanilla · Google Fonts (Playfair Display + Inter) · sin frameworks, sin build.

## Estructura

```
valderrama-ochoa/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/         (vacío — los retratos son placeholders CSS en grises)
└── README.md
```

## Cómo verlo

Doble clic en `index.html`, o servido en local:

```bash
python -m http.server 8000
```

## Detalles de diseño

- Paleta estricta: **negro / blanco / grises**. Único acento **dorado #FFC72C**, usado en 4 puntos deliberadamente escasos:
  1. La cifra `USD $15M` en la sección de cifras.
  2. Hover del botón "Agendar consulta".
  3. El símbolo `&` en el nombre de la firma.
  4. La línea divisoria fina antes de los testimonios.
- Tipografía: **Playfair Display** (serif) para titulares + **Inter** (sans) para cuerpo — combinación estándar de despachos premium.

## Efecto scroll negro → blanco

Ver comentarios detallados en [js/main.js](js/main.js).

Resumen: el CSS define el fondo y el color de texto como `rgb(var(--bg-value), ...)`, con dos custom properties que un listener de scroll interpola de 0 a 255 (fondo) y de 255 a 0 (texto) a lo largo del primer 100vh. Es una transición continua tipo amanecer, no un cambio brusco.

## Responsive

Mobile-first. Verificado en breakpoints 720px y 960px. La transición scroll funciona igual en móvil (se ajusta al alto real del hero).
