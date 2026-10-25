// Premium essay layout: reading progress + scroll reveal. Progressive enhancement only.
(function () {
  var bar = document.querySelector(".essay-progress span");
  var body = document.querySelector(".essay-body");
  if (bar && body) {
    var ticking = false;
    var update = function () {
      var r = body.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var p = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
      bar.style.setProperty("--p", p.toFixed(4));
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // Measure SVG strokes so line-drawing animations know their length.
  document.querySelectorAll(".reveal .draw").forEach(function (el) {
    try { el.style.setProperty("--len", Math.ceil(el.getTotalLength()) + 1); } catch (e) {}
  });

  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { io.observe(el); });
})();
