# PayMap — official website

Marketing site for **PayMap**, an Android expense tracker. _Track where it goes._

Built as a **static site** — plain HTML, one CSS file, one small vanilla-JS file.
No build step, no framework, no dependencies. It runs by opening the files and
deploys to any static host as‑is.

- **Live pages:** Home (`index.html`), About, Privacy Policy, Contact, 404
- **Design tokens** (colours, fonts, radii) mirror the PayMap Flutter app
  (`lib/theme/app_theme.dart`).
- **No GitHub links** anywhere on the site — the source repo is private.

---

## 1. Run it locally

No install required. Any static file server works — pick one:

```bash
# Python 3
python -m http.server 5173

# Node (if you have it)
npx serve .

# PHP
php -S localhost:5173
```

Then open <http://localhost:5173>.

> Opening `index.html` directly with `file://` mostly works too, but a local
> server is closer to production (correct MIME types, relative paths, no CORS
> quirks with the web manifest).

## 2. Build

There is nothing to build. What you see in the repo is what ships.

## 3. Deploy

The site is a folder of static files. Deploy the **repository root**.

### Vercel

- New Project → import the repo.
- Framework preset: **Other**. Build command: _none_. Output directory: `.`
- Deploy. Done.

### Netlify

- New site from Git → pick the repo.
- Build command: _(leave empty)_. Publish directory: `.`

### GitHub Pages

Works, but note the source repo is private — GitHub Pages from a private repo
needs a paid GitHub plan. If you use it:

- Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
- Branch: `main`, folder: `/ (root)`. Save.
- The included `.nojekyll` file makes Pages serve `assets/` untouched.
- If the site is served from a sub‑path (e.g.
  `https://user.github.io/paymap-website/`), the relative links already work.
  Only update absolute URLs in `sitemap.xml`, `robots.txt` and the `<link
  rel="canonical">` / `og:url` tags to the real address.

## 4. Configure links (the one place)

Everything configurable lives in **[`assets/js/config.js`](assets/js/config.js)**.
Edit it and every button, link and label across all pages updates.

| Key                | What it is                                              |
| ------------------ | ------------------------------------------------------- |
| `APP_NAME`         | Product name                                            |
| `APP_VERSION`      | Shown next to download buttons and in the footer        |
| `APP_TAGLINE`      | "Track where it goes."                                  |
| `APP_DOWNLOAD_URL` | Direct **.apk** download (host it anywhere you trust)   |
| `GOOGLE_PLAY_URL`  | Play Store listing (also used by the Reviews section)   |
| `SUPPORT_EMAIL`    | Address for the Contact page + Privacy Policy           |
| `SITE_URL`         | Deployed origin — used for canonical / OG / sitemap     |
| `APK_META`         | Small caption under the APK button                      |
| `COPYRIGHT_YEAR`   | Footer year                                             |
| `PRIVACY_LAST_UPDATED` | Date shown on the Privacy Policy page              |

### Placeholder handling (no broken links, ever)

Any value left as its `YOUR_…` placeholder is handled gracefully:

- **Essential** links (Download, support email) render as a clearly **disabled**
  control with an explanatory tooltip — they never navigate anywhere.
- **Optional** links (Google Play) are **hidden entirely** until you provide a
  real URL.

### Update the app version

Change `APP_VERSION` in `config.js`. It propagates to the hero, the download
section and the footer.

## 5. Where to put brand assets

| Asset            | Path                              | Notes |
| ---------------- | --------------------------------- | ----- |
| Full logo        | `assets/img/paymap-logo.png`      | Copied from `paymap/assets/images/logo.png`. Used for social share (OG) images. Optimise/replace freely. |
| App icon         | `assets/img/paymap-icon.png`      | Copied from `paymap/assets/images/paymap_icon.png` (512×512). Also used as `icon-192/512`, `apple-touch-icon`. |
| Favicon          | `assets/img/favicon.svg`          | Inline SVG mark. Edit or replace. |
| Navbar / footer mark | inline `<svg class="brand__mark">` in each HTML file | Small vector version of the icon. |

If you regenerate the PNG icons at their real target sizes (192, 512, 180) the
site will be a little lighter — currently they reuse the single 512 px source.

## 5b. Google Play reviews section

The homepage has a **Reviews** section that renders itself from
**[`assets/js/reviews.js`](assets/js/reviews.js)**:

- **List empty** (the default) → the section shows a neutral _"PayMap isn't on
  Google Play yet… reviews will appear here"_ message. Nothing to do.
- **List filled** → it shows review cards, an average star rating, and a
  _"Read all reviews on Google Play"_ button (uses `GOOGLE_PLAY_URL`).

**Why it isn't automatic:** Google Play has no public, CORS-enabled reviews API,
so a static page can't fetch reviews in the browser. After the app is live, keep
`reviews.js` current one of two ways:

1. Paste a few **real** reviews into the `items` array by hand, or
2. Run a scheduled job (e.g. the `google-play-scraper` npm package) that
   rewrites `reviews.js` with the latest reviews and redeploys.

Never invent reviews — the section only ever shows real user feedback.

## 6. App screenshots

The "See PayMap in action" section currently shows **faithful HTML/CSS mockups**
of the real PayMap screens (same colours, fonts and components as the app).

To use real device captures, see
**[`assets/screenshots/README.md`](assets/screenshots/README.md)** — it lists the
four screens to capture, recommended export settings (WebP, 1080 px wide), and
the exact markup to swap in.

Use only generic sample expenses (Groceries, Fuel, Electricity, Pharmacy, Rent,
Restaurant, Internet). Never real personal data.

## 7. Project structure

```
.
├── index.html            Home  (Navbar · Hero · Intro · Features · How It Works · Screenshots · Reviews · Download CTA · Footer)
├── about.html             /about
├── privacy.html           /privacy   — editable policy, 11 sections
├── contact.html           /contact   — email + Google Play, no fake form
├── 404.html               Not-found page
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── .nojekyll              (GitHub Pages: serve assets/ as-is)
└── assets/
    ├── css/styles.css     One mobile-first stylesheet. Design tokens at the top.
    ├── js/
    │   ├── config.js      ← CENTRAL CONFIG (edit this)
    │   ├── reviews.js     ← Google Play reviews (empty until the app is live)
    │   └── site.js        Nav, mobile menu, reviews render, scroll-reveal, config hydration
    ├── img/               Logo, icon, favicon
    └── screenshots/       Drop real captures here (see its README)
```

There are no reusable server-side partials (static site), so the `<header>` and
`<footer>` markup is repeated in each HTML file. If you change one, change all
five. Everything dynamic (links, labels, year, version) is driven from
`config.js`, so those stay in one place.

The footer links are split into two labelled groups — **Explore** (Home,
Features, How It Works, Screenshots, Download) and **More** (About, Privacy
Policy, Contact).

## 8. What's implemented

- **Responsive**, mobile-first. Intentional layouts at 360 / 390 / 480 / 768 /
  1024 / 1280 / 1440+ — not a shrunk desktop. No horizontal scrolling.
- **Accessible**: semantic landmarks, one `<h1>` per page, skip link, visible
  focus rings, `aria-current`, labelled hamburger with `aria-expanded`,
  keyboard + Escape support, `prefers-reduced-motion` respected.
- **SEO**: per-page `<title>` / meta description / canonical, Open Graph +
  Twitter cards, JSON-LD (`SoftwareApplication`), `robots.txt`, `sitemap.xml`,
  favicon, semantic headings.
- **Performance**: no JS framework, no web fonts beyond Sora + Inter (Google
  Fonts, `display=swap`, preconnected), lazy-loaded below-the-fold images,
  images have intrinsic `width`/`height`.
- **No fake content**: no invented stats, reviews, testimonials, awards or
  company details. No dead links.

## 9. Browser support

Modern Chrome, Firefox, Safari, Edge — including Android Chrome. Uses
`backdrop-filter`, CSS grid, `clamp()`, `dvh`, `overflow: clip`,
`IntersectionObserver` (all widely supported; the page degrades cleanly without
JS).

## 10. Editing the Privacy Policy

`privacy.html` is plain HTML prose with a table of contents. Each section has an
`id`. Update the text directly; change `PRIVACY_LAST_UPDATED` in `config.js` when
you do. The current text describes the app accurately: local SQLite storage, no
account, no analytics, no server, exports via the Android share/print dialogs.
