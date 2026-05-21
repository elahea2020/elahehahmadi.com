# Elaheh Ahmadi — Project Memory

This file is for Claude Code. Read this at the start of every session before doing anything.

---

## Who This Is For

**Elaheh Ahmadi** — entrepreneur, AI researcher, photographer.
- Co-founder & Chief AI Officer, VIVA AI (getviva.ai)
- Co-founder, Themis AI (themisai.io)
- MEng EECS, MIT
- Forbes 30 Under 30 (2023)

---

## The Website

**Live site:** https://elahehahmadi.com
**GitHub repo:** https://github.com/elahea2020/elahehahmadi.com
**GitHub username:** elahea2020
**Hosting:** GitHub Pages (free, public repo), auto-deploys on every push to `main`
**Domain:** elahehahmadi.com (registered at GoDaddy, DNS pointed to GitHub Pages)

### How the site works
- **Multi-page** static site: `index.html` (landing), `arts.html`, `blogs.html`, `projects.html`
- All pages load content dynamically from JSON files in `data/`
- `assets/js/main.js` reads `<body data-page="...">` and only fetches the JSON each page needs
- **Never edit HTML or CSS for content changes** — all content lives in `data/*.json`
- Push to `main` → GitHub Actions deploys in ~30 seconds

---

## Repo Structure

```
elahehahmadi.com/
├── index.html              ← landing: hero, about, awards, pubs, talks, ventures, contact
├── arts.html               ← photography gallery
├── blogs.html              ← article series (currently unlinked from nav — adding content later)
├── projects.html           ← ventures + research projects
├── CLAUDE.md               ← site-specific instructions
├── MEMORY.md               ← this file
├── README.md               ← setup docs
├── CNAME                   ← contains: elahehahmadi.com
├── .gitignore              ← also ignores photos/_originals/
├── assets/
│   ├── css/style.css       ← black & white dark theme
│   ├── js/main.js          ← multi-page renderer
│   └── images/
│       └── elahe-solve.jpg ← hero photo on landing
├── data/                   ← EDIT THESE for all content
│   ├── profile.json        ← bio, roles, awards, publications, talks, links, web3forms key
│   ├── projects.json       ← ventures (VIVA, Themis) + research projects
│   ├── photos.json         ← gallery photos by category
│   ├── articles.json       ← article series (page is hidden but data preserved)
│   └── education.json      ← educational resources (section commented out)
└── photos/                 ← compressed image files (max 1600px)
    ├── nature/
    ├── urban/
    ├── portrait/
    ├── abstract/
    └── _originals/         ← pre-compression backups (gitignored)
```

---

## Page Contents

- **`index.html`** (landing): hero with `elahe-solve.jpg`, About (bio/awards/publications/talks), Ventures preview, Contact form. Education section is in the markup but HTML-commented; uncomment when materials are ready.
- **`arts.html`**: photography gallery with filter buttons (All / Nature / Urban / Portrait / Abstract).
- **`blogs.html`**: article series. **Currently unlinked from nav and footer** — uncomment the `<li><a href="blogs.html">Writing</a></li>` lines across the four HTML files when articles are ready.
- **`projects.html`**: full ventures grid + research project list.

---

## Content: How to Update Each Section

### Profile / Bio (`data/profile.json`)
- `bio` — array of paragraph strings
- `roles` — array of role strings (shown in hero + sidebar)
- `awards` — array of `{ title, year }`
- `publications` — array of `{ venue, title, url }`
- `talks` — array of `{ venue, title, url }` (renders below publications on landing)
- `links` — array of `{ label, url }` (drives About sidebar + footer Contact column + landing Contact section)
- `contact.web3forms_key` — Web3Forms access key for contact form

### Projects (`data/projects.json`)
- `ventures` — array of `{ id, name, role, tagline, description, url, year }` (companies)
- `research` — array of `{ id, title, summary, venue, url, year }` (papers / open-source / patents)

### Photography (`data/photos.json`)
- `categories` — array of category name strings; adding one auto-creates a filter button (multi-word like `"street photography"` works — title-cased automatically in UI)
- `photos` — array of photo objects:
  ```json
  {
    "id": "p031",
    "category": "nature",
    "caption": "Description",
    "url": "photos/nature/filename.jpg",
    "width": 1600,
    "height": 1065
  }
  ```
- `_archived_photos` — for entries that shouldn't display but shouldn't be deleted
- Photos auto-compress workflow: drop original into `photos/<category>/`, run `sips --resampleHeightWidthMax 1600 -s formatOptions 80 <file>` to compress in place
- Originals backup lives in `photos/_originals/` (gitignored)

### Articles (`data/articles.json`)
- `series` — array of series objects
- Each series: `id`, `number` (e.g. "01"), `tag`, `title`, `description`, `articles[]`
- Each article: `{ title, url, date }`
- Page is currently unlinked from nav until content is ready

### Education (`data/education.json`)
- `resources` — array of `{ id, roman, title, description, url }`
- Section is HTML-commented in `index.html` — uncomment the `<section id="education">` block when ready

---

## Design System

**Aesthetic:** Black & white dark — editorial / gallery feel
**Fonts:** Cormorant Garamond (headings, serif) + DM Sans (body, UI)
**Color tokens (CSS vars in `assets/css/style.css`):**
- `--bg: #0a0a0a` ← page background
- `--bg-alt: #131313` ← elevated section bg
- `--bg-elev: #1a1a1a`
- `--line: #262626` ← borders
- `--text: #f5f5f5` ← primary text
- `--text-mute: #b8b8b8` ← secondary text
- `--text-dim: #7a7a7a` ← labels, captions
- `--text-faint: #4a4a4a`
- `--accent: #ffffff`

**Images:** displayed with `filter: grayscale(1) contrast(1.05)` to keep them on-theme; colored originals work fine.

**Sections on landing:** Hero → About → Ventures → (Education, commented) → Contact

---

## Contact Form

Uses **Web3Forms** (free tier, unlimited submissions). Lives only on the landing page.

- Access key is set in `data/profile.json` → `contact.web3forms_key`
- The key is in client-side JSON (visible in browser), so the key is **locked to allowed domains** in the Web3Forms dashboard — that's what prevents abuse, not hiding the key.
- Allowed domains should include: `elahehahmadi.com`, `www.elahehahmadi.com`, `elahea2020.github.io`, `localhost`

To swap to a different form provider, edit `setupContactForm` in `assets/js/main.js`.

---

## Workflow: Making Changes

```bash
# 1. Make edits (Claude Code edits the JSON or photo files)
# 2. Commit and push
git add .
git commit -m "clear description of what changed"
git push

# Site goes live at elahehahmadi.com in ~30 seconds
```

### Example prompts Elaheh might use
- "Add my new article about AI safety to series 1"
- "Create a new article series about robotics, no articles yet"
- "Add these 3 photos to the nature category: [files]"
- "Compress the new photos"
- "Add a new venture / research project to projects.json"
- "Add a new talk: [venue, title, YouTube URL]"
- "Update bio to add a paragraph about VIVA AI"
- "Add a new award"
- "Re-enable the Writing page in the nav"
- "Re-enable the Education section on the landing page"

---

## Things to Never Do

- Do not edit HTML/CSS for content — edit JSON files only
- Do not edit `assets/css/style.css` unless Elaheh explicitly asks for a design change
- Do not commit photos larger than ~500KB without compressing first (use the `sips` workflow above)
- Do not delete existing JSON entries — move to an `_archived_*` field
- Do not change the `id` field of existing JSON entries
- Do not push directly without a descriptive commit message
- Do not introduce colored UI accents — site is intentionally B&W

---

## Pending / Future Setup Tasks

- [ ] Web3Forms: confirm "Allowed Domains" is set to `elahehahmadi.com`, `www.elahehahmadi.com`, `elahea2020.github.io`, `localhost`
- [ ] Add real Education resources and uncomment the section in `index.html`
- [ ] Add real Writing content to `articles.json` and re-enable the Writing nav links across all four HTML files
- [ ] Replace generic photo captions in `photos.json` with real location/title/year
- [ ] Confirm GitHub Pages deployment is enabled (Settings → Pages → Source: GitHub Actions)
- [ ] Confirm GoDaddy DNS A records point to GitHub Pages IPs (185.199.108-111.153)
- [ ] Confirm HTTPS is active on elahehahmadi.com (GitHub auto-provisions)

---

## Key URLs

| What | URL |
|------|-----|
| Live site | https://elahehahmadi.com |
| GitHub repo | https://github.com/elahea2020/elahehahmadi.com |
| GitHub Actions (deploy logs) | https://github.com/elahea2020/elahehahmadi.com/actions |
| VIVA AI | https://getviva.ai |
| Themis AI | https://themisai.io |
| Google Scholar | https://scholar.google.com/citations?user=LPf5Vq0AAAAJ |
| Web3Forms (contact form) | https://web3forms.com |
| Cloudflare R2 (if needed for photos) | https://dash.cloudflare.com |
