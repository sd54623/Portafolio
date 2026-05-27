// PANEL NAVIGATION
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelector(`[data-panel="${name}"]`).classList.add('active');
}

// TOAST
function toast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.toggle('error', isError);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// -------- PROJECTS --------
let editingIndex = -1;
let currentTags  = [];

function showProjectForm(editIdx = -1) {
  editingIndex = editIdx;
  currentTags  = [];
  document.getElementById('project-form-wrap').style.display = 'block';
  if (editIdx >= 0) {
    const p = getProjects()[editIdx];
    document.getElementById('pf-title').value = p.title;
    document.getElementById('pf-desc').value  = p.desc;
    document.getElementById('pf-emoji').value = p.emoji || '💻';
    document.getElementById('pf-live').value  = p.live  || '';
    document.getElementById('pf-repo').value  = p.repo  || '';
    currentTags = [...(p.tags || [])];
    document.getElementById('project-form-title').textContent = 'Editar proyecto';
  } else {
    ['pf-title','pf-desc','pf-live','pf-repo'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('pf-emoji').value = '💻';
    document.getElementById('project-form-title').textContent = 'Nuevo proyecto';
  }
  renderTagPills();
  document.getElementById('project-form-wrap').scrollIntoView({ behavior: 'smooth' });
}

function hideProjectForm() {
  document.getElementById('project-form-wrap').style.display = 'none';
  editingIndex = -1;
  currentTags  = [];
}

function renderTagPills() {
  const wrap  = document.getElementById('tags-wrap');
  const input = document.getElementById('pf-tag-input');
  wrap.innerHTML = '';
  currentTags.forEach((t, i) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.innerHTML = `${t} <button onclick="removeTag(${i})">×</button>`;
    wrap.appendChild(pill);
  });
  wrap.appendChild(input);
  input.focus();
}

function removeTag(i) { currentTags.splice(i, 1); renderTagPills(); }

document.addEventListener('keydown', e => {
  const input = document.getElementById('pf-tag-input');
  if (document.activeElement === input && e.key === 'Enter' && input.value.trim()) {
    e.preventDefault();
    currentTags.push(input.value.trim());
    input.value = '';
    renderTagPills();
  }
});

// Emoji picker
document.getElementById('emoji-pick').innerHTML =
  ['💻','🌐','📱','🎮','🤖','🔐','📊','🛒','🎨','🗺️','🔬','📡']
  .map(e => `<span onclick="pickEmoji('${e}')">${e}</span>`).join('');

function pickEmoji(e) {
  document.getElementById('pf-emoji').value = e;
  document.querySelectorAll('.emoji-pick span').forEach(s =>
    s.classList.toggle('selected', s.textContent === e)
  );
}

function getProjects()    { return JSON.parse(localStorage.getItem('portfolio_projects') || '[]'); }
function saveProjects(p)  { localStorage.setItem('portfolio_projects', JSON.stringify(p)); }

function saveProject() {
  const title = document.getElementById('pf-title').value.trim();
  const desc  = document.getElementById('pf-desc').value.trim();
  if (!title) { toast('El título es obligatorio', true); return; }

  const p = {
    title, desc,
    emoji: document.getElementById('pf-emoji').value || '💻',
    live:  document.getElementById('pf-live').value.trim(),
    repo:  document.getElementById('pf-repo').value.trim(),
    tags:  [...currentTags],
    date:  new Date().toISOString().split('T')[0]
  };

  const projects = getProjects();
  if (editingIndex >= 0) { projects[editingIndex] = p; toast('Proyecto actualizado ✓'); }
  else                   { projects.unshift(p);        toast('Proyecto añadido ✓'); }
  saveProjects(projects);
  hideProjectForm();
  renderProjectList();
}

function deleteProject(i) {
  if (!confirm('¿Eliminar este proyecto?')) return;
  const projects = getProjects();
  projects.splice(i, 1);
  saveProjects(projects);
  renderProjectList();
  toast('Proyecto eliminado');
}

function renderProjectList() {
  const projects = getProjects();
  const list  = document.getElementById('project-list');
  const count = document.getElementById('project-count');
  count.textContent = projects.length + ' proyecto' + (projects.length !== 1 ? 's' : '');
  if (!projects.length) {
    list.innerHTML = `<div class="empty-state">
      <div class="big">🚀</div>
      <p>No hay proyectos aún.</p>
      <p style="font-size:0.8rem;margin-top:0.5rem">Pulsa "Añadir proyecto" para empezar.</p>
    </div>`;
    return;
  }
  list.innerHTML = projects.map((p, i) => `
    <div class="project-item">
      <div class="project-emoji">${p.emoji || '💻'}</div>
      <div class="project-info">
        <h3>${p.title}</h3>
        <p>${p.desc ? p.desc.substring(0,80) + (p.desc.length > 80 ? '…' : '') : 'Sin descripción'}</p>
        <div class="project-item-tags">
          ${(p.tags || []).map(t => `<span class="ptag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-icon"     onclick="showProjectForm(${i})" title="Editar">✏️</button>
        <button class="btn-icon del" onclick="deleteProject(${i})"   title="Eliminar">🗑️</button>
      </div>
    </div>
  `).join('');
}

// -------- SKILLS --------
const defaultSkills = [
  { icon: '🌐', name: 'HTML / CSS',    desc: 'Estructura y estilos modernos', level: 90 },
  { icon: '⚡', name: 'JavaScript',    desc: 'ES6+, DOM, async/await',        level: 80 },
  { icon: '⚛️', name: 'React',          desc: 'Hooks, Context, SPA',           level: 70 },
  { icon: '🗄️', name: 'Node.js',        desc: 'APIs REST, Express',            level: 65 },
  { icon: '🛢️', name: 'Bases de datos', desc: 'MySQL, MongoDB',                level: 60 },
  { icon: '🔧', name: 'Git & DevOps',  desc: 'GitHub, CI/CD básico',          level: 75 },
];

function getSkills()   { return JSON.parse(localStorage.getItem('portfolio_skills') || JSON.stringify(defaultSkills)); }
function saveSkills(s) { localStorage.setItem('portfolio_skills', JSON.stringify(s)); }

function addSkill() {
  const name = document.getElementById('sk-name').value.trim();
  if (!name) { toast('El nombre es obligatorio', true); return; }
  const skills = getSkills();
  skills.push({
    icon:  document.getElementById('sk-icon').value  || '⚙️',
    name,
    desc:  document.getElementById('sk-desc').value.trim(),
    level: parseInt(document.getElementById('sk-level').value)
  });
  saveSkills(skills);
  ['sk-name','sk-desc','sk-icon'].forEach(id => document.getElementById(id).value = '');
  renderSkillAdmin();
  toast('Skill añadida ✓');
}

function deleteSkill(i) {
  const skills = getSkills();
  skills.splice(i, 1);
  saveSkills(skills);
  renderSkillAdmin();
  toast('Skill eliminada');
}

function updateSkillLevel(i, val) {
  const skills = getSkills();
  skills[i].level = parseInt(val);
  saveSkills(skills);
}

function renderSkillAdmin() {
  const skills = getSkills();
  const grid   = document.getElementById('skill-admin-grid');
  if (!skills.length) { grid.innerHTML = '<p style="color:var(--gray)">No hay skills. Añade la primera arriba.</p>'; return; }
  grid.innerHTML = skills.map((s, i) => `
    <div class="skill-item">
      <div class="skill-item-header">
        <div class="skill-item-name">${s.icon} ${s.name}</div>
        <button class="btn-icon del" onclick="deleteSkill(${i})" title="Eliminar">🗑️</button>
      </div>
      <p style="color:var(--gray);font-size:0.8rem;margin-bottom:0.5rem">${s.desc}</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:0.3rem">
        <span style="font-size:0.75rem;color:var(--gray)">Nivel</span>
        <span class="skill-level-display" id="sl-val-${i}">${s.level}%</span>
      </div>
      <input type="range" class="skill-bar-edit" min="10" max="100" value="${s.level}"
        oninput="document.getElementById('sl-val-${i}').textContent=this.value+'%'; updateSkillLevel(${i},this.value)"/>
    </div>
  `).join('');
}

// -------- CONFIG --------
function loadConfig() {
  const cfg = JSON.parse(localStorage.getItem('portfolio_config') || '{}');
  const fields = { 'cfg-name': 'name', 'cfg-subtitle': 'subtitle', 'cfg-about1': 'about1',
                   'cfg-about2': 'about2', 'cfg-stat-projects': 'stat_projects',
                   'cfg-stat-exp': 'stat_exp', 'cfg-stat-skills': 'stat_skills' };
  Object.entries(fields).forEach(([id, key]) => {
    if (cfg[key]) document.getElementById(id).value = cfg[key];
  });
}

function saveConfig() {
  const cfg = {
    name:          document.getElementById('cfg-name').value.trim(),
    subtitle:      document.getElementById('cfg-subtitle').value.trim(),
    about1:        document.getElementById('cfg-about1').value.trim(),
    about2:        document.getElementById('cfg-about2').value.trim(),
    stat_projects: document.getElementById('cfg-stat-projects').value,
    stat_exp:      document.getElementById('cfg-stat-exp').value,
    stat_skills:   document.getElementById('cfg-stat-skills').value,
  };
  localStorage.setItem('portfolio_config', JSON.stringify(cfg));
  toast('Configuración guardada ✓');
}

// -------- SOCIALS --------
const defaultSocials = [
  { name: 'GitHub',   url: '#',                        icon: 'github'   },
  { name: 'LinkedIn', url: '#',                        icon: 'linkedin' },
  { name: 'Email',    url: 'mailto:tuemail@email.com', icon: 'mail'     },
];

function getSocials()   { return JSON.parse(localStorage.getItem('portfolio_socials') || JSON.stringify(defaultSocials)); }
function saveSocials(s) { localStorage.setItem('portfolio_socials', JSON.stringify(s)); }

function addSocial() {
  const name = document.getElementById('soc-name').value.trim();
  const url  = document.getElementById('soc-url').value.trim();
  if (!name || !url) { toast('Nombre y URL son obligatorios', true); return; }
  const s = getSocials();
  s.push({ name, url, icon: document.getElementById('soc-icon').value });
  saveSocials(s);
  ['soc-name','soc-url'].forEach(id => document.getElementById(id).value = '');
  renderSocialsAdmin();
  toast('Red añadida ✓');
}

function deleteSocial(i) {
  const s = getSocials();
  s.splice(i, 1);
  saveSocials(s);
  renderSocialsAdmin();
  toast('Red eliminada');
}

function renderSocialsAdmin() {
  const socials = getSocials();
  const list    = document.getElementById('socials-list');
  if (!socials.length) { list.innerHTML = '<div class="empty-state"><p>No hay redes sociales.</p></div>'; return; }
  list.innerHTML = socials.map((s, i) => `
    <div class="project-item">
      <div class="project-emoji" style="font-size:1.5rem">🔗</div>
      <div class="project-info">
        <h3>${s.name}</h3>
        <p style="color:var(--gray);font-size:0.82rem">${s.url}</p>
      </div>
      <div class="item-actions">
        <button class="btn-icon del" onclick="deleteSocial(${i})">🗑️</button>
      </div>
    </div>
  `).join('');
}

// INIT
renderProjectList();
renderSkillAdmin();
loadConfig();
renderSocialsAdmin();
