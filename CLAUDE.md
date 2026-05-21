# Elaheh Ahmadi — Personal Website

This is a static website hosted on GitHub Pages. All content is driven by JSON files in the `data/` folder. **Never edit `index.html` or `assets/` directly for content changes** — always edit the JSON files.

---

## Project Structure

```
elahehahmadi/
├── index.html              # Main site (do not edit for content)
├── assets/
│   ├── css/style.css       # All styles
│   └── js/main.js          # Loads JSON and renders site
├── data/                   # ← EDIT THESE for all content changes
│   ├── profile.json        # Bio, awards, publications, links
│   ├── photos.json         # Photography gallery
│   ├── articles.json       # Article series
│   └── education.json      # Educational resources
├── photos/                 # Photo files organized by category
│   ├── portrait/
│   ├── landscape/
│   ├── urban/
│   └── abstract/
└── .github/workflows/      # Auto-deploy on git push
    └── deploy.yml
```

---

## How to Update Content

### Add a new photo
1. Copy the image file into `photos/<category>/filename.jpg`
2. Add an entry to `data/photos.json`:
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

### Update bio or awards
Edit `data/profile.json` — the `bio` array (paragraphs), `awards` array, or `publications` array.

### Add an education resource
Add to `data/education.json` resources array:
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
1. Create `photos/<newcategory>/` folder
2. Add the category name to `data/photos.json` `categories` array
3. A filter button will appear automatically

---

## Deploying Changes

After editing any file:
```bash
git add .
git commit -m "describe what you changed"
git push
```
GitHub Actions will auto-deploy in ~30 seconds. Live at: https://elahehahmadi.github.io (or custom domain once configured).

---

## Contact Form Setup (one-time)

1. Create a free account at https://formspree.io
2. Create a new form → copy the form ID (looks like `xyzabcde`)
3. In `data/profile.json`, set: `"formspree_id": "xyzabcde"`

---

## Photo Guidelines

- Recommended max size: 2MB per image (compress with ImageOptim or Squoosh)
- Supported formats: JPG, PNG, WebP (WebP preferred for size)
- Keep total `photos/` folder under 800MB to stay safe within GitHub's 1GB limit
- For large photo libraries, upload to Cloudflare R2 and use the public URL in `photos.json` instead of a local path

---

## Important Rules for Claude Code

- Always edit JSON files for content, never the HTML
- When adding photos, always compress first if over 2MB
- Commit messages should describe the content change clearly
- Never delete existing data — comment out or archive instead
- The `id` field in JSON arrays must be unique
