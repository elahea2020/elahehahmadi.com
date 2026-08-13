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
    renderContactLinks(profile);
    setupContactForm(profile);
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

// ─── PHOTOGRAPHY (Polaroid pile → group → lightbox) ──────────────────────────
let allPhotos = [];
let currentSet = [];

function renderPhotos(data) {
  const wall = document.getElementById('pileWall');
  if (!wall) return;
  allPhotos = data.photos;

  // Categories that actually have photos, ordered by count (busiest pile first).
  const cats = data.categories
    .filter(c => allPhotos.some(p => p.category === c))
    .sort((a, b) =>
      allPhotos.filter(p => p.category === b).length -
      allPhotos.filter(p => p.category === a).length);

  wall.innerHTML = cats.map((catName, gi) => {
    const set = allPhotos.filter(p => p.category === catName);
    const picks = set.slice(0, Math.min(4, set.length));
    const prints = picks.map((p, i) => {
      const s = gi * 10 + i;
      const r = (pileRand(s) * 18 - 9).toFixed(1);
      const x = (pileRand(s + 2) * 70 - 35).toFixed(0);
      const y = (pileRand(s + 3) * 34 - 17).toFixed(0);
      // hover spread: fan outward along a half-circle
      const ang = (i / Math.max(picks.length - 1, 1)) * Math.PI - Math.PI / 2;
      const sx = (Math.cos(ang) * 96).toFixed(0);
      const sy = (Math.sin(ang) * 38 - 4).toFixed(0);
      // clamp thumbnail ratio so panoramas / tall crops don't become slivers
      const ar = Math.max(0.62, Math.min((p.width / p.height) || 1.4, 1.9));
      const w = 150, h = Math.round(w / ar);
      return `<div class="polaroid" style="--r:${r}deg;--sr:${(r * 1.4).toFixed(1)}deg;--sx:${sx}px;--sy:${sy}px;left:calc(50% + ${x}px);top:calc(46% + ${y}px);width:${w}px;z-index:${i + 1}">
          <img src="${p.url}" alt="${p.caption}" style="height:${h}px" loading="lazy"><span class="pcap">${p.caption}</span></div>`;
    }).join('');
    return `<div class="pile" onclick="openGroup('${catName.replace(/'/g, "\\'")}')">
        <div class="pile-stage">${prints}</div>
        <div class="pile-label"><span class="name">${cap(catName)}</span><span class="count">${set.length} photos · explore →</span></div>
      </div>`;
  }).join('');
}

// Deterministic pseudo-random (stable pile layout across reloads).
function pileRand(seed) {
  const x = Math.sin(seed * 99.13) * 10000;
  return x - Math.floor(x);
}

function openGroup(catName) {
  const set = allPhotos.filter(p => p.category === catName);
  currentSet = set;
  document.getElementById('photoGrid').innerHTML = set.map((p, i) => `
      <div class="photo-item" onclick="openLightbox(${i})">
        <img src="${p.url}" alt="${p.caption}" loading="lazy">
        <div class="photo-caption"><span>${p.caption}</span></div>
      </div>`).join('');
  document.getElementById('groupTitle').childNodes[0].nodeValue = cap(catName);
  document.getElementById('groupSub').textContent = `${set.length} photograph${set.length === 1 ? '' : 's'}`;
  document.getElementById('pileWall').hidden = true;
  document.getElementById('groupDetail').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeGroup() {
  document.getElementById('groupDetail').hidden = true;
  document.getElementById('pileWall').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openLightbox(index) {
  const p = currentSet[index];
  if (!p) return;
  document.getElementById('lightboxImg').src = p.url;
  document.getElementById('lightboxCaption').textContent = p.caption;
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const lb = document.getElementById('lightbox');
  if (lb && lb.classList.contains('open')) { closeLightbox(); return; }
  const gd = document.getElementById('groupDetail');
  if (gd && !gd.hidden) closeGroup();
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

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function renderContactLinks(p) {
  const el = document.getElementById('contactLinks');
  if (!el) return;
  el.innerHTML = p.links.map(l => `
    <div class="contact-link-row">
      <span class="contact-link-label">${l.label}</span>
      <a class="contact-link" href="${l.url}" target="_blank" rel="noopener">${l.url.replace(/^https?:\/\//, '')}</a>
    </div>
  `).join('');
}

function setupContactForm(p) {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.contact-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const accessKey = p.contact?.web3forms_key;
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      form.innerHTML = `<p class="form-success">Thanks — your message would have been sent. Set <code>contact.web3forms_key</code> in <code>data/profile.json</code> to enable real email delivery.</p>`;
      return;
    }

    const data = new FormData(form);
    data.append('access_key', accessKey);
    data.append('subject', `New message from ${data.get('name') || 'website'}`);
    data.append('from_name', 'elahehahmadi.com contact form');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        form.innerHTML = `<p class="form-success">Message sent — Elaheh will be in touch soon.</p>`;
      } else {
        btn.textContent = 'Try again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Try again';
      btn.disabled = false;
    }
  });
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
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function toggleMobileNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}

init();
