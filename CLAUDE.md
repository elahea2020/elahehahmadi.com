# Elaheh Ahmadi — Personal Website

A static, multi-page site hosted on GitHub Pages. Theme is black & white (dark). All content is driven by JSON files in `data/`. **Never edit HTML or CSS for content changes** — always edit the JSON files.

---

## Project Structure

```
elahehahmadi.com/
├── index.html              # Landing — career highlights (do not edit for content)
├── arts.html               # Photography sub-page
├── blogs.html              # Writing / article series sub-page
├── projects.html           # Ventures + research sub-page
├── assets/
│   ├── css/style.css       # Black & white theme
│   └── js/main.js          # Multi-page renderer (looks at <body data-page="...">)
├── data/                   # ← EDIT THESE for all content changes
│   ├── profile.json        # Bio, awards, publications, links
│   ├── projects.json       # Ventures (VIVA, Themis) + research projects
│   ├── photos.json         # Photography gallery
│   ├── articles.json       # Article series
│   └── education.json      # Educational resources
├── photos/                 # Photo files organized by category
│   ├── nature/
│   ├── urban/
│   ├── portrait/
│   └── abstract/
└── .github/workflows/      # Auto-deploy on git push
    └── deploy.yml
```

### Page contents

- **`index.html`** (landing): hero, about/bio, awards, publications, ventures preview (links to `projects.html`), education, footer.
- **`arts.html`**: photography gallery with category filters.
- **`blogs.html`**: article series.
- **`projects.html`**: full ventures grid + research projects list.

All pages share the same nav and footer markup. The footer contact column (`#footerContact`) is populated on every page from `profile.json` → `links`.

### How the JS routes by page

`assets/js/main.js` reads `document.body.dataset.page` ("home", "arts", "blogs", "projects") and only fetches the JSON files that page needs. Render functions short-circuit when their target element isn't on the page, so adding a new section is just: drop a `<div id="...">` into the page, and write/extend a renderer.

---

## How to Update Content

### Add a new photo
1. Copy the image file into `photos/<category>/filename.jpg` (folder names are kebab-case for multi-word categories, e.g. `photos/street-photography/`)
2. Add an entry to `data/photos.json` (the `category` value matches the JSON `categories` array verbatim, including any spaces):
```json
{
  "id": "p005",
  "category": "nature",
  "caption": "Description — Location, Year",
  "url": "photos/nature/filename.jpg",
  "width": 1200,
  "height": 1600,
  "date": "2024-06-01"
}
```

### Add a new article to an existing series
Find the series in `data/articles.json` and add to its `articles` array:
```json
{ "title": "Article title", "url": "https://link-to-article.com", "date": "2024-06-01" }
```

### Add a new article series
Add a new object to the `series` array in `data/articles.json`:
```json
{
  "id": 4,
  "number": "04",
  "tag": "Topic Tag",
  "title": "Series Title",
  "description": "Series description.",
  "articles": []
}
```

### Add a venture or research project
Edit `data/projects.json`.

Ventures (`ventures` array):
```json
{
  "id": "venture-slug",
  "name": "Venture Name",
  "role": "Your role",
  "tagline": "One-line description.",
  "description": "Longer description.",
  "url": "https://example.com",
  "year": "2024 – Present"
}
```

Research (`research` array):
```json
{
  "id": "project-slug",
  "title": "Project Title",
  "summary": "What it is.",
  "venue": "AAAI 2024",
  "url": "https://link-to-paper.com",
  "year": "2024"
}
```

### Update bio, awards, publications, talks, or contact links
Edit `data/profile.json` — the `bio`, `awards`, `publications`, `talks`, or `links` arrays. The `links` array drives both the About sidebar and the footer Contact column on every page.

To add a talk:
```json
{ "venue": "Event Name, Year", "title": "Talk title", "url": "https://link-to-video.com" }
```

### Add an education resource
Add to `data/education.json` `resources` array:
```json
{
  "id": 4,
  "roman": "IV.",
  "title": "Resource Title",
  "description": "Short description.",
  "url": "https://link-or-#"
}
```

### Add a new photo category
1. Create `photos/<new-category-kebab-case>/` folder
2. Add the category name to `data/photos.json` `categories` array (multi-word names with spaces are fine — they'll title-case automatically in the UI)
3. A filter button will appear automatically on `arts.html`

---

## Contact Form Setup (one-time)

The contact form on `index.html` uses [Web3Forms](https://web3forms.com) (free, unlimited submissions).

1. Go to https://web3forms.com and submit your email to get an access key (delivered to your inbox immediately, no signup)
2. In `data/profile.json`, set:
   ```json
   "contact": { "web3forms_key": "your-access-key-here" }
   ```

Until the key is set, form submissions show a placeholder success message instead of actually emailing you.

---

## Deploying Changes

After editing any file:
```bash
git add .
git commit -m "describe what you changed"
git push
```
GitHub Actions will auto-deploy in ~30 seconds.

---

## Photo Guidelines

- Recommended max size: 2MB per image (compress with ImageOptim or Squoosh)
- Supported formats: JPG, PNG, WebP (WebP preferred for size)
- Keep total `photos/` folder under 800MB to stay safe within GitHub's 1GB limit
- Photos are displayed with a grayscale filter to match the site theme — colored originals still work fine
- For large libraries, upload to Cloudflare R2 and use the public URL in `photos.json` instead of a local path

---

## Important Rules for Claude Code

- Always edit JSON files for content; never the HTML/CSS
- When adding photos, compress first if over 2MB
- Commit messages should describe the content change clearly
- Never delete existing data — comment out or archive instead
- The `id` field in JSON arrays must be unique
- The site is intentionally black & white — avoid introducing colored elements
