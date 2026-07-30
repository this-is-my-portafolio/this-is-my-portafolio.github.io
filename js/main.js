/* Just King — main.js */

document.addEventListener("DOMContentLoaded", () => {
  // Año dinámico en el footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // AOS
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }

  // Menú móvil
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

  // Envío del formulario (Formspree) sin recargar la página
  const form = document.querySelector(".contact__form");
  if (form) {
    const status = form.querySelector(".form-status");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const action = form.getAttribute("action") || "";
      if (action.includes("TU_ID_DE_FORMSPREE")) {
        status.textContent =
          "⚠ Configura tu ID de Formspree en index.html para activar el envío.";
        status.className = "form-status error";
        return;
      }

      status.textContent = "Enviando...";
      status.className = "form-status";

      const data = new FormData(form);
      try {
        const res = await fetch(action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          status.textContent = "✓ ¡Mensaje enviado! Te responderé pronto.";
          status.className = "form-status success";
          form.reset();
        } else {
          const json = await res.json().catch(() => ({}));
          status.textContent =
            json?.errors?.[0]?.message ||
            "No se pudo enviar. Intenta de nuevo o escríbeme por WhatsApp.";
          status.className = "form-status error";
        }
      } catch (err) {
        status.textContent =
          "Error de red. Intenta de nuevo o escríbeme por WhatsApp.";
        status.className = "form-status error";
      }
    });
  }
});
