/* =============================================================================
 * PayMap website — GOOGLE PLAY REVIEWS
 * -----------------------------------------------------------------------------
 * The "Reviews" section on the homepage renders itself from the list below.
 *
 *   - List EMPTY  ->  the section shows a neutral "no reviews yet" message.
 *   - List FILLED ->  the section shows the review cards + an average rating
 *                     and a link to the full listing (GOOGLE_PLAY_URL in
 *                     config.js).
 *
 * Why isn't this automatic?
 *   Google Play has no public, CORS-enabled reviews API, so a static site
 *   cannot fetch reviews in the browser. Keep this file current in one of
 *   two ways:
 *     1. Paste a few real reviews here by hand after the app is published, or
 *     2. Run a scheduled job (e.g. the `google-play-scraper` npm package)
 *        that rewrites this file with the latest reviews and redeploys.
 *
 * Never invent reviews. Only put real user reviews here.
 *
 * Each item:
 *   {
 *     author: "First L.",        // display name as shown on Google Play
 *     rating: 5,                  // integer 1-5
 *     date:   "2026-11-02",      // ISO date (YYYY-MM-DD)
 *     text:   "Short quote from the review."
 *   }
 * ========================================================================== */

window.PAYMAP_REVIEWS = {
  items: [
    // (empty until PayMap is live on Google Play and has real reviews)
  ]
};
