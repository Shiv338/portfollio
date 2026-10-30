

(function () {
  'use strict';

  /* ---------- Data (in a real app these can be loaded from the API) ---------- */
  const SKILLS = [
    { name: 'HTML', level: 92, color: 'linear-gradient(135deg, #f97316, #f59e0b)', desc: 'Semantic markup, accessibility & modern HTML5 features.' },
    { name: 'CSS', level: 88, color: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', desc: 'Flexbox, Grid, animations, responsive & modern layouts.' },
    { name: 'JavaScript', level: 85, color: 'linear-gradient(135deg, #eab308, #f59e0b)', desc: 'ES6+, DOM, async patterns & modern frameworks.' },
    { name: 'Python', level: 90, color: 'linear-gradient(135deg, #10b981, #14b8a6)', desc: 'Scripting, data processing, automation & web back-ends.' },
    { name: 'Java', level: 80, color: 'linear-gradient(135deg, #ef4444, #f43f5e)', desc: 'OOP, Spring basics, data structures & algorithms.' },
  ];

  const PROJECTS = [
    { title: 'Personal Portfolio', desc: 'A responsive personal portfolio built with vanilla HTML, CSS, and JavaScript on the front, and a Python Flask + MongoDB back-end for the contact form.', tags: ['HTML', 'CSS', 'JS', 'Python', 'MongoDB'] },
    { title: 'Weather Dashboard', desc: 'A weather dashboard that consumes a public REST API to display current conditions and 5-day forecasts with animated charts and city search.', tags: ['JavaScript', 'REST API', 'Chart.js'] },
    { title: 'Task Manager CLI', desc: 'A command-line task manager written in Python with persistent JSON storage, priority levels, due dates and colored terminal output.', tags: ['Python', 'CLI', 'JSON'] },
    { title: 'Student Records System', desc: 'A Java console application that manages student records using OOP principles, file I/O and basic CRUD operations with a clean menu interface.', tags: ['Java', 'OOP', 'File I/O'] },
  ];

  const CERTS = [
    { title: 'Responsive Web Design Certification', issuer: 'freeCodeCamp', year: '2024', desc: 'Built responsive, accessible web pages using HTML, CSS, Flexbox, Grid, and CSS variables through 5 projects.' },
    { title: 'JavaScript Algorithms & Data Structures', issuer: 'freeCodeCamp', year: '2024', desc: 'Mastered JS fundamentals, ES6, regular expressions, and algorithmic problem solving through 10 certification projects.' },
    { title: 'Python for Everybody Specialization', issuer: 'Coursera / University of Michigan', year: '2023', desc: 'Completed courses covering Python basics, data structures, web scraping, databases, and using Python to access web data.' },
    { title: 'Java Programming Fundamentals', issuer: 'HackerRank', year: '2023', desc: 'Solved 50+ algorithmic challenges in Java covering OOP, collections, exception handling, and I/O streams.' },
  ];

  /* ---------- Tiny DOM helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const h = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else el.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  };

  /* ---------- Render skill cards ---------- */
  function renderSkills() {
    const grid = $('#skillsGrid');
    if (!grid) return;
    SKILLS.forEach((s) => {
      const card = h('article', { class: 'skill-card', dataset: { name: s.name } }, [
        h('div', { class: 'skill-card__head' }, [
          h('h3', { class: 'skill-card__title' }, s.name),
          h('span', { class: 'skill-card__badge', style: `background:${s.color}` }, `${s.level}%`),
        ]),
        h('p', { class: 'skill-card__desc' }, s.desc),
        h('div', { class: 'skill-card__bar' }, h('div', { class: 'skill-card__fill', style: `background:${s.color}` })),
      ]);
      grid.appendChild(card);
    });

    // Animate bars when they enter the viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fill = entry.target.querySelector('.skill-card__fill');
        const skill = SKILLS.find((s) => s.name === entry.target.dataset.name);
        if (fill && skill) fill.style.width = skill.level + '%';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    $$('.skill-card').forEach((c) => observer.observe(c));
  }

  /* ---------- Render project cards ---------- */
  function renderProjects() {
    const grid = $('#projectsGrid');
    if (!grid) return;
    PROJECTS.forEach((p) => {
      const card = h('article', { class: 'project-card' }, [
        h('div', { class: 'project-card__head' }, [
          h('span', { class: 'project-card__icon', 'aria-hidden': 'true' }, '📁'),
          h('a', { href: '#', 'aria-label': `Open ${p.title}`, class: 'social' }, 'GH'),
        ]),
        h('h3', { class: 'project-card__title' }, p.title),
        h('p', { class: 'project-card__desc' }, p.desc),
        h('div', { class: 'project-card__tags' }, p.tags.map((t) => h('span', { class: 'tag' }, t))),
      ]);
      grid.appendChild(card);
    });
  }

  /* ---------- Render certification cards ---------- */
  function renderCerts() {
    const grid = $('#certsGrid');
    if (!grid) return;
    CERTS.forEach((c) => {
      const card = h('article', { class: 'cert-card' }, [
        h('div', { class: 'cert-card__head' }, [
          h('span', { class: 'cert-card__icon', 'aria-hidden': 'true' }, '🏆'),
          h('div', {}, [
            h('h3', { class: 'cert-card__title' }, c.title),
            h('p', { class: 'cert-card__meta' }, `${c.issuer} · ${c.year}`),
          ]),
        ]),
        h('p', { class: 'cert-card__desc' }, c.desc),
      ]);
      grid.appendChild(card);
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const toggle = $('#menuToggle');
    const menu = $('#mobileMenu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      if (menu.hidden) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    $$('.mobile-menu__link', menu).forEach((a) => a.addEventListener('click', closeMenu));

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.hidden === false) closeMenu();
    });

    // Close when resizing up to desktop
    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
      if (e.matches) closeMenu();
    });
  }

  /* ---------- One-section-at-a-time page navigation ---------- */
  function initSectionNavigation() {
    const sections = $$('.main-section');
    const links = $$('.nav__link, .mobile-menu__link');
    if (!sections.length) return;

    const showSection = (sectionId) => {
      const activeSection = sections.find((section) => section.id === sectionId) || sections[0];

      sections.forEach((section) => {
        const isActive = section === activeSection;
        section.hidden = !isActive;
        section.classList.toggle('is-active', isActive);
      });

      links.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeSection.id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });

      window.scrollTo(0, 0);
    };

    const navigateToHash = () => showSection(window.location.hash.slice(1));

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const sectionId = link.getAttribute('href').slice(1);
      if (!sections.some((section) => section.id === sectionId)) return;

      event.preventDefault();
      if (window.location.hash === `#${sectionId}`) showSection(sectionId);
      else window.location.hash = sectionId;
    });

    window.addEventListener('hashchange', navigateToHash);
    showSection(window.location.hash.slice(1));
  }

  /* ---------- Contact form (POST to Python/Flask back-end) ---------- */
  function initContactForm() {
    const form = $('#contactForm');
    const status = $('#formStatus');
    if (!form || !status) return;

    // API base — uses same origin by default. Override with window.API_BASE
    // (e.g. for local dev: window.API_BASE = 'http://localhost:5000')
    const API_BASE = window.API_BASE || '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      // Browser-native validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      status.textContent = 'Sending…';

      try {
        const res = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const payload = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(payload.error || `Server responded ${res.status}`);
        }

        status.classList.add('is-success');
        status.textContent = payload.message || 'Thanks for your message! I will get back to you soon.';
        form.reset();
      } catch (err) {
        status.classList.add('is-error');
        status.textContent = `Could not send: ${err.message}. Make sure the Python back-end is running.`;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderSkills();
    renderProjects();
    renderCerts();
    initMobileMenu();
    initSectionNavigation();
    initContactForm();
    setYear();
  });
})();
