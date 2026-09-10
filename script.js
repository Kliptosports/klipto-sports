/* ============================================================
   KLIPTO SPORTS — SHARED SITE BEHAVIOR
   ============================================================ */
(function () {
  "use strict";

  var cfg = window.KLIPTO_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Populate config-driven content ---------- */
  function populateConfig() {
    document.querySelectorAll("[data-cfg-email]").forEach(function (el) {
      el.textContent = cfg.email;
      if (el.tagName === "A") el.href = "mailto:" + cfg.email;
    });
    document.querySelectorAll("[data-cfg-whatsapp-display]").forEach(function (el) {
      el.textContent = cfg.whatsappNumber;
    });
    document.querySelectorAll("[data-cfg-location]").forEach(function (el) {
      el.textContent = cfg.location;
    });
    document.querySelectorAll("[data-cfg-instagram]").forEach(function (el) {
      el.href = cfg.instagramUrl;
    });
    document.querySelectorAll("[data-cfg-facebook]").forEach(function (el) {
      el.href = cfg.facebookUrl;
    });
    var waHref = "https://wa.me/" + cfg.whatsappNumberIntl + "?text=" + encodeURIComponent(cfg.whatsappMessage);
    document.querySelectorAll("[data-cfg-whatsapp-link]").forEach(function (el) {
      el.href = waHref;
    });
  }

  /* ---------- Navbar scroll state ---------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mark active link
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var burger = document.querySelector(".burger");
    var menu = document.querySelector(".mobile-menu");
    if (!burger || !menu) return;
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll(".mobile-submenu-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sub = btn.nextElementSibling;
        sub.classList.toggle("is-open");
      });
    });
    menu.querySelectorAll("a:not(.mobile-submenu-toggle)").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        burger.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Hero reveal ---------- */
  function initHeroReveal() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    requestAnimationFrame(function () {
      hero.classList.add("is-ready");
    });
  }

  /* ---------- Lightweight canvas hero effect (no heavy 3D lib) ----------
     Draws slow-moving angular "lightning" line fragments with subtle
     mouse-parallax. Kept intentionally cheap: <60 lines, no dependencies. */
  function initHeroCanvas() {
    var holder = document.querySelector(".hero-bg");
    if (!holder || reduceMotion) return;
    var canvas = document.createElement("canvas");
    holder.prepend(canvas);
    var ctx = canvas.getContext("2d");
    if (!ctx) return; // some browsers/extensions block canvas 2D contexts; fail silently
    var w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    var lines = [];
    for (var i = 0; i < 14; i++) {
      lines.push({
        x: Math.random(),
        y: Math.random(),
        len: 60 + Math.random() * 180,
        angle: -0.35,
        speed: 0.02 + Math.random() * 0.05,
        opacity: 0.03 + Math.random() * 0.07
      });
    }

    function resize() {
      w = holder.clientWidth;
      h = holder.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5);
      targetY = (e.clientY / window.innerHeight - 0.5);
    });

    function draw() {
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;
      ctx.clearRect(0, 0, w, h);
      lines.forEach(function (l) {
        l.x += Math.cos(l.angle) * l.speed * 0.001;
        l.y += Math.sin(l.angle) * l.speed * 0.001 + 0.0004;
        if (l.y > 1.1) { l.y = -0.1; l.x = Math.random(); }
        var px = l.x * w + mouseX * 40;
        var py = l.y * h + mouseY * 24;
        ctx.strokeStyle = "rgba(255,255,255," + l.opacity + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(l.angle) * l.len, py + Math.sin(l.angle) * l.len);
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Gallery filter ---------- */
  function initGalleryFilter() {
    var filters = document.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(".gallery-item");
    if (!filters.length) return;
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var f = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var match = f === "all" || item.getAttribute("data-category") === f;
          item.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length) return;

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Close image viewer">&#10005;</button>' +
      '<button class="lightbox-prev" aria-label="Previous image">&#8592;</button>' +
      '<img src="" alt="">' +
      '<button class="lightbox-next" aria-label="Next image">&#8594;</button>' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(lb);

    var group = Array.prototype.slice.call(triggers);
    var current = 0;

    function open(index) {
      current = index;
      var t = group[current];
      lb.querySelector("img").src = t.getAttribute("data-lightbox");
      lb.querySelector("img").alt = t.getAttribute("data-caption") || "";
      lb.querySelector(".lightbox-caption").textContent = t.getAttribute("data-caption") || "";
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    function nav(dir) {
      current = (current + dir + group.length) % group.length;
      open(current);
    }

    group.forEach(function (t, i) {
      t.addEventListener("click", function () { open(i); });
      t.setAttribute("tabindex", "0");
      t.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });

    lb.querySelector(".lightbox-close").addEventListener("click", close);
    lb.querySelector(".lightbox-prev").addEventListener("click", function () { nav(-1); });
    lb.querySelector(".lightbox-next").addEventListener("click", function () { nav(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") nav(-1);
      if (e.key === "ArrowRight") nav(1);
    });
  }

  /* ---------- Quote form: dynamic Uniform Type + sport preselect ----------
     Uniform Type options are intentionally kept in one small object so
     they're easy to change later without touching any markup. */
  var UNIFORM_TYPES = {
    "Basketball": ["Jersey + Shorts", "Jersey Only", "Custom Request"],
    "American Football": ["Jersey + Pants", "Jersey Only", "Custom Request"],
    "Soccer": ["Jersey + Shorts", "Full Kit", "Custom Request"],
    "Ice Hockey": ["Jersey", "Jersey + Pants", "Custom Request"]
  };

  function initQuoteSportLogic() {
    var sportSelect = document.getElementById("q-sport");
    var uniformSelect = document.getElementById("q-uniform-type");
    if (!sportSelect || !uniformSelect) return;

    function populateUniformTypes(sport) {
      uniformSelect.innerHTML = "";
      var options = UNIFORM_TYPES[sport];
      if (!options) {
        var placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select a sport first";
        placeholder.selected = true;
        uniformSelect.appendChild(placeholder);
        return;
      }
      options.forEach(function (label, i) {
        var opt = document.createElement("option");
        opt.value = label;
        opt.textContent = label;
        if (i === 0) opt.selected = true;
        uniformSelect.appendChild(opt);
      });
    }

    sportSelect.addEventListener("change", function () {
      populateUniformTypes(sportSelect.value);
    });

    // Preselect sport from ?sport= query param (linked from product pages)
    var params = new URLSearchParams(window.location.search);
    var sportParam = params.get("sport");
    if (sportParam && UNIFORM_TYPES[sportParam]) {
      sportSelect.value = sportParam;
      populateUniformTypes(sportParam);
    }
  }

  /* ---------- Forms (Quote + Contact) via Formspree ---------- */
  var MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
  var ALLOWED_FILE_EXT = [".jpg", ".jpeg", ".png", ".pdf"];

  function validateFileField(input) {
    var wrap = input.closest(".form-field");
    if (!wrap || !input.files || !input.files.length) return true;
    var file = input.files[0];
    var ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    var okType = ALLOWED_FILE_EXT.indexOf(ext) !== -1;
    var okSize = file.size <= MAX_FILE_BYTES;
    var errEl = wrap.querySelector(".error-msg");
    if (!okType || !okSize) {
      wrap.classList.add("has-error");
      if (errEl) errEl.textContent = !okType
        ? "Please upload a JPG, PNG or PDF file."
        : "File is too large. Maximum size is 10MB.";
      return false;
    }
    wrap.classList.remove("has-error");
    return true;
  }

  function validateField(field) {
    var wrap = field.closest(".form-field");
    if (!wrap) return true;
    var valid = field.checkValidity();
    wrap.classList.toggle("has-error", !valid);
    return valid;
  }

  function initForm(formId, endpointKey, successTitle, successBody) {
    var form = document.getElementById(formId);
    if (!form) return;
    var endpoint = cfg[endpointKey];
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    var fileInput = form.querySelector('input[type="file"]');
    var fileDrop = form.querySelector(".file-drop");
    if (fileInput && fileDrop) {
      fileInput.addEventListener("change", function () {
        validateFileField(fileInput);
        if (fileInput.files && fileInput.files.length) {
          var names = Array.prototype.map.call(fileInput.files, function (f) { return f.name; }).join(", ");
          fileDrop.textContent = names;
          fileDrop.classList.add("has-file");
        } else {
          fileDrop.classList.remove("has-file");
        }
      });
    }

    form.querySelectorAll("input,select,textarea").forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot check
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      var fields = form.querySelectorAll("input,select,textarea");
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });
      if (fileInput && !validateFileField(fileInput)) allValid = false;
      if (!allValid) {
        status.className = "form-status is-visible is-error";
        status.innerHTML = "<h4>Check the form</h4><p>Please fill in all required fields correctly before submitting.</p>";
        status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        return;
      }

      if (!endpoint || endpoint.indexOf("YOUR_") === 0) {
        status.className = "form-status is-visible is-error";
        status.innerHTML = "<h4>Form not connected yet</h4><p>Add your Formspree endpoint in <code>config.js</code> to enable submissions.</p>";
        return;
      }

      form.classList.add("form-submitting");
      submitBtn.disabled = true;
      var originalLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending…';

      var formData = new FormData(form);

      fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            status.className = "form-status is-visible is-success";
            status.innerHTML = "<h4>" + successTitle + "</h4><p>" + successBody + "</p>";
            form.reset();
            if (fileDrop) { fileDrop.classList.remove("has-file"); fileDrop.textContent = fileDrop.getAttribute("data-default-text") || fileDrop.textContent; }
          } else {
            return response.json().then(function (data) {
              throw new Error((data && data.errors && data.errors.map(function (er) { return er.message; }).join(", ")) || "Submission failed.");
            });
          }
        })
        .catch(function (err) {
          status.className = "form-status is-visible is-error";
          status.innerHTML = "<h4>Something went wrong</h4><p>" + (err.message || "Please try again, or reach us directly on WhatsApp or email.") + "</p>";
        })
        .finally(function () {
          form.classList.remove("form-submitting");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalLabel;
          status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    populateConfig();
    initNav();
    initMobileMenu();
    initHeroReveal();
    initHeroCanvas();
    initReveal();
    initGalleryFilter();
    initLightbox();
    initQuoteSportLogic();
    initForm("quote-form", "formspreeQuoteEndpoint", "Quote Request Received", "Thank you. Your requirements have been received. We\u2019ll review your request and get back to you.");
    initForm("contact-form", "formspreeContactEndpoint", "Message Sent", "Thank you for contacting Klipto Sports. We\u2019ll get back to you soon.");
  });
})();
