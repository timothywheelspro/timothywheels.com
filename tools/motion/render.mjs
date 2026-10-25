#!/usr/bin/env node
// CYW clip maker: renders a motion scene to video files for platforms that can't run it live.
//
//   node tools/motion/render.mjs cost-downhill            # all formats
//   node tools/motion/render.mjs cost-downhill --fps 30 --out dist/motion
//
// Needs Node, Playwright (Chromium) and ffmpeg on PATH. Writes, per scene:
//   <scene>-16x9.mp4 / .webm   1600x900  (blog, Substack, LinkedIn)
//   <scene>-4x5.mp4            1080x1350 (Instagram feed / LinkedIn mobile)
//   <scene>-16x9.gif           960x540   (email, Substack inline)
//   <scene>-poster.png         1600x900  (still frame for no-motion fallbacks)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith("--"));
if (!name) { console.error("usage: render.mjs <scene> [--fps 30] [--out dir]"); process.exit(1); }
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const fps = Number(opt("fps", 30));
const out = resolve(opt("out", join(repo, "dist/motion")));
mkdirSync(out, { recursive: true });

const font = (f) => pathToFileURL(join(repo, "static/fonts", f)).href;
const sceneUrl = pathToFileURL(join(repo, "static/motion/scenes", `${name}.js`)).href;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Bebas Neue";src:url(${font("bebas-neue-latin-400-normal.woff2")})}
@font-face{font-family:"Space Mono";font-weight:400;src:url(${font("space-mono-latin-400-normal.woff2")})}
@font-face{font-family:"Space Mono";font-weight:700;src:url(${font("space-mono-latin-700-normal.woff2")})}
body{margin:0;background:#0a0c0f}</style></head><body>
<span style="font-family:'Bebas Neue'">.</span><span style="font-family:'Space Mono'">.</span>
<canvas id="c"></canvas><script src="${sceneUrl}"></script></body></html>`;

const work = mkdtempSync(join(tmpdir(), "cyw-motion-"));
const harness = join(work, "harness.html");
writeFileSync(harness, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(harness).href);
await page.evaluate(() => document.fonts.ready);
const scene = await page.evaluate((n) => {
  const s = window.CYWScenes[n];
  return s && { duration: s.duration, posterTime: s.posterTime || 0, title: s.title || [n.toUpperCase()] };
}, name);
if (!scene) { console.error(`scene "${name}" not found`); process.exit(1); }

async function frames(w, h, tag, portrait) {
  const dir = join(work, tag);
  mkdirSync(dir);
  const n = Math.round(scene.duration * fps);
  for (let i = 0; i < n; i++) {
    const data = await page.evaluate(({ n, t, w, h, portrait }) => {
      const c = document.getElementById("c");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      const sc = window.CYWScenes[n];
      if (!portrait) sc.draw(ctx, t, w, h);
      if (portrait) {
        // Scene sits in a 16:9 window under the title; brand bands above and below.
        ctx.fillStyle = "#0a0c0f"; ctx.fillRect(0, 0, w, h);
        const sh = Math.round(w * sc.height / sc.width);
        const off = window.__off || (window.__off = document.createElement("canvas"));
        off.width = w; off.height = sh;
        sc.draw(off.getContext("2d"), t, w, sh);
        ctx.drawImage(off, 0, h - sh - 150);
        ctx.save();
        ctx.font = "700 26px 'Space Mono'"; ctx.fillStyle = "#00e5c8"; ctx.fillText("CONTROL YOUR WORLD", 64, 96);
        ctx.fillStyle = "#fff"; ctx.textAlign = "right"; ctx.fillText("CONTRUIL™", w - 64, 96);
        ctx.textAlign = "left"; ctx.font = "120px 'Bebas Neue'";
        const title = sc.title || [n.toUpperCase()];
        title.forEach((line, j) => { ctx.fillStyle = j === title.length - 1 ? "#00e5c8" : "#fff"; ctx.fillText(line, 64, 260 + j * 112); });
        ctx.font = "24px 'Space Mono'"; ctx.fillStyle = "#96a0a8"; ctx.fillText("TIMOTHYWHEELS.COM", 64, h - 72);
        ctx.restore();
      }
      return c.toDataURL("image/png").split(",")[1];
    }, { n: name, t: i / fps, w, h, portrait });
    writeFileSync(join(dir, `f${String(i).padStart(5, "0")}.png`), Buffer.from(data, "base64"));
  }
  return join(dir, "f%05d.png");
}

const ff = (...a) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...a], { stdio: "inherit" });

const wide = await frames(1600, 900, "wide", false);
ff("-framerate", String(fps), "-i", wide, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(out, `${name}-16x9.mp4`));
ff("-framerate", String(fps), "-i", wide, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-deadline", "realtime", "-cpu-used", "8", "-row-mt", "1", join(out, `${name}-16x9.webm`));
ff("-framerate", String(fps), "-i", wide, "-vf", "fps=15,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=bayer:bayer_scale=4", "-loop", "0", join(out, `${name}-16x9.gif`));
ff("-framerate", String(fps), "-i", wide, "-vf", `select=eq(n\\,${Math.round(scene.posterTime * fps)})`, "-frames:v", "1", join(out, `${name}-poster.png`));

const tall = await frames(1080, 1350, "tall", true);
ff("-framerate", String(fps), "-i", tall, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(out, `${name}-4x5.mp4`));

await browser.close();
rmSync(work, { recursive: true, force: true });
console.log(`rendered ${name} -> ${out}`);
