// Maison Antoine — interactions & mouvement, sans dépendance.
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Nav mobile ----------------------------------------------------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('mobile-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', () =>
      setOpen(toggle.getAttribute('aria-expanded') !== 'true')
    );
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ----- Hero : révélation à l'arrivée (titre mot à mot, fil, etc.) ----- */
  const hero = document.querySelector('[data-hero]');
  const heroMedia = hero && hero.querySelector('.hero-media');
  const heroImg = heroMedia && heroMedia.querySelector('.hero-media__img');
  const heroStitch = heroMedia && heroMedia.querySelector('.hero-stitch');
  const nextFrame = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));
  if (hero) {
    // index de chaque mot du titre pour la cascade
    hero.querySelectorAll('.hero__title .w').forEach((w, i) => w.style.setProperty('--wi', i));
    // le texte entre tout de suite ; la photo (« rideau ») dès qu'elle est chargée
    nextFrame(() => hero.classList.add('is-ready'));
    const openCurtain = () => nextFrame(() => hero.classList.add('is-media-ready'));
    if (!heroImg || heroImg.complete) openCurtain();
    else { heroImg.addEventListener('load', openCurtain); heroImg.addEventListener('error', openCurtain); }
  }

  /* ----- Hero : parallaxe douce au scroll (--py) ------------------------ */
  if (heroImg && !reduce) {
    let visible = true, ticking = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(heroMedia);
    }
    const apply = () => {
      ticking = false;
      if (!visible) return;
      // parallaxe relative : l'image dérive tant qu'elle traverse le viewport
      const r = heroMedia.getBoundingClientRect();
      const offset = (r.top + r.height / 2) - window.innerHeight / 2;
      const py = Math.max(-40, Math.min(40, offset * -0.05));
      heroImg.style.setProperty('--py', py.toFixed(1) + 'px');
      // zoom léger à mesure que le hero quitte l'écran (1.12 → 1.24)
      const p = Math.max(0, Math.min(1, -r.top / r.height));
      heroImg.style.setProperty('--hs', (1.12 + 0.12 * p).toFixed(4));
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ----- Hero : profondeur au curseur (couches photo + fil, lerp) ------- */
  if (heroMedia && heroImg && !reduce && window.matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0, x = 0, y = 0, raf = null, hovering = false;
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      heroImg.style.setProperty('--px', (x * -12).toFixed(2) + 'px');
      heroImg.style.setProperty('--pyc', (y * -12).toFixed(2) + 'px');
      if (heroStitch) {
        heroStitch.style.setProperty('--pxf', (x * 5).toFixed(2) + 'px');
        heroStitch.style.setProperty('--pyf', (y * 5).toFixed(2) + 'px');
      }
      raf = (hovering || Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001)
        ? requestAnimationFrame(loop) : null;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    heroMedia.addEventListener('pointermove', (e) => {
      const r = heroMedia.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      hovering = true; kick();
    });
    heroMedia.addEventListener('pointerleave', () => { tx = 0; ty = 0; hovering = false; kick(); });
  }

  /* ----- Révélations au scroll + cascades ------------------------------- */
  document.querySelectorAll('[data-stagger]').forEach((c) => {
    Array.prototype.forEach.call(c.children, (ch, i) => ch.style.setProperty('--i', i));
  });
  const items = document.querySelectorAll('[data-reveal], [data-stagger]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  /* ----- Phrase-signature : mots révélés au fil du scroll ------------- */
  document.querySelectorAll('[data-scrub-words]').forEach((el) => {
    // découpe chaque nœud texte en mots (les <em>/<span> d'origine sont conservés)
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/([ \t\r\n]+)/).forEach((part) => {   // espaces insécables gardés dans le mot
            if (!part) return;
            if (/^[ \t\r\n]+$/.test(part)) { frag.append(part); return; }
            const s = document.createElement('span'); s.className = 'sw'; s.textContent = part; frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    const words = el.querySelectorAll('.sw');
    const sign = el.parentElement.querySelector('.manifesto__sign');
    if (reduce) return;   // mots affichés d'emblée (--w vaut 1 par défaut)
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      // 0 quand le haut de la phrase entre à 90 % de l'écran, 1 quand son bas atteint 45 %
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.45 + r.height)));
      const span = words.length + 4;   // chevauchement + temps pour la signature
      words.forEach((w, i) => {
        const t = Math.min(1, Math.max(0, p * span - i) / 3);
        w.style.setProperty('--w', (t * t * (3 - 2 * t)).toFixed(3));   // easing smoothstep
      });
      // la signature arrive après le dernier mot
      if (sign) {
        const t = Math.min(1, Math.max(0, (p * span - words.length) / 2));
        sign.style.setProperty('--w', (t * t * (3 - 2 * t)).toFixed(3));
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  });

  /* ----- Savoir-faire : vidéos des étapes ----------------------------- */
  // mobile : chaque vidéo inline ne joue que visible ; desktop : la scène collante
  // affiche la vidéo de l'étape au centre de l'écran (fondu enchaîné).
  const playIfVisible = (v, visible) => {
    if (reduce) return;
    if (visible) v.play().catch(() => {}); else v.pause();
  };
  const inlineVideos = document.querySelectorAll('[data-step-video]');
  if (inlineVideos.length && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      for (const en of entries) playIfVisible(en.target, en.isIntersecting && en.target.offsetParent !== null);
    }, { threshold: 0.35 });
    inlineVideos.forEach((v) => vio.observe(v));
  }

  const sfSteps = document.querySelectorAll('[data-sf-step]');
  const sfVideos = document.querySelectorAll('[data-sf-video]');
  const sfStage = document.querySelector('.sf__stage');
  if (sfSteps.length && sfVideos.length && 'IntersectionObserver' in window) {
    let active = -1, stageVisible = false;
    const setActive = (i) => {
      if (i === active) return;
      active = i;
      sfSteps.forEach((st, k) => st.classList.toggle('is-active', k === i));
      sfSteps[0].parentElement.classList.add('has-active');
      sfVideos.forEach((v, k) => {
        const on = k === i;
        v.classList.toggle('is-on', on);
        if (on) { v.preload = 'auto'; playIfVisible(v, stageVisible); } else v.pause();
      });
    };
    // l'étape qui traverse la bande centrale de l'écran devient active
    const sio = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) setActive(Number(en.target.dataset.sfStep));
    }, { rootMargin: '-45% 0px -45% 0px' });
    sfSteps.forEach((st) => sio.observe(st));
    // la scène ne lit que si elle est affichée (desktop) et à l'écran
    new IntersectionObserver((entries) => {
      stageVisible = entries[0].isIntersecting && sfStage.offsetParent !== null;
      if (active < 0) setActive(0);
      playIfVisible(sfVideos[active], stageVisible);
    }, { threshold: 0.2 }).observe(sfStage);
  }

  /* ----- En-tête + indice hero au scroll -------------------------------- */
  const header = document.querySelector('[data-header]');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    document.body.classList.toggle('scrolled', y > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Section zoom : l'image grandit jusqu'à remplir l'écran --------- */
  const zoom = document.querySelector('[data-zoom]');
  const zoomFrame = zoom && zoom.querySelector('.zoom__frame');
  if (zoomFrame) {
    if (reduce) {
      zoomFrame.style.setProperty('--z', '1');
    } else {
      const MIN = 0.42;
      let z_ticking = false;
      const zUpdate = () => {
        z_ticking = false;
        const total = zoom.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        const p = Math.min(Math.max(-zoom.getBoundingClientRect().top / total, 0), 1);
        zoomFrame.style.setProperty('--z', (MIN + (1 - MIN) * p).toFixed(4));
      };
      window.addEventListener('scroll', () => {
        if (!z_ticking) { z_ticking = true; requestAnimationFrame(zUpdate); }
      }, { passive: true });
      window.addEventListener('resize', zUpdate, { passive: true });
      zUpdate();
    }
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

  /* ----- Défilement fluide une fois la page chargée et la position restaurée */
  window.addEventListener('load', () => {
    setTimeout(() => document.documentElement.classList.add('smooth-scroll'), 300);
  });

  /* ----- Année courante ------------------------------------------------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
