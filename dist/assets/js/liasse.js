// Maison Antoine — « La liasse » : interactions, sans dépendance.
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Menu ------------------------------------------------------------ */
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    const label = toggle.querySelector('.hd__toggle-label');
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      if (label) label.textContent = open ? 'Fermer' : 'Menu';
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ----- Carte d'accueil : titre mot à mot --------------------------------- */
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    hero.querySelectorAll('.w').forEach((w, i) => w.style.setProperty('--wi', i));
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-ready')));
  }

  /* ----- En-tête : filet dès qu'on quitte le haut de page ---------------- */
  const hd = document.querySelector('[data-header]');
  if (hd) {
    const onScroll = () => hd.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- Matériauthèque : ouverte maintenant ? (heure de Bruxelles) ------
     Visite libre jeudi, vendredi, samedi de 10h à 18h. */
  const now = (() => {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Brussels', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
      return { day, min: Number(get('hour')) * 60 + Number(get('minute')) };
    } catch (e) { return null; }
  })();
  if (now) {
    const OPEN_DAYS = [4, 5, 6], OPEN = 600, CLOSE = 1080;
    const names = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const isOpen = OPEN_DAYS.includes(now.day) && now.min >= OPEN && now.min < CLOSE;
    let short, long;
    if (isOpen) {
      short = 'Matériauthèque ouverte · jusqu’à 18h';
      long = 'Ouvert maintenant, jusqu’à 18h';
    } else {
      // prochaine ouverture
      let d = now.day, k = 0;
      if (!(OPEN_DAYS.includes(d) && now.min < OPEN)) { do { d = (d + 1) % 7; k++; } while (!OPEN_DAYS.includes(d)); }
      const when = k === 0 ? 'aujourd’hui à 10h' : k === 1 ? 'demain à 10h' : names[d] + ' à 10h';
      short = 'Matériauthèque · ouvre ' + when;
      long = OPEN_DAYS.includes(now.day) ? 'Fermé, réouverture ' + when : 'Sur rendez‑vous · visite libre ' + when;
    }
    document.querySelectorAll('[data-open-status]').forEach((el) => {
      el.classList.toggle('is-open', isOpen);
      const t = el.querySelector('[data-open-text]'); if (t) t.textContent = short;
    });
    document.querySelectorAll('[data-open-today]').forEach((el) => {
      el.textContent = long;
      el.parentElement.classList.toggle('is-open', isOpen);
    });
  }

  /* ----- Quatre temps : la vidéo joue quand la carte est à l'écran ------- */
  const steps = document.querySelectorAll('[data-step] video');
  if (steps.length && !reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.preload = 'auto'; target.play().catch(() => {}); }
        else target.pause();
      });
    }, { threshold: 0.6 });
    steps.forEach((v) => io.observe(v));
  }

  /* ----- Formulaire de contact : envoi sans quitter la page ------------ */
  const form = document.querySelector('[data-contact-form]');
  if (form && window.fetch) {
    const status = form.querySelector('[data-form-status]');
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    const fallback = 'Vous pouvez aussi nous appeler au <a href="tel:+32495703030">+32 495 70 30 30</a>.';
    const show = (state, html) => { status.dataset.state = state; status.innerHTML = html; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // endpoint pas encore branché : on ne fait pas semblant d'envoyer
      if (/VOTRE_ID/.test(form.action)) {
        show('error', "L'envoi en ligne n'est pas encore disponible. " + fallback);
        return;
      }
      btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.textContent = 'Envoi en cours…';
      try {
        const res = await fetch(form.action, {
          method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        show('success', 'Merci, votre demande est bien partie. Nous vous répondons très vite.');
      } catch (err) {
        show('error', "Votre demande n'a pas pu être envoyée. Réessayez dans un instant. " + fallback);
      } finally {
        btn.removeAttribute('aria-busy'); btn.disabled = false; btn.textContent = label;
      }
    });
  }

  /* ----- WhatsApp flottant : ouvre / ferme le préchoix ------------------ */
  const wa = document.querySelector('[data-wa]');
  if (wa) {
    const waBtn = wa.querySelector('[data-wa-toggle]');
    const waPanel = wa.querySelector('.wa__panel');
    const setWa = (open) => {
      waBtn.setAttribute('aria-expanded', String(open));
      waPanel.hidden = !open;
      if (open) waPanel.querySelector('input').focus();
    };
    waBtn.addEventListener('click', () => setWa(waPanel.hidden));
    // « Autre » : ouvre un champ libre, intégré au message comme un besoin de plus
    const otherToggle = wa.querySelector('[data-wa-other-toggle]');
    const otherBox = wa.querySelector('[data-wa-other]');
    const otherInput = otherBox.querySelector('input');
    otherToggle.addEventListener('change', () => {
      otherBox.hidden = !otherToggle.checked;
      if (otherToggle.checked) otherInput.focus();
    });
    otherInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.form.requestSubmit(); } });
    wa.querySelector('[data-wa-form]').addEventListener('submit', (e) => {
      e.preventDefault();
      const needs = [...e.target.querySelectorAll('input[name="besoin"]:checked')].map((i) => i.value);
      // texte libre : sans ponctuation finale, minuscule initiale pour s'enchaîner dans la phrase
      const other = otherToggle.checked
        ? otherInput.value.trim().replace(/[.!?…\s]+$/, '').replace(/^\p{Lu}(?!\p{Lu})/u, (c) => c.toLowerCase())
        : '';
      if (other) needs.push(other);
      const list = needs.length > 1
        ? needs.slice(0, -1).join(', ') + ' et ' + needs[needs.length - 1]
        : needs[0];
      const msg = list
        ? `Bonjour Marie-Frédérique, je souhaiterais ${list}. Pourriez-vous me conseiller ? Merci !`
        : "Bonjour Marie-Frédérique, j'aimerais vous parler d'un projet de décoration. Merci !";
      window.open('https://wa.me/32495703030?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      setWa(false);
      e.target.reset(); otherBox.hidden = true;
    });
    document.addEventListener('click', (e) => { if (!waPanel.hidden && !wa.contains(e.target)) setWa(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !waPanel.hidden) { setWa(false); waBtn.focus(); }
    });
  }

  window.addEventListener('load', () => {
    setTimeout(() => document.documentElement.classList.add('smooth-scroll'), 300);
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
