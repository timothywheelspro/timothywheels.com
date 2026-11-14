(function () {
  const bg = "#0a0c0f", cyan = "#00e5c8", violet = "#bea7ff";
  const white = "#ffffff", dim = "#96a0a8";
  const clamp = (value) => Math.min(1, Math.max(0, value));
  const ease = (value) => { const u = clamp(value); return u * u * (3 - 2 * u); };

  function label(c, value, x, y, size, color, display = false) {
    c.fillStyle = color;
    c.font = display ? `bold ${size}px "Bebas Neue", Impact, sans-serif` :
      `${size}px "Space Mono", ui-monospace, monospace`;
    c.fillText(value, x, y);
  }

  function draw(c, t, w, h, options = {}) {
    t = ((t % 9) + 9) % 9;
    c.save();
    c.fillStyle = bg;
    c.fillRect(0, 0, w, h);
    const scale = Math.min(w / 1600, h / 900);
    c.translate((w - 1600 * scale) / 2, (h - 900 * scale) / 2);
    c.scale(scale, scale);
    c.fillStyle = "#171e27";
    for (let x = 0; x < 1600; x += 40) c.fillRect(x, 0, 1, 900);
    for (let y = 0; y < 900; y += 40) c.fillRect(0, y, 1600, 1);

    const moving = ease((t - 2.6) / 2.0);
    const received = t >= 4.6;
    const returning = ease((t - 5.25) / 1.65);
    const verified = t >= 6.9;
    c.globalAlpha = Math.min(ease(t / .24), ease((9 - t) / .4));
    label(c, "AWARENESS IN ACTION", 96, 101, 27, cyan);
    if (!options.noCaption) {
      const caption = verified ? "Confirm the handoff." :
        received ? "The trainer gets it Tuesday." : "The assignment is logged Monday.";
      label(c, caption, 96, 229, 68, verified ? cyan : white, true);
    }

    const nodes = [
      { x: 96, name: "ASSIGNMENT RECORD", status: verified ? "ACKNOWLEDGED" : "LOGGED MONDAY", tint: cyan },
      { x: 1040, name: "TRAINER", status: received ? "RECEIVED TUESDAY" : "AWAITING INSTRUCTIONS", tint: received ? violet : dim }
    ];
    for (const node of nodes) {
      c.fillStyle = "#121820";
      c.fillRect(node.x, 330, 464, 250);
      c.strokeStyle = node.tint;
      c.lineWidth = 3;
      c.strokeRect(node.x, 330, 464, 250);
      label(c, node.name, node.x + 30, 424, 35, white);
      label(c, node.status, node.x + 30, 509, 27, node.tint);
    }

    c.fillStyle = "#38434f";
    c.fillRect(560, 453, 480, 3);
    c.fillStyle = cyan;
    c.fillRect(560, 453, moving * 480, 3);
    if (t >= 2.6 && !received) {
      const x = 560 + moving * 480;
      c.fillRect(x - 20, 432, 40, 46);
      c.fillStyle = bg;
      c.fillRect(x - 12, 443, 24, 3);
      c.fillRect(x - 12, 454, 18, 3);
    }

    if (t >= 5.25) {
      c.fillStyle = violet;
      const tail = 1272 - 944 * returning;
      c.fillRect(1270, 580, 3, 84);
      c.fillRect(tail, 662, 1272 - tail, 3);
      c.fillRect(tail - 6, 657, 12, 12);
      if (verified) {
        c.fillRect(326, 580, 3, 83);
        label(c, "RECEIPT CONFIRMED", 600, 714, 32, violet);
      }
    }

    c.fillStyle = "#38434f";
    c.fillRect(96, 790, 1408, 2);
    label(c, "THE ASSIGNMENT INSIDE THE ASSIGNMENT", 96, 842, 27, dim);
    c.restore();
  }

  (window.CYWScenes = window.CYWScenes || {})["assignment-handoff"] = {
    duration: 9, width: 1600, height: 900, posterTime: 7.7,
    title: ["VERIFY THE", "HANDOFF"],
    alt: "An onboarding assignment is logged Monday. It reaches the trainer Tuesday, who sends an acknowledgement back.",
    draw
  };
})();
