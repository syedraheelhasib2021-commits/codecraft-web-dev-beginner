/* CodeCraft — vanilla JavaScript (no libraries)
   1 Mobile menu · 2 Dropdown menus · 3 Header shadow, progress bar, back-to-top
   4 Scroll reveal + stagger · 5 Count-up numbers · 6 Code copy buttons
   7 Card spotlight · 8 Roadmap progress tracker · 9 Project filter · 10 Demo contact form */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktopMq = window.matchMedia("(min-width: 1061px)");
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // 1. Mobile menu ---------------------------------------------------
  var toggle = document.querySelector(".nav-toggle");
  var list = document.getElementById("primary-nav");
  function closeMobileMenu() {
    if (!list || !toggle) return;
    list.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  if (toggle && list) {
    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  // 2. Dropdown menus: open on hover (desktop), click/tap, or keyboard --
  var dropdowns = $all(".has-dd");
  function setDd(dd, open) {
    dd.classList.toggle("open", open);
    dd.querySelector(".dd-toggle").setAttribute("aria-expanded", String(open));
    if (!open) dd._pinned = false;
  }
  function closeAllDd(except) {
    dropdowns.forEach(function (d) { if (d !== except) setDd(d, false); });
  }
  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector(".dd-toggle");
    var timer;
    dd._pinned = false;
    dd.addEventListener("mouseenter", function () {
      if (!desktopMq.matches) return;
      clearTimeout(timer);
      closeAllDd(dd);
      setDd(dd, true);
    });
    dd.addEventListener("mouseleave", function () {
      if (!desktopMq.matches || dd._pinned) return;
      timer = setTimeout(function () { setDd(dd, false); }, 160);
    });
    btn.addEventListener("click", function () {
      closeAllDd(dd);
      if (!dd.classList.contains("open")) { setDd(dd, true); dd._pinned = true; }
      else if (!dd._pinned && desktopMq.matches) { dd._pinned = true; }   // opened by hover: keep open
      else { setDd(dd, false); }
    });
    dd.addEventListener("focusout", function (e) {
      if (e.relatedTarget && !dd.contains(e.relatedTarget)) setDd(dd, false);
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-dd")) closeAllDd();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openDd = dropdowns.filter(function (d) { return d.classList.contains("open"); })[0];
    closeAllDd();
    if (openDd) openDd.querySelector(".dd-toggle").focus();
    else if (list && list.classList.contains("open")) { closeMobileMenu(); if (toggle) toggle.focus(); }
  });

  // 3. Header shadow, scroll progress bar, back-to-top ------------------
  var header = document.querySelector(".site-header");
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  var topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML = "&uarr;";
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  document.body.appendChild(topBtn);

  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    if (header) header.classList.toggle("scrolled", y > 8);
    topBtn.classList.toggle("show", y > 600);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // 4. Scroll reveal with staggered delays ------------------------------
  var revealSel = ".section-head, .card, .learn-box, .demo-pair > *, .code-window, .cta-banner, .steps > li, " +
    ".timeline > li, .callout, details.faq, .stat, .mini-roadmap li, .table-wrap, .form-card, .toc, .rm-progress";
  var targets = $all(revealSel).filter(function (el) {
    // skip hero (animated by CSS) and elements nested inside another target
    if (el.closest(".hero") || el.closest(".dd-menu")) return false;
    var p = el.parentElement;
    return !(p && p.closest(revealSel));
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    var counts = new Map();
    targets.forEach(function (el) {
      var parent = el.parentElement;
      var i = counts.get(parent) || 0;
      counts.set(parent, i + 1);
      el.style.setProperty("--d", Math.min(i, 5) * 0.09 + "s");
      el.classList.add("reveal");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        el.classList.add("in", "seen");
        // Remove helper classes after the animation so normal hover transitions return
        setTimeout(function () {
          el.classList.remove("reveal", "in");
          el.style.removeProperty("--d");
        }, 1200);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("seen"); });
  }

  // 5. Count-up numbers (real content counts only) -----------------------
  var counters = $all("[data-count]");
  function runCount(el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    if (reduceMotion) { el.textContent = end; return; }
    var start = null, dur = 1300;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { cio.unobserve(en.target); runCount(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
  }

  // 6. Copy buttons on code windows ---------------------------------------
  $all(".code-window").forEach(function (win) {
    var barEl = win.querySelector(".code-bar");
    var code = win.querySelector("pre");
    if (!barEl || !code) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", function () {
      var text = code.innerText;
      function done(ok) {
        btn.textContent = ok ? "Copied!" : "Press Ctrl+C";
        btn.classList.toggle("copied", ok);
        setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1800);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      }
    });
    barEl.appendChild(btn);
  });

  // 7. Card spotlight follows the pointer ----------------------------------
  document.addEventListener("pointermove", function (e) {
    var card = e.target.closest && e.target.closest(".card");
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  // 8. Roadmap progress tracker (saved in this browser only) ----------------
  var tl = document.querySelector(".timeline");
  if (tl) {
    var KEY = "codecraft-roadmap-done";
    var done = [];
    try { done = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (err) { done = []; }
    var items = $all(":scope > li", tl);
    var panel = document.createElement("div");
    panel.className = "rm-progress";
    panel.innerHTML =
      '<p class="rm-text"><strong id="rm-count"></strong><span>Tick each stage when you finish it. Progress is saved in this browser only.</span></p>' +
      '<div class="rm-bar" role="progressbar" aria-label="Roadmap progress" aria-valuemin="0" aria-valuemax="' + items.length + '"><span></span></div>' +
      '<button type="button" class="btn btn-secondary no-arrow rm-reset">Reset</button>';
    tl.parentNode.insertBefore(panel, tl);
    var countEl = panel.querySelector("#rm-count");
    var fill = panel.querySelector(".rm-bar span");
    var meter = panel.querySelector(".rm-bar");
    function save() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (err) { /* storage blocked: ignore */ } }
    function render() {
      items.forEach(function (li, i) {
        var on = done.indexOf(i) > -1;
        li.classList.toggle("done", on);
        li.querySelector(".done-btn").setAttribute("aria-pressed", String(on));
        li.querySelector(".done-label").textContent = on ? "Completed" : "Mark as done";
      });
      countEl.textContent = done.length + " of " + items.length + " stages complete";
      fill.style.width = (done.length / items.length * 100) + "%";
      meter.setAttribute("aria-valuenow", String(done.length));
    }
    items.forEach(function (li, i) {
      var card = li.querySelector(".card");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "done-btn";
      b.innerHTML = '<span class="tick" aria-hidden="true"></span><span class="done-label">Mark as done</span>';
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        var idx = done.indexOf(i);
        if (idx > -1) done.splice(idx, 1); else done.push(i);
        save(); render();
      });
      card.appendChild(b);
    });
    panel.querySelector(".rm-reset").addEventListener("click", function () { done = []; save(); render(); });
    render();
  }

  // 9. Project difficulty filter ---------------------------------------------
  var filterBar = document.querySelector(".filters");
  var grid = document.getElementById("project-grid");
  if (filterBar && grid) {
    var cards = $all(".project-card", grid);
    var status = document.getElementById("filter-status");
    cards.forEach(function (c) { c.setAttribute("data-level", c.querySelector(".badge.beginner") ? "easy" : "medium"); });
    filterBar.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      $all(".chip", filterBar).forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      var f = chip.getAttribute("data-filter"), shown = 0;
      cards.forEach(function (c) {
        var match = f === "all" || c.getAttribute("data-level") === f;
        c.classList.toggle("is-hidden", !match);
        c.classList.remove("pop");
        if (match) { shown++; void c.offsetWidth; if (!reduceMotion) c.classList.add("pop"); }
      });
      if (status) status.textContent = "Showing " + shown + " of " + cards.length + " projects";
    });
  }

  // 10. Contact form (demonstration only: nothing is sent) ----------------------
  var form = document.getElementById("contact-form");
  if (!form) return;
  var formStatus = document.getElementById("form-status");

  function check(field) {
    var input = field.querySelector("input, select, textarea");
    var ok = input.checkValidity();
    field.classList.remove("invalid");
    if (!ok) { void field.offsetWidth; field.classList.add("invalid"); }
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  }

  var fields = $all(".field", form);
  fields.forEach(function (f) {
    var input = f.querySelector("input, select, textarea");
    input.addEventListener("blur", function () { check(f); });
    input.addEventListener("input", function () { if (f.classList.contains("invalid")) check(f); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var allOk = true, firstBad = null;
    fields.forEach(function (f) {
      if (!check(f)) {
        allOk = false;
        if (!firstBad) firstBad = f.querySelector("input, select, textarea");
      }
    });
    formStatus.classList.remove("show");
    void formStatus.offsetWidth;
    formStatus.classList.add("show");
    if (!allOk) {
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      firstBad.focus();
      return;
    }
    formStatus.textContent = "Demonstration only: your form passed validation, but this site has no backend, so nothing was sent or stored.";
    form.reset();
  });
})();
