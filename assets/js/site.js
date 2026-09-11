/* =============================================================================
 * PayMap website — behaviour
 * Vanilla JS, no dependencies. Progressive enhancement only: the page is fully
 * readable and navigable without it.
 * ========================================================================== */
(function () {
  "use strict";

  var CFG = window.PAYMAP_CONFIG || {};

  function isPlaceholder(value) {
    return !value || /^YOUR_[A-Z_]+$/.test(String(value).trim());
  }

  /* --------------------------------------------------- Config hydration --- */
  function hydrateConfig() {
    // Plain text tokens: <span data-cfg-text="APP_VERSION"></span>
    document.querySelectorAll("[data-cfg-text]").forEach(function (el) {
      var key = el.getAttribute("data-cfg-text");
      if (CFG[key] != null) el.textContent = CFG[key];
    });

    // Links / buttons: <a data-cfg-link="APP_DOWNLOAD_URL">
    document.querySelectorAll("[data-cfg-link]").forEach(function (el) {
      var key = el.getAttribute("data-cfg-link");
      var raw = CFG[key];
      var placeholder = isPlaceholder(raw);
      var isMail = el.hasAttribute("data-cfg-mailto");

      if (!placeholder) {
        el.setAttribute("href", isMail ? "mailto:" + raw : raw);
        el.removeAttribute("aria-disabled");
        if (isMail) el.textContent = raw;
        if (el.hasAttribute("data-cfg-optional")) el.hidden = false;
        return;
      }

      // Value is still a "YOUR_..." placeholder ------------------------------
      if (el.hasAttribute("data-cfg-optional")) {
        // Non-essential (e.g. Google Play): hide it entirely — no dead link.
        el.hidden = true;
        return;
      }

      // Essential (e.g. Download, support email): render a clearly disabled control.
      el.removeAttribute("href");
      el.setAttribute("role", "link");
      el.setAttribute("aria-disabled", "true");
      el.setAttribute(
        "title",
        "This link isn't configured yet — see assets/js/config.js"
      );
      var label = el.querySelector("[data-cfg-label]") || el;
      var alt = el.getAttribute("data-cfg-placeholder-text");
      if (alt) label.textContent = alt;
      el.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });

    // Footer year
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = CFG.COPYRIGHT_YEAR || new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------- Navbar --- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("nav--scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mark the current page in the desktop + mobile nav
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-navlink]").forEach(function (a) {
      var target = a.getAttribute("data-navlink");
      if (
        target === path ||
        (path === "index.html" && target === "index.html")
      ) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* -------------------------------------------------------- Mobile menu --- */
  function initMenu() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("mobile-menu");
    var backdrop = document.querySelector(".menu-backdrop");
    if (!toggle || !menu) return;

    var open = function () {
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    var close = function () {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    var isOpen = function () {
      return document.body.classList.contains("menu-open");
    };

    toggle.addEventListener("click", function () {
      isOpen() ? close() : open();
    });
    if (backdrop) backdrop.addEventListener("click", close);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        close();
        toggle.focus();
      }
    });
    // Never leave the menu stuck open when resizing up to desktop
    var mq = window.matchMedia("(min-width: 1024px)");
    var onChange = function () {
      if (mq.matches) close();
    };
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
  }

  /* ----------------------------------------------------- Scroll reveal --- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ------------------------------------------------------ Google Play reviews */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  function stars(rating) {
    var r = Math.max(0, Math.min(5, Math.round(rating)));
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out +=
        '<svg viewBox="0 0 24 24" aria-hidden="true" class="star' +
        (i <= r ? " star--on" : "") +
        '"><path d="m12 2 3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
    }
    return '<span class="stars" role="img" aria-label="Rated ' + r + ' out of 5">' + out + "</span>";
  }

  function initReviews() {
    var section = document.getElementById("reviews");
    if (!section) return;

    var listEl = section.querySelector("[data-reviews-list]");
    var summaryEl = section.querySelector("[data-reviews-summary]");
    var ctaEl = section.querySelector("[data-reviews-cta]");
    var data = (window.PAYMAP_REVIEWS && window.PAYMAP_REVIEWS.items) || [];
    var items = data.filter(function (r) {
      return r && r.text && r.rating;
    });

    // The "read on Google Play" link only appears once the store URL is set.
    var playUrl = CFG.GOOGLE_PLAY_URL;
    if (ctaEl) ctaEl.hidden = isPlaceholder(playUrl) || items.length === 0;

    if (!items.length) {
      if (summaryEl) summaryEl.hidden = true;
      listEl.innerHTML =
        '<p class="reviews__empty">PayMap isn’t on Google Play yet. Once it’s published, ' +
        "reviews left by users will appear here automatically.</p>";
      return;
    }

    var avg =
      items.reduce(function (sum, r) {
        return sum + Number(r.rating);
      }, 0) / items.length;

    if (summaryEl) {
      summaryEl.hidden = false;
      summaryEl.innerHTML =
        stars(avg) +
        '<span class="reviews__avg">' +
        avg.toFixed(1) +
        "</span>" +
        '<span class="reviews__count">' +
        items.length +
        (items.length === 1 ? " review" : " reviews") +
        " on Google Play</span>";
    }

    var fmt = function (iso) {
      var d = new Date(iso);
      return isNaN(d)
        ? ""
        : d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
    };

    listEl.innerHTML = items
      .map(function (r) {
        return (
          '<figure class="review">' +
          '<div class="review__head">' +
          stars(r.rating) +
          (r.date ? '<time class="review__date">' + escapeHtml(fmt(r.date)) + "</time>" : "") +
          "</div>" +
          "<blockquote>" +
          escapeHtml(r.text) +
          "</blockquote>" +
          '<figcaption class="review__author">' +
          escapeHtml(r.author || "Google Play user") +
          "</figcaption>" +
          "</figure>"
        );
      })
      .join("");
  }

  /* --------------------------------------------------------------- Init --- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    hydrateConfig();
    initNav();
    initMenu();
    initReviews();
    initReveal();
  });
})();
