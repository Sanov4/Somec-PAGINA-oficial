document.addEventListener('DOMContentLoaded', () => {

  // 0. LÓGICA DE INTERNACIONALIZACIÓN (i18n)
  const langSelect = document.getElementById('lang-select');

  // Función para obtener un valor anidado del diccionario usando puntos ("nav.home")
  function getTranslation(lang, path) {
    if (!translations[lang]) return null;
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, translations[lang]);
  }

  // Función principal para aplicar el idioma
  function applyTranslation(lang) {
    const activeLang = translations[lang] ? lang : 'es';

    // 1. Cambiar el atributo lang en la etiqueta <html>
    document.documentElement.setAttribute('lang', activeLang);

    // 2. Guardar preferencia en localStorage
    localStorage.setItem('somec_lang', activeLang);

    // 3. Sincronizar el select si es necesario
    if (langSelect && langSelect.value !== activeLang) {
      langSelect.value = activeLang;
    }

    // 4. Traducir contenido visible (textContent o innerHTML si incluye etiquetas HTML)
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = getTranslation(activeLang, key);

      if (translation !== null) {
        // Si el texto traducido contiene etiquetas HTML, usa innerHTML; de lo contrario, textContent
        if (/<[a-z][\s\S]*>/i.test(translation)) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // 5. Traducir atributos especiales (aria-label, content, title, placeholder, etc.)
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      const attrConfig = element.getAttribute('data-i18n-attr'); // Ejemplo: "aria-label:nav.ariaMenu"
      const pairs = attrConfig.split(',');

      pairs.forEach(pair => {
        const [attrName, key] = pair.split(':').map(s => s.trim());
        const translation = getTranslation(activeLang, key);
        if (translation !== null) {
          element.setAttribute(attrName, translation);
        }
      });
    });
  }

  // Cargar idioma guardado o predeterminado (Español)
  const savedLang = localStorage.getItem('somec_lang') || 'es';
  applyTranslation(savedLang);

  // Escuchar cambios en el selector de idioma
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      applyTranslation(e.target.value);
    });
  }

  // 1. Alternar Tema Claro / Oscuro
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
    });
  }

  // 2. Menú Hamburguesa e Índice Responsivo para Móviles
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Cerrar el menú desplegable al seleccionar cualquier sección del índice
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Desplegables del Acordeón de FAQ
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });

  // 4. Modal Interactivo de Webinars
  const webinarsModal = document.getElementById('webinars-modal');
  const webinarsBtn = document.getElementById('webinars-btn');
  const closeModalBtn = document.querySelector('.close-modal');

  if (webinarsBtn && webinarsModal) {
    webinarsBtn.addEventListener('click', () => {
      webinarsModal.style.display = 'flex';
    });
  }

  if (closeModalBtn && webinarsModal) {
    closeModalBtn.addEventListener('click', () => {
      webinarsModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === webinarsModal) {
        webinarsModal.style.display = 'none';
      }
    });
  }

  // 5. Renderizado de FullCalendar
  const calendarEl = document.getElementById('calendar-widget');
  if (calendarEl && typeof FullCalendar !== 'undefined') {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      buttonText: {
        today: 'today',
        month: 'month'
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth'
      }
    });
    calendar.render();
  }

});