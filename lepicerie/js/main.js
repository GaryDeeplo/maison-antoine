// La table de l'épicerie — interactions légères

(function () {
  // Header plus opaque au scroll
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('open', open);
    if (open) header.classList.add('scrolled');
    else onScroll();
  }
  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // Filtres de la carte des boissons
  var tabs = document.querySelectorAll('.menu-tabs button');
  var boxes = document.querySelectorAll('.menu-box');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.dataset.filter;
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      boxes.forEach(function (box) {
        box.hidden = filter !== 'all' && box.dataset.cat !== filter;
      });
    });
  });

  // Apparition douce des sections
  var revealEls = document.querySelectorAll('.lieu-text, .lieu-photo, .ardoise-section .container, .section-head, .menu-paper, .infos-text, .map-wrap');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
