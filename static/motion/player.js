/* CYW motion player: plays <canvas data-scene="..."> elements while they are on screen.
   Reduced-motion users get a single still frame (the scene's posterTime). */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setup(canvas) {
    var scene = (window.CYWScenes || {})[canvas.dataset.scene];
    if (!scene) return;
    var ctx = canvas.getContext("2d");
    var running = false, start = null, raf = 0;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth, h = Math.round(w * scene.height / scene.width);
      canvas.style.height = h + "px";
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    }
    function frame(now) {
      if (start === null) start = now;
      scene.draw(ctx, (now - start) / 1000, canvas.width, canvas.height);
      if (running) raf = requestAnimationFrame(frame);
    }
    function still() { scene.draw(ctx, scene.posterTime || 0, canvas.width, canvas.height); }

    size();
    canvas.setAttribute("role", "img");
    if (scene.alt && !canvas.getAttribute("aria-label")) canvas.setAttribute("aria-label", scene.alt);
    var ready = (document.fonts && document.fonts.ready) || Promise.resolve();
    ready.then(function () {
      canvas.closest(".motion") && canvas.closest(".motion").classList.add("is-live");
      if (reduce) { still(); return; }
      still();
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !running) { running = true; start = null; raf = requestAnimationFrame(frame); }
          else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
        });
      }, { threshold: 0.25 });
      io.observe(canvas);
    });
    window.addEventListener("resize", function () { size(); if (!running) still(); });
  }

  function init() { document.querySelectorAll("canvas[data-scene]").forEach(setup); }
  // Deferred scene scripts load after this one; wait for all of them.
  if (document.readyState === "complete") init(); else document.addEventListener("DOMContentLoaded", init);
})();
