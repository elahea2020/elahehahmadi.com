// ─── Multi-page renderer ─────────────────────────────────────────────────────
// Each page sets <body data-page="..."> and only contains the section
// containers it needs. Render functions are no-ops when their target
// element is absent.

async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

async function init() {
  const page = document.body.dataset.page || 'home';

  // Always-loaded: profile (powers nav meta + footer on every page)
  const profile = await loadJSON('data/profile.json');
  renderHero(profile);
  renderAbout(profile);
  renderFooter(profile);
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  // Page-specific data
  if (page === 'home') {
    const [projects, education] = await Promise.all([
      loadJSON('data/projects.json'),
      loadJSON('data/education.json'),
    ]);
    renderVenturesGrid(projects.ventures);
    renderEducation(education);
  }
  if (page === 'projects') {
    const projects = await loadJSON('data/projects.json');
    renderVenturesGrid(projects.ventures);
    renderResearch(projects.research);
  }
  if (page === 'arts') {
    const photos = await loadJSON('data/photos.json');
    renderPhotos(photos);
  }
  if (page === 'blogs') {
    const articles = await loadJSON('data/articles.json');
    renderArticles(articles);
  }
}

// ─── HERO + ABOUT ────────────────────────────────────────────────────────────

function renderHero(p) {
  const heroRoles = document.getElementById('heroRoles');
  if (heroRoles) heroRoles.textContent = p.roles.join(' · ');
}

function renderAbout(p) {
  const aboutRoles = document.getElementById('aboutRoles');
  if (!aboutRoles) return;

  aboutRoles.innerHTML = p.roles.join('<br>');
  document.getElementById('aboutLinks').innerHTML = p.links.map(l =>
    `<a href="${l.url}" target="_blank" rel="noopener">${l.label} →</a>`
  ).join('');
  document.getElementById('aboutBio').innerHTML = p.bio.map(b => `<p>${b}</p>`).join('');

  document.getElementById('awardsGrid').innerHTML = p.awards.map(a => `
    <div class="award-item">
      <p class="award-title">${a.title}</p>
      <p class="award-year">${a.year}</p>
    </div>
  `).join('');

  document.getElementById('pubsList').innerHTML = p.publications.map(pub => `
    <div class="pub-item">
      <span class="pub-venue">${pub.venue}</span>
      <div class="pub-title">
        <a href="${pub.url}" target="_blank" rel="noopener">${pub.title}</a>
      </div>
    </div>
  `).join('');

  const talksEl = document.getElementById('talksList');
  if (talksEl && p.talks) {
    talksEl.innerHTML = p.talks.map(t => `
      <div class="pub-item">
        <span class="pub-venue">${t.venue}</span>
        <div class="pub-title">
          <a href="${t.url}" target="_blank" rel="noopener">${t.title}</a>
        </div>
      </div>
    `).join('');
  }
}

// ─── VENTURES ────────────────────────────────────────────────────────────────

function renderVenturesGrid(ventures) {
  const el = document.getElementById('venturesGrid');
  if (!el) return;
  el.innerHTML = ventures.map(v => `
    <article class="venture-card">
      <p class="venture-role">${v.role}</p>
      <h3 class="venture-name">${v.name}</h3>
      <p class="venture-year">${v.year}</p>
      <p class="venture-tag">${v.tagline}</p>
      <a class="venture-link" href="${v.url}" target="_blank" rel="noopener">Visit ${v.name} →</a>
    </article>
  `).join('');
}

// ─── RESEARCH PROJECTS ───────────────────────────────────────────────────────

function renderResearch(research) {
  const el = document.getElementById('researchList');
  if (!el) return;
  el.innerHTML = research.map(r => `
    <article class="project-row">
      <div class="year">${r.year}</div>
      <div class="body">
        <h3>${r.title}</h3>
        ${r.venue ? `<span class="venue">${r.venue}</span>` : ''}
        <p>${r.summary}</p>
      </div>
      <div class="link">
        ${r.url && r.url !== '#'
          ? `<a href="${r.url}" target="_blank" rel="noopener">Read →</a>`
          : `<span style="font-size:0.74rem;letter-spacing:0.14em;color:var(--text-faint);text-transform:uppercase;">Coming soon</span>`
        }
      </div>
    </article>
  `).join('');
}

// ─── PHOTOS ──────────────────────────────────────────────────────────────────

let allPhotos = [];

function renderPhotos(data) {
  if (!document.getElementById('photoGrid')) return;
  allPhotos = data.photos;

  const filtersEl = document.getElementById('photoFilters');
  filtersEl.innerHTML = `<button class="filter-btn active" onclick="filterPhotos('all', this)">All</button>`;
  data.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = cap(cat);
    btn.onclick = function() { filterPhotos(cat, this); };
    filtersEl.appendChild(btn);
  });

  renderPhotoGrid(allPhotos);
}

function renderPhotoGrid(photos) {
  const grid = document.getElementById('photoGrid');
  if (!grid) return;
  if (photos.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-dim);font-style:italic;padding:2rem 0">No photos in this category yet.</p>`;
    return;
  }
  grid.innerHTML = photos.map((p, i) => {
    const hasImg = p.url && !p.url.includes('placeholder');
    return `
      <div class="photo-item" data-cat="${p.category}" onclick="openLightbox(${i})">
        ${hasImg
          ? `<img src="${p.url}" alt="${p.caption}" loading="lazy">`
          : `<div class="photo-placeholder" style="height:${randomHeight()}px">${cap(p.category)}</div>`
        }
        <div class="photo-caption"><span>${p.caption}</span></div>
      </div>
    `;
  }).join('');
}

function filterPhotos(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'all' ? allPhotos : allPhotos.filter(p => p.category === cat);
  renderPhotoGrid(filtered);
}

function randomHeight() {
  const heights = [200, 240, 280, 300, 320, 260];
  return heights[Math.floor(Math.random() * heights.length)];
}

function openLightbox(index) {
  const p = allPhotos[index];
  const hasImg = p.url && !p.url.includes('placeholder');
  if (!hasImg) return;
  document.getElementById('lightboxImg').src = p.url;
  document.getElementById('lightboxCaption').textContent = p.caption;
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ─── ARTICLES ────────────────────────────────────────────────────────────────

function renderArticles(data) {
  const el = document.getElementById('seriesList');
  if (!el) return;
  el.innerHTML = data.series.map(s => `
    <div class="series-item">
      <div class="series-meta">
        <div class="series-number">${s.number}</div>
        <p class="series-tag">${s.tag}</p>
      </div>
      <div class="series-content">
        <h3 class="series-title">${s.title}</h3>
        <p class="series-desc">${s.description}</p>
        <div class="series-articles">
          ${s.articles.map(a =>
            `<a class="article-link" href="${a.url}" target="${a.url !== '#' ? '_blank' : '_self'}" rel="noopener">${a.title}</a>`
          ).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ─── EDUCATION ───────────────────────────────────────────────────────────────

function renderEducation(data) {
  const el = document.getElementById('eduGrid');
  if (!el) return;
  el.innerHTML = data.resources.map(r => `
    <div class="edu-card">
      <a href="${r.url}" target="${r.url !== '#' ? '_blank' : '_self'}" rel="noopener">
        <div class="edu-icon">${r.roman}</div>
        <h3 class="edu-card-title">${r.title}</h3>
        <p class="edu-card-desc">${r.description}</p>
      </a>
    </div>
  `).join('');
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function renderFooter(p) {
  const contactEl = document.getElementById('footerContact');
  if (contactEl) {
    contactEl.innerHTML = p.links.map(l =>
      `<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`
    ).join('');
  }
  const linksEl = document.getElementById('footerLinks');
  if (linksEl) {
    linksEl.innerHTML = p.links.map(l =>
      `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`
    ).join('');
  }
}

// ─── UTILS ───────────────────────────────────────────────────────────────────

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toggleMobileNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}

init();
