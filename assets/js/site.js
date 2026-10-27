(() => {
  'use strict';
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const closeMenu = (returnFocus = false) => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    const mobile = window.matchMedia('(max-width: 759px)');
    mobile.addEventListener('change', () => closeMenu());
    toggle.hidden = false;
    document.documentElement.classList.add('nav-enhanced');
  }

  const elements = [...document.querySelectorAll('[data-reveal]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const showAll = () => {
    if (observer) observer.disconnect();
    elements.forEach((element) => {
      element.classList.remove('is-pending');
      element.classList.add('is-visible');
      element.style.removeProperty('transition-delay');
    });
  };
  const setupReveals = () => {
    showAll();
    if (motion.matches || !('IntersectionObserver' in window)) return;
    try {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('is-pending');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      elements.forEach((element, index) => {
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        observer.observe(element);
        element.style.transitionDelay = `${(index % 3) * 80}ms`;
        element.classList.remove('is-visible');
        element.classList.add('is-pending');
      });
    } catch {
      showAll();
    }
  };
  motion.addEventListener('change', setupReveals);
  setupReveals();
})();
