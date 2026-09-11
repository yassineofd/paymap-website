/* =============================================================================
 * PayMap website — CENTRAL CONFIGURATION
 * -----------------------------------------------------------------------------
 * This is the ONLY file you need to edit to point the site at real URLs.
 * Every button, link and meta reference on the site reads from here.
 *
 * Leave a value as its "YOUR_..." placeholder and the matching button will
 * automatically render in a disabled / "coming soon" state instead of linking
 * to a broken URL.
 * ========================================================================== */

window.PAYMAP_CONFIG = {
  /* ---- Product ---------------------------------------------------------- */
  APP_NAME: "PayMap",
  APP_VERSION: "1.0.0",
  APP_TAGLINE: "Track where it goes.",

  /* ---- Distribution links --------------------------------------------------
   * APP_DOWNLOAD_URL  -> direct .apk download (host it anywhere you trust)
   * GOOGLE_PLAY_URL   -> Play Store listing (leave as placeholder until live).
   *                     Also used by the Reviews section's "on Google Play" link.
   * SUPPORT_EMAIL     -> address used for the Contact page + Privacy Policy
   * ------------------------------------------------------------------------ */
  APP_DOWNLOAD_URL: "YOUR_APK_DOWNLOAD_URL",
  GOOGLE_PLAY_URL: "YOUR_GOOGLE_PLAY_URL",
  SUPPORT_EMAIL: "oligopulse@gmail.com",

  /* ---- Site ----------------------------------------------------------------
   * SITE_URL is used for canonical + Open Graph tags and the sitemap.
   * Set it to the final deployed origin (no trailing slash).
   * ------------------------------------------------------------------------ */
  SITE_URL: "https://paymap.app",

  /* Shown next to the APK button. Purely informational. */
  APK_META: "Android • Latest version",

  /* Year rendered in the footer copyright line. */
  COPYRIGHT_YEAR: 2026,

  /* Date shown on the Privacy Policy page. */
  PRIVACY_LAST_UPDATED: "September 8, 2026"
};
