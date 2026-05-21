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
**Hosting:** GitHub Pages (free), auto-deploys on every push to `main`
**Domain:** elahehahmadi.com (registered at GoDaddy, DNS pointed to GitHub Pages)

### How the site works
- `index.html` loads all content dynamically from JSON files in `data/`
- **Never edit `index.html` or `assets/` for content changes**
- All content updates go through the four JSON files in `data/`
- Push to `main` → GitHub Actions deploys in ~30 seconds

---

## Repo Structure

```
elahehahmadi.com/
├── index.html              ← site shell, do not edit for content
├── CLAUDE.md               ← site-specific instructions
├── MEMORY.md               ← this file
├── README.md               ← setup docs
├── CNAME                   ← contains: elahehahmadi.com
├── .gitignore
├── assets/
│   ├── css/style.css       ← all styles (warm/artistic aesthetic)
│   └── js/main.js          ← loads JSON, renders everything
├── data/                   ← EDIT THESE for all content
│   ├── profile.json        ← bio, roles, awards, publications, links, formspree ID
│   ├── photos.json         ← gallery photos by category
│   ├── articles.json       ← article series + individual articles
│   └── education.json      ← educational resources
└── photos/                 ← actual image files
    ├── portrait/
    ├── landscape/
    ├── urban/
    └── abstract/
```

---

## Content: How to Update Each Section

### Profile / Bio (`data/profile.json`)
- `bio` — array of paragraph strings
- `roles` — array of role strings (shown in hero + sidebar)
- `awards` — array of `{ title, year }`
- `publications` — array of `{ venue, title, url }`
- `links` — array of `{ label, url }` (shown in nav sidebar + contact + footer)
- `contact.formspree_id` — set to Formspree form ID for contact form emails

### Photography (`data/photos.json`)
- `categories` — array of category name strings; adding one here auto-creates a filter button
- `photos` — array of photo objects:
  ```json
  {
    "id": "p005",
    "category": "portrait",
    "caption": "Description — Location, Year",
    "url": "photos/portrait/filename.jpg",
    "width": 1200,
    "height": 1600,
    "date": "2024-06-01"
  }
  ```
- For large photos (>2MB): compress first (use ImageOptim or Squoosh)
- For large libraries (>800MB total): upload to Cloudflare R2, use public URL instead of local path
- Photo files go in `photos/<category>/` folder

### Articles (`data/articles.json`)
- `series` — array of series objects
- Each series has: `id`, `number` (e.g. "01"), `tag`, `title`, `description`, `articles[]`
- Each article: `{ title, url, date }`
- To add an article to an existing series: find the series by `id`, append to its `articles` array
- To add a new series: append a new object to `series` with next sequential `id` and `number`

### Education (`data/education.json`)
- `resources` — array of `{ id, roman, title, description, url }`
- `roman` is the Roman numeral label (I., II., III., etc.)
- `url` can be `"#"` as a placeholder until the resource has a real link

---

## Design System

**Aesthetic:** Warm, gallery-like, organic — NOT minimal/corporate
**Fonts:** Cormorant Garamond (headings, serif) + DM Sans (body, UI)
**Color palette:**
- `--cream: #F8F4EE`
- `--warm-white: #FDFAF6`
- `--sand: #E8DDD0`
- `--clay: #C4A882`
- `--terra: #8B6B4A`
- `--bark: #4A3728` ← primary dark
- `--ink: #1E1410`
- `--mist: #D4C9BC`
- `--rust: #A85A3C` ← accent

**Sections:** Hero → About → Photography → Writing → Education → Contact
**Contact form:** Uses Formspree. Set `formspree_id` in `data/profile.json`.

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

### Example prompts Elaheh might use with Claude Code
- "Add my new article about AI safety to series 1"
- "Create a new article series about robotics, no articles yet"
- "Add these 3 photos to the portrait category: [files]"
- "Update my bio to add a new paragraph about VIVA AI"
- "Add a new award: MIT Innovator Under 35, 2024"
- "Add a new publication: [venue, title, url]"
- "Add a new education resource called X about Y"
- "Change the description of series 2"

---

## Things to Never Do

- Do not edit `index.html` for content — edit JSON files only
- Do not edit `assets/css/style.css` unless Elaheh explicitly asks for a design change
- Do not commit photos larger than 2MB without compressing first
- Do not delete existing JSON entries — comment them out or archive if needed
- Do not change the `id` field of existing JSON entries (it will break things)
- Do not push directly without a descriptive commit message

---

## Pending Setup Tasks

- [ ] Formspree: create account at formspree.io, get form ID, add to `data/profile.json` → `contact.formspree_id`
- [ ] GitHub Pages: confirm GitHub Actions deployment is enabled (Settings → Pages → Source: GitHub Actions)
- [ ] DNS: confirm GoDaddy DNS A records point to GitHub Pages IPs (185.199.108-111.153)
- [ ] SSL: confirm HTTPS is active on elahehahmadi.com (GitHub auto-provisions, takes up to 24h)
- [ ] Add real photos to `photos/` folders and update `data/photos.json`
- [ ] Add real article URLs to `data/articles.json` (currently `"#"` placeholders)
- [ ] Add hero photo: replace placeholder in `index.html` `.hero-image-placeholder` with `<img src="assets/images/elaheh.jpg">`

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
| Formspree (contact form) | https://formspree.io |
| Cloudflare R2 (if needed for photos) | https://dash.cloudflare.com |
