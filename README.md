# elahehahmadi.com

Personal website for Elaheh Ahmadi — hosted on GitHub Pages, managed via Claude Code.

## Stack

- **Hosting:** GitHub Pages (free)
- **Content:** JSON files in `data/` — no CMS, no database
- **Updates:** Claude Code edits JSON files locally → `git push` → live in ~30 seconds
- **Contact form:** Formspree (free tier)

## First-Time Setup (30 minutes)

### 1. Create GitHub repo
```bash
# On github.com: create a new repo called "elahehahmadi.com" (or your username.github.io)
# Then locally:
git init
git remote add origin https://github.com/YOUR_USERNAME/elahehahmadi.com.git
git branch -M main
git add .
git commit -m "initial site"
git push -u origin main
```

### 2. Enable GitHub Pages
- Go to your repo on GitHub
- Settings → Pages
- Source: **GitHub Actions**
- Save

Your site will be live at `https://YOUR_USERNAME.github.io/elahehahmadi.com`

### 3. Connect your custom domain (elahehahmadi.com)
- In GitHub: Settings → Pages → Custom domain → enter `elahehahmadi.com` → Save
- In GoDaddy DNS settings, add these records:
  ```
  A     @     185.199.108.153
  A     @     185.199.109.153
  A     @     185.199.110.153
  A     @     185.199.111.153
  CNAME www   YOUR_USERNAME.github.io
  ```
- Wait 10–30 minutes for DNS to propagate
- GitHub will auto-provision SSL (HTTPS) — takes up to 24 hours

### 4. Set up contact form
- Create account at https://formspree.io
- New form → copy the ID
- Edit `data/profile.json` → set `"formspree_id": "YOUR_ID"`

### 5. Set up Claude Code
- Install Claude Code: https://claude.ai/code
- Open this folder as your project
- Claude Code will read `CLAUDE.md` and know exactly how to help you

## Daily Use

```bash
# Ask Claude Code to make changes, then:
git add .
git commit -m "added new article to series 2"
git push
# → site updates automatically in ~30 seconds
```

## Adding Photos

For small collections (under 800MB total):
- Drop photos in `photos/<category>/`
- Update `data/photos.json`

For large collections:
- Upload to Cloudflare R2 (free 10GB)
- Use the public R2 URL in `data/photos.json`
