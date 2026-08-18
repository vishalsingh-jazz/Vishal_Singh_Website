# Vishal Singh Rebari — Jazz Bassist Portfolio

A premium, single-page portfolio site for a jazz double bassist. White / silver /
metallic-gold theme, pure HTML + CSS + JavaScript — no build step, no frameworks,
no dependencies to install.

**Live demo content is fictional** — "Lowell Reeves," his albums, tour dates, and
quotes are placeholders for you to replace with a real artist's information.

---

## 1. Run it locally

You don't need Node, npm, or a build step. Any of these work:

**Easiest — just open the file**
Double-click `index.html`, or open it in your browser directly.
(A couple of things, like `fetch`-based enhancements, may behave better served
over HTTP — see below — but everything in this project works fine from `file://`.)

**Recommended — a tiny local server** (avoids any browser file-access quirks)

```bash
# Python 3 (built in on macOS/Linux, installable on Windows)
cd vishal_singh_website
python3 -m http.server 8000
# then open http://localhost:8000
```

```bash
# Node, if you have it
cd vishal_singh_website
npx serve .
```

```bash
# VS Code
# Install the "Live Server" extension, right-click index.html → "Open with Live Server"
```

---

## 2. Deploy to GitHub Pages

1. Create a new GitHub repository and push this folder's contents to the `main` branch:
   ```bash
   cd lowell-reeves
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Source → Deploy from a branch → `main` / `root`**.
3. Your site will be live at `https://<your-username>.github.io/<your-repo>/`
   within a minute or two.

No build step, no `dist/` folder — GitHub Pages serves these files as-is.

---

## 3. Project structure

```
vishal_singh_website/
├── index.html          All page content and structure
├── style.css            Design tokens + all styling (single file, ~ well-organized sections)
├── script.js             Nav, scroll effects, track player UI, lightbox, form validation
├── assets/
│   ├── favicon.svg        Browser tab icon
│   ├── logo.svg            Header/footer monogram
│   ├── hero-bass.svg     Signature hero illustration (animated strings)
│   ├── portrait.svg       About-section artist illustration
│   ├── gallery-1..4.svg  Press/gallery placeholder images
│   └── video-thumb-1..3.svg   Video placeholder thumbnails
└── README.md
```

All imagery is original line-art SVG — vector, tiny in file size, and license-free,
so there's nothing to swap out for legal reasons before you go live (though you'll
still want to replace it with real photos — see below).

---

## 4. What's real vs. placeholder

| Area | Status |
|---|---|
| Layout, styling, animations, responsiveness | Fully built, production-ready |
| Copy (bio, track titles, tour dates, quotes) | **Placeholder text — rewrite with real content** |
| "Play" buttons on tracks | UI works, but no audio files are bundled (see §5) |
| Video thumbnails | Open a placeholder lightbox, not a real player (see §5) |
| Contact form | Validates client-side and shows a confirmation, but **does not send anywhere yet** (see §5) |
| Social/ticket links | Point to `#` — replace `href` values with real URLs |

---

## 5. What I'd extend first

In priority order:

1. **Wire up the contact form.** Right now `script.js` validates the fields and
   shows a fake confirmation. The fastest real option is a form backend that
   needs no server of your own — [Formspree](https://formspree.io) or
   [Netlify Forms](https://docs.netlify.com/forms/setup/) both work by changing
   a few lines in the `submit` handler in `script.js` (search for `Demo behaviour`).

2. **Add real audio previews.** Each `.track` button already toggles a
   "now playing" state. To make it functional:
   ```js
   // in script.js, inside the track-play click handler, before playerNote update:
   previewAudio.src = "assets/audio/low-light-preview.mp3";
   ```
   Add short (15–30s) MP3 clips to `assets/audio/` and map one path per track.

3. **Swap in real photography and video.** Replace the SVGs in `video-thumb-*`
   and `gallery-*` with actual JPG/WebP files (same filenames, or update the
   `src` attributes in `index.html`). For video, either:
   - embed YouTube/Vimeo iframes in the lightbox (`openLightbox` in `script.js`), or
   - link out to a hosted video page.
   Keep new photos compressed (WebP, < 300KB each) to preserve the fast load time.

4. **Make tour dates data-driven.** Right now dates live directly in the HTML
   in `#tour .tour-list`. If dates change often, move them to a small JSON file
   (`assets/tour-dates.json`) and render the list with `fetch()` in `script.js` —
   this also makes it easy to auto-hide past dates.

5. **Add a proper Open Graph image.** `index.html` has `og:title` and
   `og:description` meta tags but no `og:image`. Export a 1200×630 PNG (a
   screenshot of the hero section works well) to `assets/og-image.png` and add:
   ```html
   <meta property="og:image" content="https://yourdomain.com/assets/og-image.png">
   ```

6. **Custom domain (optional).** Add a `CNAME` file with your domain name at
   the project root and configure DNS per
   [GitHub's custom domain docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

---

## 6. Editing the content

Everything is in plain HTML — no templating engine, no CMS. Open `index.html`
and edit directly:

- **Name / branding:** search for `Lowell Reeves` (appears in `<title>`, the
  nav brand, hero, and footer).
- **Bio:** the `#about` section.
- **Discography:** each `.track` block inside `#trackList`.
- **Tour dates:** each `.tour-row` inside `#tour`.
- **Press quotes:** the `.press-track` block.
- **Contact details:** `.contact-channels` (email, phone, social).

## 7. Editing the design

All colors, fonts, and spacing are defined as CSS custom properties at the top
of `style.css`, under `:root`. Change a value once there and it updates
everywhere:

```css
:root {
  --ivory: #F6F4EF;      /* page background */
  --ink: #14130F;         /* primary text */
  --gold: #C6A15B;        /* metallic gold accent */
  --gold-light: #E7D2A0;
  --gold-deep: #9C7B3C;
  --silver: #AEB4B8;      /* secondary accent, hairlines */
  --font-display: "Playfair Display", ...;  /* headings */
  --font-body: "Jost", ...;                 /* paragraphs, nav */
  --font-mono: "Space Mono", ...;           /* labels, track numbers, dates */
}
```

Fonts load from Google Fonts via a `<link>` in `index.html` — if you need the
site to work fully offline, download the font files and switch to local
`@font-face` rules instead.

---

## 8. Performance & accessibility notes

- No JS framework, no build step, no external icon library — the entire site
  (HTML + CSS + JS + SVG assets) is well under 200KB uncompressed.
- Respects `prefers-reduced-motion` (animations and smooth scroll are disabled
  for users who request it).
- Keyboard-navigable: visible focus states, a skip-to-content link, and a
  focus-managed lightbox (`Esc` to close).
- Semantic landmarks (`header`, `main`, `section`, `footer`) and descriptive
  `alt` text throughout — update `alt` attributes when you swap in real photos.

---

## 9. License / credits

All code and SVG illustrations in this project were created for this prototype
and are yours to use and modify freely. Fonts are served from Google Fonts
under their respective open licenses (Playfair Display, Jost, and Space Mono
are all SIL Open Font License).
