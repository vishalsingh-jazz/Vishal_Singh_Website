/* =========================================================
   Vishal Singh — site behaviour
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
  document.querySelectorAll(".track[data-embed]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest(".track-row");
      var embed = row.querySelector(".track-embed");
      var isOpen = !embed.hidden;
  
      // Close and clear any other open player so only one plays at a time
      document.querySelectorAll(".track-embed").forEach(function (e) {
        if (e !== embed) {
          e.hidden = true;
          e.innerHTML = "";
        }
      });
  
      if (isOpen) {
        embed.hidden = true;
        embed.innerHTML = "";
      } else {
        embed.hidden = false;
        embed.dataset.platform = btn.dataset.embed;
        var iframe = document.createElement("iframe");
        iframe.src = btn.dataset.src;
        iframe.loading = "lazy";
        iframe.setAttribute("allow", "autoplay; encrypted-media");
        embed.appendChild(iframe);
      }
    });
  });

  /* ---------- Lightbox: video cards + gallery images ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");

  var lightboxVideoWrap = document.getElementById("lightboxVideoWrap");
var lightboxVideo = document.getElementById("lightboxVideo");

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
    lightboxVideo.src = "";
    lightboxVideoWrap.style.display = "none";
    lightboxImg.style.display = "block";
  }

  document.querySelectorAll(".video-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var youtubeId = card.dataset.youtubeId;
      var caption = card.dataset.caption || "";
      if (youtubeId) openVideoLightbox(youtubeId, caption);
    });
  });
  
  function openVideoLightbox(youtubeId, caption) {
    if (!lightbox) return;
    lightboxImg.style.display = "none";
    lightboxVideoWrap.style.display = "block";
    lightboxVideo.src = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1&rel=0";
    lightboxCaption.textContent = caption;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose.focus();
    document.body.style.overflow = "hidden";
  }

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

  var galleryGrid = document.getElementById("galleryGrid");
var galleryToggle = document.getElementById("galleryToggle");
var galleryFade = document.getElementById("galleryFade");

if (galleryGrid && galleryToggle) {
  galleryToggle.addEventListener("click", function () {
    var isCollapsed = galleryGrid.classList.toggle("is-collapsed");
    galleryFade.classList.toggle("is-hidden", !isCollapsed);
    galleryToggle.textContent = isCollapsed ? "View Full Gallery" : "Close Gallery";
    galleryToggle.setAttribute("aria-expanded", String(!isCollapsed));

    // When closing, scroll back up to the top of the section so the
    // person isn't left stranded far down a now-short gallery.
    if (!isCollapsed === false) {
      document.getElementById("gallery").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

  /* ---------- Contact form (client-side demo) ----------
     No backend is wired up. This validates the fields and shows
     a confirmation message. Replace the submit handler with a
     fetch() call to your form endpoint — see the README.
  ------------------------------------------------------------ */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (form) {
    
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
    
        var name = form.querySelector("#fName");
        var email = form.querySelector("#fEmail");
        var message = form.querySelector("#fMessage");
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var submitBtn = form.querySelector('button[type="submit"]');
    
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
    
        submitBtn.disabled = true;
        formNote.textContent = "Sending...";
        formNote.classList.remove("success");
    
        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { "Accept": "application/json" }
        })
          .then(function (response) {
            submitBtn.disabled = false;
            if (response.ok) {
              formNote.textContent =
                "Thanks, " + name.value.trim().split(" ")[0] +
                " — your message has been sent. I'll get back to you as soon as possible.";
              formNote.classList.add("success");
              form.reset();
            } else {
              formNote.textContent =
                "Something went wrong sending that — please email directly instead.";
            }
          })
          .catch(function () {
            submitBtn.disabled = false;
            formNote.textContent =
              "Something went wrong sending that — please email directly instead.";
          });
      });
    }

  }
})();
