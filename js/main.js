/**
 * LOS ANDANTES TERRAZA | Interacciones completas
 * Trabajo original, sin extraer scripts del sitio de referencia.
 * GSAP + ScrollTrigger: 3 imágenes, 600px, opacity 0→1,
 * scale .7→1.2, power2.out y desplazamiento 20% más lento.
 */
(() => {
  'use strict';
  const $ = (query, root = document) => root.querySelector(query);
  const $$ = (query, root = document) => [...root.querySelectorAll(query)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 01. Utilidades y contenido de respaldo.
  $('#year').textContent = String(new Date().getFullYear());
  $$('img[data-fallback]').forEach(image => {
    const fallback = () => {
      if (!image.dataset.fallback || image.src.endsWith(image.dataset.fallback)) return;
      image.src = image.dataset.fallback;
    };
    image.addEventListener('error', fallback, { once: true });
    if (image.complete && image.naturalWidth === 0) fallback();
  });

  // 02. Encabezado y progreso de desplazamiento.
  const header = $('#site-header');
  const progress = $('#scroll-progress');
  let rafPending = false;
  const trackScroll = () => {
    const y = window.scrollY;
    const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    header.classList.toggle('is-scrolled', y > 24);
    progress.style.transform = `scaleX(${Math.min(1, y / total)})`;
    rafPending = false;
  };
  addEventListener('scroll', () => {
    if (!rafPending) { requestAnimationFrame(trackScroll); rafPending = true; }
  }, { passive: true });
  addEventListener('resize', trackScroll, { passive: true });
  trackScroll();

  // 03. Navegación lateral con oscurecimiento.
  const navToggle = $('#menu-toggle');
  const navDrawer = $('#menu-drawer');
  const navBackdrop = $('#nav-backdrop');
  const setDrawer = (open) => {
    navDrawer.classList.toggle('is-open', open);
    navDrawer.inert = !open;
    navBackdrop.hidden = !open;
    navToggle.classList.toggle('is-active', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('is-locked', open);
    if (open) $('#drawer-close').focus();
    else navToggle.focus({ preventScroll: true });
  };
  navToggle.addEventListener('click', () => setDrawer(!navDrawer.classList.contains('is-open')));
  $('#drawer-close').addEventListener('click', () => setDrawer(false));
  navBackdrop.addEventListener('click', () => setDrawer(false));
  $$('a', navDrawer).forEach(link => link.addEventListener('click', () => setDrawer(false)));

  // 04. Carrusel horizontal de sabores y carta.
  function moveTrack(track, dir, cardSelector) {
    const card = $(cardSelector, track);
    const width = card ? card.getBoundingClientRect().width : 300;
    track.scrollBy({ left: (width + 20) * dir, behavior: reducedMotion ? 'instant' : 'smooth' });
  }
  $('#flavor-prev').addEventListener('click', () => moveTrack($('#flavor-carousel'), -1, '.flavor-card'));
  $('#flavor-next').addEventListener('click', () => moveTrack($('#flavor-carousel'),  1, '.flavor-card'));
  $('#menu-prev').addEventListener('click', () => moveTrack($('#menu-slider'), -1, '.menu-page'));
  $('#menu-next').addEventListener('click', () => moveTrack($('#menu-slider'),  1, '.menu-page'));

  // 05. Visor de la carta, imágenes locales y originales.
  const menuImages = Array.from({ length: 6 }, (_, i) => `assets/menu/carta-${String(i + 1).padStart(2, '0')}.svg`);
  const lightbox = $('#menu-dialog');
  const lightboxImage = $('#lightbox-image');
  const lightboxCounter = $('#lightbox-counter');
  let activeMenu = 0;
  function showMenu(index) {
    activeMenu = (index + menuImages.length) % menuImages.length;
    lightboxImage.src = menuImages[activeMenu];
    lightboxImage.alt = `Carta de demostración, página ${activeMenu + 1} de ${menuImages.length}`;
    lightboxCounter.textContent = `${String(activeMenu + 1).padStart(2, '0')} / ${String(menuImages.length).padStart(2, '0')}`;
  }
  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
    document.body.classList.remove('is-locked');
  }
  $$('.menu-page').forEach(button => button.addEventListener('click', () => {
    showMenu(Number(button.dataset.menuIndex));
    lightbox.showModal();
    document.body.classList.add('is-locked');
  }));
  $('#lightbox-close').addEventListener('click', () => closeDialog(lightbox));
  $('#lightbox-prev').addEventListener('click', () => showMenu(activeMenu - 1));
  $('#lightbox-next').addEventListener('click', () => showMenu(activeMenu + 1));
  lightbox.addEventListener('close', () => document.body.classList.remove('is-locked'));
  lightbox.addEventListener('click', evt => { if (evt.target === lightbox) closeDialog(lightbox); });

  // 06. Reseñas: extractos ilustrativos basados en la información suministrada.
  const reviews = [
    {
      title: 'Una vista privilegiada',
      quote: '“Restaurante terraza justo frente a la iglesia de Santo Domingo. Vale la pena por la vista y la comida.”',
      info: 'Opinión de visitante · Extracto adaptado para la demostración'
    },
    {
      title: 'Una experiencia gastronómica',
      quote: '“Una experiencia extraordinaria, con sabores oaxaqueños y una excelente atención.”',
      info: 'Opinión de visitante · Resumen adaptado para la demostración'
    },
    {
      title: 'Para volver',
      quote: '“La terraza tiene una gran vista al templo de Santo Domingo. Muy recomendable si estás por el centro.”',
      info: 'Opinión de visitante · Resumen adaptado para la demostración'
    }
  ];
  let activeReview = 0;
  function showReview(index) {
    activeReview = (index + reviews.length) % reviews.length;
    const review = reviews[activeReview];
    // Texto interno controlado localmente, sin introducir HTML arbitrario.
    const root = $('#review-content');
    $('h3', root).textContent = review.title;
    $('blockquote', root).textContent = review.quote;
    $('p', root).textContent = review.info;
    $('#review-counter').textContent = `${String(activeReview + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`;
  }
  $('#review-prev').addEventListener('click', () => showReview(activeReview - 1));
  $('#review-next').addEventListener('click', () => showReview(activeReview + 1));

  // 07. Solicitud de mesa — solo abre WhatsApp, no inventa disponibilidad.
  const reservationDialog = $('#reservation-dialog');
  const dateInput = $('#reserve-date');
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  dateInput.min = today;
  dateInput.value = today;
  $$('[data-reserve]').forEach(button => button.addEventListener('click', () => {
    if (navDrawer.classList.contains('is-open')) setDrawer(false);
    reservationDialog.showModal();
    document.body.classList.add('is-locked');
  }));
  $('#reservation-close').addEventListener('click', () => closeDialog(reservationDialog));
  reservationDialog.addEventListener('close', () => document.body.classList.remove('is-locked'));
  reservationDialog.addEventListener('click', evt => { if (evt.target === reservationDialog) closeDialog(reservationDialog); });
  $('#reservation-form').addEventListener('submit', evt => {
    evt.preventDefault();
    if (!evt.currentTarget.reportValidity()) return;
    const data = new FormData(evt.currentTarget);
    const message = [
      'Hola, quisiera consultar disponibilidad en Los Andantes Terraza.',
      `Nombre: ${data.get('nombre')}`,
      `Fecha: ${data.get('fecha')}`,
      `Hora: ${data.get('hora')}`,
      `Personas: ${data.get('personas')}`,
      '¿Podrían confirmarme si tienen una mesa disponible? Gracias.'
    ].join('\n');
    const url = `https://wa.me/529511144481?text=${encodeURIComponent(message)}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
    closeDialog(reservationDialog);
  });

  // 08. Atajos de teclado.
  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape' && navDrawer.classList.contains('is-open')) setDrawer(false);
    if (lightbox.open && evt.key === 'ArrowRight') showMenu(activeMenu + 1);
    if (lightbox.open && evt.key === 'ArrowLeft') showMenu(activeMenu - 1);
  });

  // 09. Animaciones progresivas y degradación elegante.
  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Portada con título y botón, similar a la entrada cinematográfica de la referencia.
  gsap.from('.hero-content > *', { y: 35, opacity: 0, duration: 1.1, stagger: .13, ease: 'power2.out', delay: .1 });
  gsap.to('.hero-media img', { yPercent: 13, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // SOLICITUD ORIGINAL: exactamente tres imágenes, cada una durante 600px de scroll.
  // 120 px de desplazamiento positivo a lo largo de 600px = 20% de compensación.
  // El contenido visual avanza 480px netos, 20% más lento que la ventana.
  $$('[data-parallax]').forEach(frame => {
    const img = $('.parallax-image', frame);
    if (!img) return;
    gsap.fromTo(img,
      { scale: .7, opacity: 0, y: 0 },
      { scale: 1.2, opacity: 1, y: 120, ease: 'power2.out',
        scrollTrigger: {
          trigger: frame,
          start: 'top 85%',
          end: '+=600',
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );
  });

  $$('.reveal').forEach(element => {
    gsap.fromTo(element, { y: 34, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 90%', once: true }
    });
  });
})();
