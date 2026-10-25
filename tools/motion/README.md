# CYW motion: clip maker

Each scene is written once and used in two ways:

- **Live on the blog.** `{{< motion name="cost-downhill" ... >}}` plays it in an essay, crisp at any size. It runs only while on screen, and visitors with reduced motion turned on see a still frame.
- **Exported for other platforms.** `render.mjs` turns the same scene into MP4, WebM, GIF and a poster PNG for Substack, LinkedIn and Instagram, which can't run live code.

## Make a new scene

1. Copy `static/motion/scenes/cost-downhill.js` to `static/motion/scenes/<name>.js`.
2. Keep `draw(ctx, t, w, h)` pure: the frame depends only on `t`, never on what was drawn before. That's what lets the exporter render frame by frame.
3. Register it as `window.CYWScenes["<name>"] = { duration, width: 1600, height: 900, posterTime, title, alt, draw }`.

## Export

```bash
cd tools/motion && npm install && npx playwright install chromium   # first time only
node tools/motion/render.mjs <name> --out dist/motion
cp dist/motion/<name>-poster.png static/motion/posters/<name>.png
```

Output: `-16x9.mp4` / `.webm` (1600×900), `-4x5.mp4` (1080×1350 with title and brand bands), `-16x9.gif` (960 wide) and `-poster.png`. Requires ffmpeg.
