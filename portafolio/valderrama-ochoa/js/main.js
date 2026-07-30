/* =========================================================
   Valderrama & Ochoa — main.js
   =========================================================
   Responsable de:
     1. Transición negro → blanco al hacer scroll
        (interpola CSS custom properties --bg-value y --fg-value
        entre 0 y 255 durante los primeros ~150vh).
     2. Contadores animados en la sección de cifras clave.
     3. Fade-in + slide-up al aparecer cada sección (.reveal).
     4. Menú móvil.
     5. Año dinámico en el footer.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. Transición negro → blanco por scroll
     -----------------------------------------------------
     Cómo funciona (para reutilizar en otros proyectos):

     - Definimos en CSS dos custom properties:
         --bg-value  (canal RGB del fondo)
         --fg-value  (canal RGB del texto, invertido)
       Y aplicamos:
         background-color: rgb(var(--bg-value), var(--bg-value), var(--bg-value));
         color:            rgb(var(--fg-value), var(--fg-value), var(--fg-value));

     - Al hacer scroll, calculamos el progreso (0 → 1) sobre
       una distancia igual al alto del hero.
     - Interpolamos ambos canales linealmente:
         bg: 0   → 255   (negro a blanco)
         fg: 255 → 0     (blanco a negro)
     - Como los grises secundarios usan rgba() basados en
       --fg-value, se recolorean solos.
     - Usamos requestAnimationFrame para evitar jank.

     Ventaja: es un fade continuo tipo "amanecer", no un salto.
     ===================================================== */
  const root = document.documentElement;
  const hero = document.getElementById("hero");
  let ticking = false;

  const updateTheme = () => {
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    // Transicionamos a lo largo de ~1x el alto del hero.
    const distance = heroHeight * 1;
    const progress = Math.min(Math.max(window.scrollY / distance, 0), 1);

    const bg = Math.round(progress * 255);
    const fg = Math.round(255 - progress * 255);

    root.style.setProperty("--bg-value", bg);
    root.style.setProperty("--fg-value", fg);

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateTheme);
      ticking = true;
    }
  };

  updateTheme();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateTheme);

  /* =====================================================
     2. Contadores animados
     -----------------------------------------------------
     Cada .stat__number lleva data-count="N" y opcionalmente
     data-prefix y data-suffix. Al entrar en el viewport,
     cuenta de 0 → N en ~1.6s con easing.
     ===================================================== */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    // Easing: easeOutCubic
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const value = Math.round(target * ease(t));
      el.textContent = `${prefix}${value}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const numberObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll(".stat__number[data-count]").forEach((el) => {
    numberObserver.observe(el);
  });

  /* =====================================================
     3. Reveal on scroll (fade-in + slide-up)
     ===================================================== */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  /* =====================================================
     4. Menú móvil
     ===================================================== */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =====================================================
     5. Año en el footer
     ===================================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
