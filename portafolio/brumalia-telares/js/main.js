/* =========================================================
   BRUMALIA TELARES — main.js
   Reveal on scroll, contadores animados, menú móvil, año.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* Año en footer */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================
     Reveal on scroll
     ===================================================== */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  /* =====================================================
     Contadores animados
     data-count="N"  data-format="thousands" (opcional)
     ===================================================== */
  const formatNumber = (n, format) => {
    if (format === "thousands") return n.toLocaleString("es-DO");
    return String(n);
  };

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const format = el.dataset.format;
    const duration = 1800;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = formatNumber(Math.round(target * ease(t)), format);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll("[data-count]").forEach((el) => countObs.observe(el));

  /* =====================================================
     Menú móvil
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
     Background dinámico por sección
     -----------------------------------------------------
     Cada sección lleva data-bg="#hex". Un IntersectionObserver
     con una banda estrecha en el centro del viewport detecta
     qué sección está siendo mirada y aplica su color al body,
     que transiciona suavemente (transition en CSS).
     El fondo se ve "estático" porque nunca scrollea con la
     información — solo cambia de color al cambiar de sección.
     ===================================================== */
  const bgSections = document.querySelectorAll("[data-bg]");
  if (bgSections.length) {
    const applyBg = (el) => {
      const bg = el.dataset.bg;
      if (!bg) return;
      document.body.style.backgroundColor = bg;
      document.documentElement.style.backgroundColor = bg;
    };

    const bgObs = new IntersectionObserver((entries) => {
      // De todas las que están intersectando ahora, elegimos la primera
      // (que en la práctica es la que cruza la línea central del viewport).
      const active = entries.filter((e) => e.isIntersecting);
      if (active.length) applyBg(active[0].target);
    }, {
      // Banda de 2% en el centro vertical del viewport
      rootMargin: "-49% 0px -49% 0px",
      threshold: 0
    });

    bgSections.forEach((s) => bgObs.observe(s));

    // Estado inicial: si el usuario recarga con scroll en medio de la página,
    // aplicamos manualmente el color de la sección más cercana al centro.
    const initBg = () => {
      const mid = window.innerHeight / 2;
      let best = null, bestDist = Infinity;
      bgSections.forEach((s) => {
        const r = s.getBoundingClientRect();
        const secMid = r.top + r.height / 2;
        const dist = Math.abs(secMid - mid);
        if (dist < bestDist) { bestDist = dist; best = s; }
      });
      if (best) applyBg(best);
    };
    initBg();
  }

  /* =====================================================
     Parallax sutil en el weave del hero (respetando reduce-motion)
     ===================================================== */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const weave = document.querySelector(".hero__weave");
  if (weave && !prefersReduced) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          weave.style.transform = `translateY(${y * 0.25}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }
});
