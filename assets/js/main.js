// ─── Load all data and render the site ───────────────────────────────────────

async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

async function init() {
  const [profile, photos, articles, education] = await Promise.all([
    loadJSON('data/profile.json'),
    loadJSON('data/photos.json'),
    loadJSON('data/articles.json'),
    loadJSON('data/education.json'),
  ]);

  renderProfile(profile);
  renderPhotos(photos);
  renderArticles(articles);
  renderEducation(education);
  renderContact(profile);
  renderFooter(profile);

  document.getElementById('footerYear').textContent = new Date().getFullYear();
  setupContactForm(profile);
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

function renderProfile(p) {
  // Hero roles
  document.getElementById('heroRoles').textContent = p.roles.join(' · ');

  // Sidebar
  document.getElementById('aboutRoles').innerHTML = p.roles.join('<br>');
  const linksEl = document.getElementById('aboutLinks');
  linksEl.innerHTML = p.links.map(l =>
    `<a href="${l.url}" target="_blank">${l.label} →</a>`
  ).join('');

  // Bio
  document.getElementById('aboutBio').innerHTML = p.bio.map(b => `<p>${b}</p>`).join('');

  // Awards
  document.getElementById('awardsGrid').innerHTML = p.awards.map(a => `
    <div class="award-item">
      <p class="award-title">${a.title}</p>
      <p class="award-year">${a.year}</p>
    </div>
  `).join('');

  // Publications
  document.getElementById('pubsList').innerHTML = p.publications.map(pub => `
    <div class="pub-item">
      <span class="pub-venue">${pub.venue}</span>
      <div class="pub-title">
        <a href="${pub.url}" target="_blank">${pub.title}</a>
      </div>
    </div>
  `).join('');
}

// ─── PHOTOS ──────────────────────────────────────────────────────────────────

let allPhotos = [];

function renderPhotos(data) {
  allPhotos = data.photos;

  // Build filter buttons from categories
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
  if (photos.length === 0) {
    grid.innerHTML = `<p style="color:var(--clay);font-style:italic;padding:2rem 0">No photos in this category yet.</p>`;
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
  document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ─── ARTICLES ─────────────────────────────────────────────────────────────────

function renderArticles(data) {
  document.getElementById('seriesList').innerHTML = data.series.map(s => `
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
            `<a class="article-link" href="${a.url}" target="${a.url !== '#' ? '_blank' : '_self'}">${a.title}</a>`
          ).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ─── EDUCATION ───────────────────────────────────────────────────────────────

function renderEducation(data) {
  document.getElementById('eduGrid').innerHTML = data.resources.map(r => `
    <div class="edu-card">
      <a href="${r.url}" target="${r.url !== '#' ? '_blank' : '_self'}">
        <div class="edu-icon">${r.roman}</div>
        <h3 class="edu-card-title">${r.title}</h3>
        <p class="edu-card-desc">${r.description}</p>
      </a>
    </div>
  `).join('');
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function renderContact(p) {
  document.getElementById('contactLinks').innerHTML = p.links.map(l => `
    <div class="contact-link-row">
      <span class="contact-link-label">${l.label}</span>
      <a class="contact-link" href="${l.url}" target="_blank">${l.url.replace('http://', '').replace('https://', '')}</a>
    </div>
  `).join('');
}

function setupContactForm(p) {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.contact-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const formspreeId = p.contact?.formspree_id;
    if (!formspreeId || formspreeId === 'YOUR_FORMSPREE_ID') {
      form.innerHTML = `<p class="form-success">Thanks! (Set up Formspree in data/profile.json to enable real email delivery.)</p>`;
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
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
  document.getElementById('footerLinks').innerHTML = p.links.map(l =>
    `<a href="${l.url}" target="_blank">${l.label}</a>`
  ).join('');
}

// ─── UTILS ───────────────────────────────────────────────────────────────────

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toggleMobileNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}

// ─── BOOT ────────────────────────────────────────────────────────────────────

init();
