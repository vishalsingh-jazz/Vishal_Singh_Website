/* =========================================================
   LOWELL REEVES — site behaviour
   No dependencies. Organized by feature, top to bottom.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    // Close menu after choosing a link (mobile)
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  var navAnchors = document.querySelectorAll("[data-nav]");
  var sections = Array.prototype.map.call(navAnchors, function (a) {
    return document.querySelector(a.getAttribute("href"));
  }).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = "#" + entry.target.id;
          var link = document.querySelector('[data-nav][href="' + id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            navAnchors.forEach(function (a) { a.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------- Reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // No IntersectionObserver support: just show everything
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Track list "player" ----------
     This is a UI-only demo: there are no bundled audio files, so
     pressing play toggles a playing state and updates the status
     line. Point `audio.src` at a real file to make it functional —
     see the README for the two-line change required.
  ------------------------------------------------------------ */
  var previewAudio = document.getElementById("previewAudio");
  var playerNote = document.getElementById("playerNote");
  var currentTrack = null;

  document.querySelectorAll(".track-play").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var track = btn.closest(".track");
      var titleEl = track.querySelector(".track-title");
      var title = titleEl ? titleEl.childNodes[0].textContent.trim() : "Track";

      // Stop whichever track was previously "playing"
      if (currentTrack && currentTrack !== track) {
        currentTrack.classList.remove("is-playing");
      }

      var nowPlaying = track.classList.toggle("is-playing");
      currentTrack = nowPlaying ? track : null;

      if (nowPlaying) {
        if (playerNote) {
          playerNote.textContent = "Now previewing \u201C" + title + "\u201D — add an audio file (see README) to enable real playback.";
        }
        // If a real src has been set on #previewAudio elsewhere, this will actually play it.
        if (previewAudio && previewAudio.src) {
          previewAudio.currentTime = 0;
          previewAudio.play().catch(function () { /* autoplay restrictions: ignore */ });
        }
      } else {
        if (playerNote) playerNote.textContent = "Select a track to preview.";
        if (previewAudio) previewAudio.pause();
      }
    });
  });

  /* ---------- Lightbox: video cards + gallery images ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, alt, caption) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightboxCaption.textContent = caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose.focus();
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".video-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var img = card.querySelector("img");
      openLightbox(img.src, img.alt, card.dataset.caption || card.dataset.video || "");
    });
  });

  document.querySelectorAll("[data-lightbox]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var img = link.querySelector("img");
      openLightbox(link.getAttribute("href"), img ? img.alt : "", link.dataset.lightbox);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Contact form (client-side demo) ----------
     No backend is wired up. This validates the fields and shows
     a confirmation message. Replace the submit handler with a
     fetch() call to your form endpoint — see the README.
  ------------------------------------------------------------ */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#fName");
      var email = form.querySelector("#fEmail");
      var message = form.querySelector("#fMessage");
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      var valid = true;
      [name, email, message].forEach(function (field) {
        if (!field.value.trim()) valid = false;
      });
      if (!emailPattern.test(email.value.trim())) valid = false;

      if (!valid) {
        formNote.textContent = "Please fill in your name, a valid email, and a message.";
        formNote.classList.remove("success");
        return;
      }

      // Demo behaviour: show a confirmation and reset the form.
      // Swap this block for a real submission (fetch/Formspree/Netlify Forms/etc).
      formNote.textContent = "Thanks, " + name.value.trim().split(" ")[0] + " — message received. Lowell's team will reply within a few days.";
      formNote.classList.add("success");
      form.reset();
    });
  }
})();
