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
npm ci --prefix tools/motion
npx --prefix tools/motion playwright install chromium   # first time only
node tools/motion/render.mjs <name> --out dist/motion
cp dist/motion/<name>-poster.png static/motion/posters/<name>.png
```

Output: `-16x9.mp4` / `.webm` (1600×900), `-4x5.mp4` (1080×1350 with title and brand bands), `-16x9.gif` (960 wide) and `-poster.png`. Requires ffmpeg.

## Reproducible runner exports

Use the repository's **Motion export** workflow on GitHub Actions. It uses Ubuntu 24.04, Node 22, the committed npm lockfile, Playwright Chromium, and ffmpeg. After this workflow merges to main, choose Actions → Motion export → Run workflow and provide a scene name such as `one-drain`. A PR changing the renderer/workflow/scenes automatically exports `one-drain` as the integration fixture; it is not automatic coverage of every edited scene. Manually export each changed scene before declaring its package validated.

The workflow has read-only repository permission, uses no deployment credential, and uploads the full five-format package for 30 days. It records the exact source commit, tool versions, and file checksums. `verify-export.py` checks all deliverables exist and that MP4/WebM dimensions and durations agree. Tool versions and the lockfile make the environment inspectable; ffmpeg/OS updates can still change output bytes.

Download and retain the artifact before expiration; add its run URL to the [essay record](../../docs/content-records/README.md). The blog poster remains versioned. Existing social MP4s are retained, but future exports need not add every generated binary to Git.

The local macOS sandbox may reject Chromium startup. Use the runner rather than repeatedly retrying the same launch failure. The first three rollout packages used a local browser harness; their records preserve that provenance. A fresh runner export does not silently replace those reviewed assets.

For visual acceptance, inspect the poster, both video formats, and the live scene. Review the mechanism with captions hidden; check portrait title framing, readable text, loop transition, and source wording. Use 1440/390 browser screenshots for layout changes. No export workflow replaces human review.
