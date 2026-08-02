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
