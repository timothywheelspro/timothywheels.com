/* Scene: You're Still the Bottleneck.
   Eight content lanes jam at a single review node, then a tiered governance layer opens
   and the queue drains. The queue is simulated once at load from a fixed schedule,
   so draw(ctx, t) stays a pure function of t. */
(function () {
  var C = { bg: "#0a0c0f", cyan: "#00e5c8", white: "#ffffff", dim: "#96a0a8" };
  var VW = 1600, VH = 900, DUR = 14;
  var DISP = '"Bebas Neue", Impact, sans-serif', MONO = '"Space Mono", ui-monospace, monospace';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (k) { k = clamp(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  var fade = function (t, a, b, c, d) { return clamp((t - a) / (b - a), 0, 1) * (1 - clamp((t - c) / (d - c), 0, 1)); };

  var LANES = 8, LX0 = 60, LSTOP = 800, SPEED = 300, GAP = 42;
  var laneY = function (l) { return 230 + l * 82; };
  var T_SWITCH = 6.4;
  var SERVERS = {
    you:   { x: 1000, y: 517, svc: 1.0, name: "YOU" },
    ships: { x: 1000, y: 270, svc: 0.12, name: "SHIPS" },
    peer:  { x: 1000, y: 764, svc: 0.24, name: "PEER REVIEW" }
  };
  var OUT_X = 1500;

  // Arrivals, then a FIFO simulation: one server before the switch, three tiers after.
  var items = [];
  (function () {
    var i = 0;
    for (var t = 0.3; t < 9.4; t += (t < T_SWITCH ? 0.13 : 0.3)) {
      var lane = (i * 3) % LANES;
      items.push({ i: i, lane: lane, born: t, arrive: t + (LSTOP - LX0) / SPEED, tier: [0, 1, 2, 3, 4, 5].indexOf(i % 10) >= 0 ? "ships" : (i % 10 === 9 ? "you" : "peer") });
      i++;
    }
    var free = { you: 0, ships: T_SWITCH, peer: T_SWITCH };
    items.slice().sort(function (a, b) { return a.arrive - b.arrive; }).forEach(function (it) {
      var start = Math.max(it.arrive, free.you);
      if (start < T_SWITCH) { it.server = "you"; }
      else { it.server = it.tier; start = Math.max(it.arrive, free[it.server], T_SWITCH + 0.2); }
      it.start = start; it.end = start + SERVERS[it.server].svc;
      free[it.server] = it.end;
    });
  })();

  function waitingAhead(it, t) {
    // How many items in the same lane are still waiting in front of this one (fractional while one leaves).
    var k = 0;
    items.forEach(function (o) {
      if (o.lane !== it.lane || o.arrive >= it.arrive || o === it) return;
      if (t < o.start) k += 1;
      else if (t < o.start + 0.3) k += 1 - ease((t - o.start) / 0.3);
    });
    return k;
  }

  function itemPos(it, t) {
    var tau = t - it.born;
    if (tau < 0) return null;
    var y = laneY(it.lane);
    if (t < it.start) {
      var x = Math.min(LX0 + SPEED * tau, LSTOP - waitingAhead(it, t) * GAP);
      return { x: x, y: y, live: false, a: 1 };
    }
    var S = SERVERS[it.server];
    var k1 = ease((t - it.start) / 0.35);
    if (t < it.start + 0.35) return { x: LSTOP + (S.x - LSTOP) * k1, y: y + (S.y - y) * k1, live: false, a: 1 };
    var k2 = (t - it.start - 0.35) / 0.9;
    if (k2 >= 1) return null;
    return { x: S.x + (OUT_X - S.x) * ease(k2), y: S.y, live: true, a: 1 - clamp((k2 - 0.7) / 0.3, 0, 1) };
  }

  function doc(ctx, x, y, live, a) {
    ctx.save(); ctx.globalAlpha *= a;
    if (live) { ctx.fillStyle = C.cyan; ctx.fillRect(x - 17, y - 12, 34, 24); }
    else {
      ctx.fillStyle = C.bg; ctx.fillRect(x - 17, y - 12, 34, 24);
      ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 2; ctx.strokeRect(x - 17, y - 12, 34, 24);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(x - 10, y - 5, 20, 3); ctx.fillRect(x - 10, y + 2, 14, 3);
    }
    ctx.restore();
  }

  function label(ctx, txt, x, y, col, a, align, size) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col;
    ctx.font = (size || 18) + "px " + MONO; ctx.textAlign = align || "center";
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = "3px";
    ctx.fillText(txt, x, y); ctx.restore();
  }

  function server(ctx, S, a, glow, sub) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = glow ? C.cyan : C.bg; ctx.strokeStyle = C.cyan; ctx.lineWidth = 4;
    if (glow) { ctx.shadowColor = C.cyan; ctx.shadowBlur = 24; }
    ctx.beginPath(); ctx.arc(S.x, S.y, 46, 0, 6.29); ctx.fill(); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = glow ? C.bg : C.cyan; ctx.font = "26px " + DISP; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(S.name === "YOU" ? "YOU" : (S.name === "SHIPS" ? "SHIP" : "PEER"), S.x, S.y + 1);
    ctx.restore();
    if (sub) label(ctx, sub, S.x, S.y - 62, C.dim, a, "center", 15);
  }

  function caption(ctx, t) {
    [["EVERY PIECE WAITS ON YOU.", 0.2, 0.7, 3.0, 3.4, C.white],
     ["THE QUEUE COMPOUNDS.", 3.5, 4.0, 6.1, 6.4, C.white],
     ["BUILD THE REVIEWER, NOT JUST THE REVIEW.", 6.5, 7.0, 10.2, 10.6, C.cyan],
     ["FROM PRODUCTION LINE TO ENGINE.", 10.7, 11.2, 13.3, 13.8, C.cyan]
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

    var sceneA = fade(t, 0, 0.5, 13.4, 14);
    ctx.globalAlpha = sceneA;
    var gov = ease((t - (T_SWITCH - 0.5)) / 0.8);

    // Lanes and the merge into the review layer.
    for (var l = 0; l < LANES; l++) {
      var y = laneY(l);
      ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(LX0 - 20, y); ctx.lineTo(LSTOP + 20, y); ctx.stroke();
      ["you", "ships", "peer"].forEach(function (k) {
        var S = SERVERS[k], a = k === "you" ? 1 : gov;
        if (a <= 0) return;
        ctx.strokeStyle = "rgba(0,229,200," + (0.18 * a).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(LSTOP + 20, y); ctx.lineTo(S.x - 46, S.y); ctx.stroke();
      });
    }
    label(ctx, "CONTENT LANES", LX0 - 20, 196, C.dim, 1, "left", 15);

    // Output rail
    ["you", "ships", "peer"].forEach(function (k) {
      var S = SERVERS[k], a = k === "you" ? 1 : gov;
      ctx.strokeStyle = "rgba(255,255,255," + (0.25 * a).toFixed(3) + ")"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(S.x + 46, S.y); ctx.lineTo(OUT_X, S.y); ctx.stroke();
    });
    ctx.fillStyle = "rgba(0,229,200,0.12)"; ctx.fillRect(OUT_X, 230, 60, 576);
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 3; ctx.strokeRect(OUT_X, 230, 60, 576);
    ctx.save(); ctx.translate(OUT_X + 38, 518); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = C.cyan; ctx.font = "30px " + DISP; ctx.textAlign = "center"; ctx.fillText("LIVE", 0, 0); ctx.restore();

    // Items
    var waiting = 0, live = 0;
    items.forEach(function (it) {
      if (t >= it.arrive && t < it.start) waiting++;
      if (t >= it.end + 1.0) live++;
      var p = itemPos(it, t);
      if (p) doc(ctx, p.x, p.y, p.live, p.a);
    });

    // Review layer
    server(ctx, SERVERS.you, 1, false, gov > 0.5 ? "ESCALATES" : null);
    server(ctx, SERVERS.ships, gov, false, "SHIPS WITHOUT REVIEW");
    server(ctx, SERVERS.peer, gov, false, "PEER REVIEW");
    label(ctx, "GOVERNANCE LAYER", SERVERS.you.x, 176, C.cyan, gov, "center", 15);

    // Counters
    label(ctx, "IN QUEUE", 72, 852, C.dim, 1, "left", 15);
    ctx.save(); ctx.font = "44px " + DISP; ctx.fillStyle = waiting > 12 ? C.white : C.cyan; ctx.fillText(String(waiting), 200, 862); ctx.restore();
    label(ctx, "LIVE", 330, 852, C.dim, 1, "left", 15);
    ctx.save(); ctx.font = "44px " + DISP; ctx.fillStyle = C.cyan; ctx.fillText(String(live), 400, 862); ctx.restore();

    ctx.globalAlpha = 1;
    if (!opts.noCaption) caption(ctx, t);
    ctx.restore();
  }

  (window.CYWScenes = window.CYWScenes || {})["bottleneck"] = {
    duration: DUR, width: VW, height: VH, posterTime: 5.9, draw: draw, title: ["YOU'RE STILL THE", "BOTTLENECK"],
    alt: "Animation: content from eight lanes jams in a queue at a single review node labeled you. A governance layer opens two more paths, ship without review and peer review, and the queue drains to live."
  };
})();
