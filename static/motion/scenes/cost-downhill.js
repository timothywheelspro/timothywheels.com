/* Scene: Cost Runs Downhill.
   Cost rolls off the high ground, buries the houses on the low ground,
   then a culvert opens and routes it somewhere else.
   Deterministic: draw(ctx, t, w, h, opts) renders frame t (seconds) with no hidden state,
   so the same code plays live on the blog and renders frame-by-frame for video export. */
(function () {
  var C = { bg: "#0a0c0f", cyan: "#00e5c8", white: "#ffffff", dim: "#96a0a8" };
  var VW = 1600, VH = 900, DUR = 14;
  var DISP = '"Bebas Neue", Impact, sans-serif', MONO = '"Space Mono", ui-monospace, monospace';

  // Ground: plateau, slope, low ground.
  var G = [[0, 330], [420, 330], [1060, 690], [1600, 700]];
  var R = 13; // token radius
  var JX = 700; // culvert junction x on the slope

  function groundY(x) {
    for (var i = 0; i < G.length - 1; i++) {
      var a = G[i], b = G[i + 1];
      if (x >= a[0] && x <= b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
    return G[G.length - 1][1];
  }
  var slopeAng = Math.atan2(690 - 330, 1060 - 420);
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (k) { k = clamp(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  var easeOut = function (k) { k = clamp(k, 0, 1); return 1 - Math.pow(1 - k, 3); };
  var fade = function (t, a, b, c, d) { return clamp((t - a) / (b - a), 0, 1) * (1 - clamp((t - c) / (d - c), 0, 1)); };

  // Token schedule: before the culvert they pile up; after, they divert.
  var tokens = [];
  (function () {
    var t, i = 0;
    for (t = 0.5; t < 7.0; t += 0.11) tokens.push({ born: t, divert: false, i: i++ });
    for (t = 7.7; t < 10.8; t += 0.24) tokens.push({ born: t, divert: true, i: i++ });
  })();
  var pileCount = tokens.filter(function (k) { return !k.divert; }).length;

  // Slots: the pile on the low ground, the tank under the culvert.
  function pileSlot(n) {
    var perRow = 13, row = Math.floor(n / perRow), col = n % perRow;
    var x = 1100 + col * 25 + (row % 2) * 12;
    return [x, groundY(x) - R - row * 23];
  }
  var TANK = { x: 600, y: 690, w: 310, h: 160 };
  function tankSlot(n) {
    var perRow = 12, row = Math.floor(n / perRow), col = n % perRow;
    return [TANK.x + 20 + col * 24 + (row % 2) * 6, TANK.y + TANK.h - R - 4 - row * 24];
  }

  // Position along the roll: plateau start -> down the slope -> settle.
  var X0 = 380, V0 = 140, A = 820;
  function rollX(tau) { return X0 + V0 * tau + 0.5 * A * tau * tau; }
  function tauAt(x) { return (-V0 + Math.sqrt(V0 * V0 + 2 * A * (x - X0))) / A; }
  var TBOTTOM = tauAt(1060), TJ = tauAt(JX);

  function tokenPos(k, t) {
    var tau = t - k.born;
    if (tau < 0) return null;
    var p, rot;
    if (!k.divert) {
      var slot = pileSlot(k.i);
      if (tau < TBOTTOM) {
        var x = rollX(tau);
        p = [x, groundY(x) - R]; rot = (x - X0) / R;
      } else {
        var u = easeOut((tau - TBOTTOM) / 0.55);
        var bx = 1060 + (slot[0] - 1060) * u;
        var lift = Math.sin(u * Math.PI) * 26;
        p = [bx, groundY(1060) - R + (slot[1] - (groundY(1060) - R)) * u - lift];
        rot = (1060 - X0) / R + (bx - 1060) / R;
      }
      // After the culvert opens, the pile drains into the tank.
      var drainStart = 8.1 + (pileCount - 1 - k.i) * 0.035;
      if (t > drainStart) {
        var d = ease((t - drainStart) / 1.1);
        var tgt = tankSlot(k.i);
        var cx = (p[0] + tgt[0]) / 2, cy = Math.min(p[1], tgt[1]) - 220;
        var q = 1 - d;
        p = [q * q * p[0] + 2 * q * d * cx + d * d * tgt[0], q * q * p[1] + 2 * q * d * cy + d * d * tgt[1]];
      }
      return { x: p[0], y: p[1], rot: rot };
    }
    // Diverted: roll to the junction, drop down the culvert, settle in the tank.
    if (tau < TJ) {
      var xj = rollX(tau);
      return { x: xj, y: groundY(xj) - R, rot: (xj - X0) / R };
    }
    var slot2 = tankSlot(k.i);
    var v = easeOut((tau - TJ) / 0.7);
    var sx = JX, sy = groundY(JX) - R;
    var mx = JX + 30, my = TANK.y - 30;
    var w = 1 - v;
    return {
      x: w * w * sx + 2 * w * v * mx + v * v * slot2[0],
      y: w * w * sy + 2 * w * v * my + v * v * slot2[1],
      rot: (JX - X0) / R + v * 6
    };
  }

  function coin(ctx, x, y, rot, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = C.cyan;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg;
    ctx.font = "20px " + DISP; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("$", 0, 1.5);
    ctx.restore();
  }

  function house(ctx, x, base, hidden) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255," + (0.85 - hidden * 0.5) + ")";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 26, base); ctx.lineTo(x - 26, base - 34); ctx.lineTo(x, base - 58); ctx.lineTo(x + 26, base - 34); ctx.lineTo(x + 26, base);
    ctx.stroke();
    ctx.strokeRect(x - 7, base - 20, 14, 20);
    ctx.restore();
  }

  function datacenter(ctx, t) {
    var x = 120, y = 150, w = 250, h = 180;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
    for (var r = 0; r < 5; r++) for (var c = 0; c < 9; c++) {
      var on = Math.sin(t * 6 + r * 1.7 + c * 2.3) > 0.2;
      ctx.fillStyle = on ? C.cyan : "rgba(255,255,255,0.12)";
      ctx.fillRect(x + 22 + c * 24, y + 26 + r * 28, 12, 6);
    }
    ctx.restore();
    label(ctx, "HIGH GROUND", x, 372, C.dim, 1);
  }

  function label(ctx, txt, x, y, col, a, align) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col;
    ctx.font = "20px " + MONO; ctx.textAlign = align || "left"; ctx.textBaseline = "alphabetic";
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = "3px";
    ctx.fillText(txt, x, y); ctx.restore();
  }

  function caption(ctx, t) {
    var lines = [
      ["COST RUNS DOWNHILL.", 0.3, 0.9, 3.3, 3.8, C.white],
      ["IT POOLS ON THE LOW GROUND.", 3.9, 4.4, 7.1, 7.5, C.white],
      ["BUILD THE CULVERT.", 7.6, 8.1, 10.9, 11.3, C.cyan],
      ["A GOOD CULVERT DECIDES WHERE IT GOES.", 11.4, 11.9, 13.3, 13.8, C.cyan]
    ];
    lines.forEach(function (L) {
      var a = fade(t, L[1], L[2], L[3], L[4]);
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = L[5];
      ctx.font = "84px " + DISP; ctx.textBaseline = "alphabetic";
      ctx.fillText(L[0], 72, 132 + (1 - a) * 14);
      ctx.restore();
    });
  }

  function draw(ctx, t, W, H, opts) {
    opts = opts || {};
    t = ((t % DUR) + DUR) % DUR;
    ctx.save();
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    var s = Math.min(W / VW, H / VH);
    ctx.translate((W - VW * s) / 2, (H - VH * s) / 2);
    ctx.scale(s, s);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
    for (var gx = 0; gx <= VW; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, VH); ctx.stroke(); }
    for (var gy = 0; gy <= VH; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(VW, gy); ctx.stroke(); }

    var sceneA = fade(t, 0, 0.6, 13.3, 14);
    ctx.globalAlpha = sceneA;

    // Ground mass + line
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    ctx.beginPath(); ctx.moveTo(G[0][0], G[0][1]);
    G.forEach(function (p) { ctx.lineTo(p[0], p[1]); });
    ctx.lineTo(VW, VH); ctx.lineTo(0, VH); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(G[0][0], G[0][1]); G.forEach(function (p) { ctx.lineTo(p[0], p[1]); }); ctx.stroke();

    datacenter(ctx, t);

    // Culvert + tank draw in at 7.4s
    var cv = ease((t - 7.3) / 0.9);
    if (cv > 0) {
      ctx.save();
      ctx.strokeStyle = C.cyan; ctx.lineWidth = 5; ctx.lineCap = "round";
      ctx.shadowColor = C.cyan; ctx.shadowBlur = 18;
      var jy = groundY(JX);
      ctx.beginPath(); ctx.moveTo(JX - 26, jy - 14);
      ctx.lineTo(JX - 26 + (TANK.x + 40 - (JX - 26)) * Math.min(1, cv * 2), jy - 14 + (TANK.y - (jy - 14)) * Math.min(1, cv * 2));
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(JX + 34, jy + 20);
      ctx.lineTo(JX + 34 + (TANK.x + 120 - (JX + 34)) * Math.min(1, cv * 2), jy + 20 + (TANK.y - (jy + 20)) * Math.min(1, cv * 2));
      ctx.stroke();
      if (cv > 0.5) {
        var k2 = (cv - 0.5) * 2;
        ctx.globalAlpha = sceneA * k2;
        ctx.fillStyle = "rgba(0,229,200,0.10)";
        ctx.fillRect(TANK.x, TANK.y, TANK.w, TANK.h);
        ctx.strokeRect(TANK.x, TANK.y, TANK.w, TANK.h);
      }
      ctx.restore();
      label(ctx, "THE CULVERT", TANK.x + TANK.w + 24, TANK.y + 28, C.cyan, sceneA * clamp((cv - 0.6) * 2.5, 0, 1));
    }

    // How buried are the houses right now?
    var arrived = 0, drained = 0;
    tokens.forEach(function (k) {
      if (!k.divert && t - k.born > TBOTTOM + 0.3) arrived++;
      if (!k.divert && t > 8.1 + (pileCount - 1 - k.i) * 0.035 + 0.4) drained++;
    });
    var buried = clamp((arrived - drained) / pileCount, 0, 1);
    [1150, 1235, 1320, 1405].forEach(function (x) { house(ctx, x, groundY(x), buried); });
    label(ctx, "LOW GROUND: WHO PAYS", 1528, 790, C.dim, sceneA, "right");

    // Tokens
    tokens.forEach(function (k) {
      var p = tokenPos(k, t);
      if (p) coin(ctx, p.x, p.y, p.rot, sceneA * clamp((t - k.born) / 0.2, 0, 1));
    });

    ctx.globalAlpha = 1;
    if (!opts.noCaption) caption(ctx, t);
    ctx.restore();
  }

  (window.CYWScenes = window.CYWScenes || {})["cost-downhill"] = {
    duration: DUR, width: VW, height: VH, posterTime: 6.9, draw: draw,
    title: ["COST RUNS", "DOWNHILL"],
    alt: "Animation: cost tokens roll off a data center on the high ground, pile up over houses on the low ground, then a culvert opens and routes them into a tank instead."
  };
})();
