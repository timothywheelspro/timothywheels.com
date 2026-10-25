/* Scene: The 3am Signal.
   The noise floor drops, every node broadcasts its state, the route lights up,
   a node goes down and the network reroutes. Pure draw(ctx, t): no hidden state. */
(function () {
  var C = { bg: "#0a0c0f", cyan: "#00e5c8", white: "#ffffff", dim: "#96a0a8" };
  var VW = 1600, VH = 900, DUR = 15;
  var DISP = '"Bebas Neue", Impact, sans-serif', MONO = '"Space Mono", ui-monospace, monospace';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (k) { k = clamp(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  var fade = function (t, a, b, c, d) { return clamp((t - a) / (b - a), 0, 1) * (1 - clamp((t - c) / (d - c), 0, 1)); };

  var N = {
    YOU: [190, 560], A: [420, 400], G: [430, 730], H: [680, 260], B: [660, 560],
    C: [920, 400], D: [910, 720], F: [1170, 260], E: [1170, 580], NEXT: [1420, 440]
  };
  var NAMES = Object.keys(N);
  var EDGES = [["YOU", "A"], ["YOU", "G"], ["A", "H"], ["A", "B"], ["G", "B"], ["G", "D"], ["H", "C"], ["H", "F"],
               ["B", "C"], ["B", "D"], ["C", "F"], ["C", "E"], ["D", "E"], ["F", "NEXT"], ["E", "NEXT"]];
  var ROUTE1 = ["YOU", "A", "B", "C", "E", "NEXT"];
  var ROUTE2 = ["YOU", "A", "B", "D", "E", "NEXT"];
  var DOWN = "C", T_DOWN = 9.3, T_R1 = 5.9, T_R2 = 9.9, SEG = 0.34;

  // Deterministic pseudo-random noise field.
  function rnd(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  var NOISE = [];
  for (var i = 0; i < 160; i++) NOISE.push({ x: rnd(i) * VW, y: 170 + rnd(i + 999) * 700, s: 2 + rnd(i + 77) * 4, f: 3 + rnd(i + 5) * 9, ph: rnd(i + 3) * 6.28 });
  var PINGS = [];
  for (i = 0; i < 26; i++) PINGS.push({ x: 80 + rnd(i + 400) * 1440, y: 200 + rnd(i + 500) * 620, t0: rnd(i + 600) * 3.2, w: 90 + rnd(i + 700) * 90 });
  function noiseLevel(t) { return 1 - 0.88 * ease(t / 3.4); }

  function routeLen(r) { var L = 0; for (var k = 0; k < r.length - 1; k++) L += dist(N[r[k]], N[r[k + 1]]); return L; }
  function dist(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
  function along(r, u) {
    var L = routeLen(r) * u;
    for (var k = 0; k < r.length - 1; k++) {
      var a = N[r[k]], b = N[r[k + 1]], d = dist(a, b);
      if (L <= d) return [a[0] + (b[0] - a[0]) * L / d, a[1] + (b[1] - a[1]) * L / d];
      L -= d;
    }
    return N[r[r.length - 1]];
  }
  function onRoute(r, a, b) {
    for (var k = 0; k < r.length - 1; k++) if ((r[k] === a && r[k + 1] === b) || (r[k] === b && r[k + 1] === a)) return k;
    return -1;
  }

  function label(ctx, txt, x, y, col, a, align, size) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col;
    ctx.font = (size || 18) + "px " + MONO; ctx.textAlign = align || "center";
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = "3px";
    ctx.fillText(txt, x, y); ctx.restore();
  }

  function drawRoute(ctx, r, tStart, alpha) {
    ctx.save();
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.shadowColor = C.cyan; ctx.shadowBlur = 22; ctx.globalAlpha *= alpha;
    for (var k = 0; k < r.length - 1; k++) {
      var p = clamp((tStart - k * SEG) / SEG, 0, 1);
      if (p <= 0) break;
      var a = N[r[k]], b = N[r[k + 1]];
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p); ctx.stroke();
    }
    ctx.restore();
  }

  function packets(ctx, r, from, until, t) {
    var done = from + (r.length - 1) * SEG;
    if (t < done) return;
    for (var m = 0; m < 30; m++) {
      var born = done + m * 0.42;
      if (born > until) break;
      var u = (t - born) / 1.5;
      if (u <= 0 || u >= 1 || t > until) continue;
      var p = along(r, u);
      ctx.save(); ctx.fillStyle = C.white; ctx.shadowColor = C.cyan; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }

  function caption(ctx, t) {
    [["3AM. THE NOISE FLOOR DROPS.", 0.2, 0.8, 3.0, 3.4, C.white],
     ["EVERY NODE BROADCASTS ITS STATE.", 3.5, 4.0, 5.6, 6.0, C.white],
     ["THE ROUTE LIGHTS UP.", 6.1, 6.6, 9.0, 9.3, C.cyan],
     ["A NODE GOES DOWN. IT REROUTES.", 9.4, 9.9, 12.0, 12.4, C.white],
     ["AWARENESS IS THE CAPACITY TO ROUTE THROUGH IT.", 12.5, 13.0, 14.4, 14.9, C.cyan]
    ].forEach(function (L) {
      var a = fade(t, L[1], L[2], L[3], L[4]);
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = L[5];
      ctx.font = "76px " + DISP; ctx.fillText(L[0], 72, 128 + (1 - a) * 14); ctx.restore();
    });
  }

  function draw(ctx, t, W, H, opts) {
    opts = opts || {};
    t = ((t % DUR) + DUR) % DUR;
    ctx.save();
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    var s = Math.min(W / VW, H / VH);
    ctx.translate((W - VW * s) / 2, (H - VH * s) / 2); ctx.scale(s, s);

    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
    for (var gx = 0; gx <= VW; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, VH); ctx.stroke(); }
    for (var gy = 0; gy <= VH; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(VW, gy); ctx.stroke(); }

    var sceneA = fade(t, 0, 0.5, 14.4, 15);
    ctx.globalAlpha = sceneA;
    var nl = noiseLevel(t);

    // Noise: static and notification pings, loud at first, then quiet.
    NOISE.forEach(function (p) {
      var a = nl * (0.25 + 0.75 * Math.abs(Math.sin(t * p.f + p.ph)));
      ctx.fillStyle = "rgba(255,255,255," + (0.5 * a).toFixed(3) + ")";
      ctx.fillRect(p.x, p.y, p.s, p.s);
    });
    PINGS.forEach(function (p) {
      var a = fade(t, p.t0, p.t0 + 0.15, p.t0 + 0.9, p.t0 + 1.3) * nl;
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = sceneA * a * 0.8;
      ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, 30);
      ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(p.x + 15, p.y + 15, 5, 0, 6.29); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(p.x + 30, p.y + 12, p.w - 42, 6);
      ctx.restore();
    });

    var downA = ease((t - T_DOWN) / 0.4);

    // Edges
    EDGES.forEach(function (e) {
      var a = N[e[0]], b = N[e[1]];
      var touchesDown = e[0] === DOWN || e[1] === DOWN;
      ctx.strokeStyle = "rgba(255,255,255," + (touchesDown ? 0.28 - 0.2 * downA : 0.28) + ")";
      ctx.lineWidth = 2;
      if (touchesDown && downA > 0) ctx.setLineDash([6, 10]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.setLineDash([]);
    });

    // Routes
    if (t > T_R1) drawRoute(ctx, ROUTE1, t - T_R1, 1 - ease((t - T_DOWN) / 0.5));
    if (t > T_R2) drawRoute(ctx, ROUTE2, t - T_R2, 1);
    packets(ctx, ROUTE1, T_R1, T_DOWN, t);
    packets(ctx, ROUTE2, T_R2, 14.6, t);

    // Nodes broadcasting state
    NAMES.forEach(function (n, j) {
      var p = N[n];
      var isDown = n === DOWN && downA > 0;
      var t0 = 3.4 + j * 0.16;
      for (var w = 0; w < 5; w++) {
        var tw = t - (t0 + w * 2.2);
        if (tw < 0 || tw > 1.3 || isDown) continue;
        var k = tw / 1.3;
        ctx.save(); ctx.strokeStyle = C.cyan; ctx.globalAlpha = sceneA * (1 - k) * (w === 0 ? 0.9 : 0.35); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p[0], p[1], 20 + k * 70, 0, 6.29); ctx.stroke(); ctx.restore();
      }
      var awake = clamp((t - t0) / 0.3, 0, 1);
      var end = n === "YOU" || n === "NEXT";
      var r = end ? 26 : 18;
      ctx.save();
      ctx.fillStyle = C.bg;
      ctx.strokeStyle = isDown ? "rgba(255,255,255,0.35)" : (awake > 0 ? C.cyan : "rgba(255,255,255,0.6)");
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 6.29); ctx.fill(); ctx.stroke();
      if (end && awake > 0) { ctx.fillStyle = C.cyan; ctx.globalAlpha *= awake; ctx.beginPath(); ctx.arc(p[0], p[1], r - 9, 0, 6.29); ctx.fill(); }
      if (isDown) {
        ctx.strokeStyle = C.white; ctx.globalAlpha = sceneA * downA; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(p[0] - 11, p[1] - 11); ctx.lineTo(p[0] + 11, p[1] + 11);
        ctx.moveTo(p[0] + 11, p[1] - 11); ctx.lineTo(p[0] - 11, p[1] + 11); ctx.stroke();
      }
      ctx.restore();
    });
    label(ctx, "YOU", N.YOU[0], N.YOU[1] + 62, C.white, 1);
    label(ctx, "NEXT MOVE", N.NEXT[0], N.NEXT[1] + 62, C.white, 1);
    label(ctx, "NODE DOWN", N[DOWN][0], N[DOWN][1] - 40, C.dim, downA * fade(t, T_DOWN, T_DOWN + 0.3, 14, 14.5));

    // Noise floor meter + clock
    label(ctx, "NOISE FLOOR", 72, 850, C.dim, 1, "left", 16);
    ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fillRect(250, 838, 300, 12);
    ctx.fillStyle = nl > 0.4 ? C.white : C.cyan; ctx.fillRect(250, 838, 300 * nl, 12);
    var mins = Math.floor(clamp(t / 3.2, 0, 1) * 2);
    label(ctx, mins >= 2 ? "03:00" : "02:5" + (8 + mins), VW - 72, 850, C.cyan, 1, "right", 28);

    ctx.globalAlpha = 1;
    if (!opts.noCaption) caption(ctx, t);
    ctx.restore();
  }

  (window.CYWScenes = window.CYWScenes || {})["three-am-signal"] = {
    duration: DUR, width: VW, height: VH, posterTime: 8.2, draw: draw, title: ["THE 3AM", "SIGNAL"],
    alt: "Animation: static and notifications fade as the noise floor drops, network nodes broadcast their state, a route from you to your next move lights up, one node goes down and the route reroutes around it."
  };
})();
