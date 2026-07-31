/* =========================================================
   PORTAFOLIO — interactivity
   Magnetic buttons, tilt 3D suave, sheen radial, filtros, counters
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================
     1. Botones magnéticos (sutil)
     ===================================================== */
  if (!isCoarse && !prefersReduced) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.22;
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* =====================================================
     2. Tilt 3D suave en cards
     ===================================================== */
  if (!isCoarse && !prefersReduced) {
    document.querySelectorAll(".tilt").forEach((card) => {
      const max = 4; // grados máx (más sutil que antes)
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * max;
        const ry = (px - 0.5) * max;
        card.style.transform =
          `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;

        // Actualiza posición del sheen radial en la featured card
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* =====================================================
     3. Filtros de categoría
     ===================================================== */
  const chips = document.querySelectorAll(".chip");
  const items = document.querySelectorAll("[data-filter]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const f = chip.dataset.filter;
      items.forEach((it) => {
        if (!it.dataset.filter) return;
        const match = (f === "all") || (it.dataset.filter === f);
        it.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* =====================================================
     4. Counters animados
     ===================================================== */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * ease(t)) + suffix;
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
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => countObs.observe(el));
});
