# App screenshots

The homepage "See PayMap in action" section currently shows **faithful HTML/CSS
mockups** of the PayMap UI (built from the app's real colours, fonts and
components). When you have real device captures, drop them here and swap them in.

## What to add

Capture these four screens from a real device or emulator (Pixel-class, dark
theme, portrait). Use only generic sample expenses — Groceries, Fuel,
Electricity, Pharmacy, Rent, Restaurant, Internet — never real personal data.

| File name              | Screen            |
| ---------------------- | ----------------- |
| `dashboard.webp`       | Home / dashboard  |
| `add-expense.webp`     | Add-expense sheet  |
| `overview.webp`        | Full expense list  |
| `export.webp`          | Export sheet       |

## Recommended export settings

- Format: **WebP** (or AVIF), quality ~80.
- Width: **1080px** (a standard phone screen width); keep the real aspect ratio.
- Also keep a `.png` fallback if you like, same base name.

## How to swap them into the page

In `index.html`, find the `#screenshots` section. Each `<figure class="shot">`
contains a `.phone` mockup. Replace the mockup markup inside one `<figure>` with:

```html
<img class="phone-shot" src="assets/screenshots/dashboard.webp"
     width="1080" height="2340" loading="lazy" decoding="async"
     alt="PayMap dashboard showing the monthly total and recent expenses" />
```

Then add this rule to `assets/css/styles.css` (or a small block at the bottom):

```css
.phone-shot {
  width: min(300px, 76vw);
  border-radius: 30px;
  border: 2px solid #2b3752;
  box-shadow: var(--shadow-pop);
}
```

Keep the `<figcaption>` text as-is.
