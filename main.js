// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  ring.style.left   = e.clientX + 'px';
  ring.style.top    = e.clientY + 'px';
});
document.querySelectorAll('a, button, .skill-card, .project-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// NAV SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// YEAR
document.getElementById('year').textContent = new Date().getFullYear();

// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// COUNT-UP ANIMATION
function countUp(el, target, suffix = '') {
  let start = null;
  const dur = 1400;
  const step = timestamp => {
    if (!start) start = timestamp;
    const prog = Math.min((timestamp - start) / dur, 1);
    el.textContent = Math.floor(prog * target) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const cfg = JSON.parse(localStorage.getItem('portfolio_config') || '{}');
      countUp(document.getElementById('stat-projects'), cfg.stat_projects || 0, '+');
      countUp(document.getElementById('stat-exp'),      cfg.stat_exp      || 1, '+');
      countUp(document.getElementById('stat-skills'),   cfg.stat_skills   || 8, '+');
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
statsObserver.observe(document.getElementById('about'));

// SKILL BARS ON SCROLL
const skillsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.skill-bar').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
    skillsObserver.disconnect();
  }
}, { threshold: 0.2 });
skillsObserver.observe(document.getElementById('skills'));

// SVG ICONS
const svgIcons = {
  github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>`,
};

// DEFAULT DATA
const defaultSkills = [
  { icon: '🌐', name: 'HTML / CSS',      desc: 'Estructura y estilos modernos', level: 90 },
  { icon: '⚡', name: 'JavaScript',       desc: 'ES6+, DOM, async/await',        level: 80 },
  { icon: '⚛️', name: 'React',            desc: 'Hooks, Context, SPA',           level: 70 },
  { icon: '🗄️', name: 'Node.js',          desc: 'APIs REST, Express',            level: 65 },
  { icon: '🛢️', name: 'Bases de datos',   desc: 'MySQL, MongoDB',                level: 60 },
  { icon: '🔧', name: 'Git & DevOps',     desc: 'GitHub, CI/CD básico',          level: 75 },
];
const defaultSocials = [
  { name: 'GitHub',   url: '#',                       icon: 'github'   },
  { name: 'LinkedIn', url: '#',                       icon: 'linkedin' },
  { name: 'Email',    url: 'mailto:tuemail@email.com', icon: 'mail'    },
];

// RENDER SKILLS
function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = skills.map((s, i) => `
    <div class="skill-card reveal reveal-delay-${(i % 4) + 1}">
      <div class="skill-icon">${s.icon}</div>
      <div class="skill-name">${s.name}</div>
      <div class="skill-desc">${s.desc}</div>
      <div class="skill-bar-wrap">
        <div class="skill-bar" data-width="${s.level}%"></div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// RENDER PROJECTS
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!projects.length) {
    grid.innerHTML = `<div class="empty-projects reveal">
      <div style="font-size:3rem">🚀</div>
      <p>Los proyectos aparecerán aquí.</p>
      <p>Usa el panel de administración para añadir el primero.</p>
    </div>`;
    return;
  }
  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card reveal reveal-delay-${(i % 3) + 1}">
      <div class="project-thumb">
        <span>${p.emoji || '💻'}</span>
        <div class="overlay"></div>
      </div>
      <div class="project-body">
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-links">
          ${p.live ? `<a href="${p.live}" class="project-link" target="_blank">${svgIcons.github} Live demo</a>` : ''}
          ${p.repo ? `<a href="${p.repo}" class="project-link" target="_blank">${svgIcons.github} Código</a>`    : ''}
        </div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// RENDER SOCIALS
function renderSocials(socials) {
  const wrap = document.getElementById('socials-wrap');
  wrap.innerHTML = socials.map(s => `
    <a href="${s.url}" class="social-link" target="_blank">
      ${svgIcons[s.icon] || svgIcons.mail}
      ${s.name}
    </a>
  `).join('');
}

// CONTACT FORM
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '¡Enviado! ✓';
  btn.style.background = '#3B6D11';
  setTimeout(() => {
    btn.textContent = 'Enviar mensaje';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

// LOAD ALL DATA
function loadPortfolio() {
  const cfg      = JSON.parse(localStorage.getItem('portfolio_config')   || '{}');
  const projects = JSON.parse(localStorage.getItem('portfolio_projects') || '[]');
  const skills   = JSON.parse(localStorage.getItem('portfolio_skills')   || JSON.stringify(defaultSkills));
  const socials  = JSON.parse(localStorage.getItem('portfolio_socials')  || JSON.stringify(defaultSocials));

  if (cfg.name) {
    document.getElementById('hero-name').textContent   = cfg.name;
    document.getElementById('footer-name').textContent = cfg.name.split(' ')[0].toLowerCase() + '.';
    document.title = 'Portfolio — ' + cfg.name;
  }
  if (cfg.subtitle) document.querySelector('.hero-subtitle').textContent = cfg.subtitle;
  if (cfg.about1)   document.querySelectorAll('.about-text p')[0].innerHTML  = cfg.about1;
  if (cfg.about2)   document.querySelectorAll('.about-text p')[1].textContent = cfg.about2;

  renderSkills(skills);
  renderProjects(projects);
  renderSocials(socials);
}

loadPortfolio();
