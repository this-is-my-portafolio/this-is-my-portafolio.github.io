# Just King — Portafolio (GitHub Pages)

Sitio web de una sola página para la marca personal **Just King**, especializada en desarrollo de páginas web asistido por IA.

Stack: **HTML5 + CSS3 + JavaScript vanilla**. Animaciones con **AOS**. Fuentes de Google Fonts. Sin build, sin dependencias que instalar.

---

## 📁 Estructura

```
site/
├── index.html          ← página principal
├── css/style.css       ← estilos (paleta neón sobre fondo negro)
├── js/main.js          ← menú móvil, animaciones
├── assets/
│   └── logo.png        ← logo/foto de perfil
└── README.md           ← este archivo
```

---

## 🚀 Cómo subirlo a GitHub Pages (paso a paso)

### 1. Crear el repositorio con el nombre correcto

Para que la URL final sea **`https://this-is-my-portafolio.github.io`**, tu cuenta de GitHub debe llamarse `this-is-my-portafolio`, y el repositorio también debe llamarse **exactamente**:

```
this-is-my-portafolio.github.io
```

- Ve a https://github.com/new
- **Repository name:** `this-is-my-portafolio.github.io`
- Visibilidad: **Public**
- No marques "Add README" (para no crear conflictos)
- Crea el repositorio

### 2. Subir los archivos

Desde la carpeta `site/`, abre una terminal y ejecuta:

```bash
git init
git add .
git commit -m "Initial commit: Just King portfolio"
git branch -M main
git remote add origin https://github.com/this-is-my-portafolio/this-is-my-portafolio.github.io.git
git push -u origin main
```

(También puedes arrastrar los archivos en la web de GitHub si prefieres no usar consola.)

### 3. Activar GitHub Pages

1. En el repositorio, ve a **Settings** → **Pages**
2. En **Source**, selecciona **Deploy from a branch**
3. En **Branch**, elige `main` y carpeta `/ (root)`
4. Guarda. En 1–2 minutos, tu sitio estará en:

   **https://this-is-my-portafolio.github.io**

---

## ⚙️ Configuración obligatoria antes de publicar

Marcadores ya configurados en `index.html`:

| Marcador | Dónde | Estado |
|---|---|---|
| Ko-fi | URL del botón "Cómprame un café" | ✅ Configurado (`ko-fi.com/just_king`) |
| Correo de contacto | Enlace de Gmail en el botón flotante y en la caja de Contacto | ✅ Configurado (`justk.service@gmail.com`) |
| Fiverr | Enlace en la caja de Contacto | ✅ Configurado (`es.fiverr.com/sellers/sou_rey/`) |

Guarda, haz commit y push. GitHub Pages actualizará el sitio automáticamente en unos segundos.

---

## 🖼️ Cómo cambiar el logo

El logo actual está en `assets/logo.png` (fue copiado desde tu carpeta original). Para reemplazarlo:

1. Sustituye el archivo `assets/logo.png` por tu nueva imagen (**mismo nombre**, formato PNG cuadrado, mínimo 400×400 px).
2. Haz commit + push.

Se usa en 3 lugares automáticamente: navbar, hero (portada) y footer, además del favicon.

---

## 🎨 Paleta de colores (por si quieres ajustar)

Editable en las primeras líneas de `css/style.css` (variables `--pink`, `--red`, `--cyan`, `--green`):

| Color | Hex | Uso |
|---|---|---|
| Negro | `#000000` | Fondo |
| Blanco | `#FFFFFF` | Texto principal |
| Rosa neón | `#FF00C8` | Gradientes y acentos |
| Rojo neón | `#FF0033` | CTA principal (botones) |
| Cyan neón | `#00E1FF` | Links, bordes interactivos |
| Verde neón | `#39FF14` | Éxito, badges |

---

## ✅ Pendientes que pusiste como "por completar"

- **Lista definitiva de servicios y precios:** ya hay 4 tarjetas con precios de referencia (Landing $120, Portafolio $180, Tienda $300, Mantenimiento $40/mes). Ajústalos en `index.html` (sección `#services`).
- **Texto "Sobre mí":** escribí una versión inicial en 3 párrafos en la sección `#about`. Reemplázalo cuando tengas tu versión definitiva.
- **Testimonios:** son placeholders honestos ("aún no tengo reseñas, sé el primero"). Cuando tengas testimonios reales, reemplázalos.
- **Proyectos:** hay 3 tarjetas con etiqueta "Demo"/"Próximamente" y fondos generados con gradientes CSS. Cuando termines un proyecto real, sustituye la tarjeta correspondiente añadiendo una imagen en `assets/` y un enlace.

---

## 🔧 Probar localmente

Simplemente abre `index.html` en el navegador (doble clic). No hay build ni servidor necesario — ya no hay formulario con `fetch`, así que ni siquiera hace falta servirlo por HTTP.

---

## 📬 Correo con dominio propio (a futuro)

Cuando compres un dominio (p. ej. `justking.com`), podrás:

1. Apuntarlo a GitHub Pages (configuración estándar de CNAME).
2. Crear un correo `contacto@justking.com` con **Zoho Mail** (gratis para 1 usuario) o **Google Workspace** (de pago).

Mientras tanto, `justk.service@gmail.com` funciona perfectamente como correo de contacto.

---

Hecho con ☕ y IA — **Just King**
