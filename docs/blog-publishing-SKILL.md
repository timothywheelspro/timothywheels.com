---
name: timothywheels-blog-publishing
description: Use when publishing or editing a post on timothywheels.com/blog — Hugo file format, media paths, the essay-video clip shortcode, and the branch → Cloudflare preview → merge flow. Shared by Claude, Gemini and Codex.
---

# timothywheels.com blog publishing

One set of rules for every tool (Claude, Gemini CLI, Codex). The repo copy lives at `docs/blog-publishing-SKILL.md` in `timothywheelspro/timothywheels.com`; `AGENTS.md` (Codex) and `GEMINI.md` (Gemini CLI) point to it. When a rule changes, update the repo copy and this skill together.

Voice and wording come from the `aia-house-style` skill (repo copy: `docs/aia-house-style-SKILL.md`). This skill covers files, media and deployment only.

## The site
- Repo: `github.com/timothywheelspro/timothywheels.com` (personal account, not Contruil-LLC). Local clone: `~/Contruil/_personal/timothywheels.com`.
- Hugo extended 0.158.0, theme PaperMod (git submodule). No `package.json`. Build: `python3 tools/build-preflight.py && hugo --gc --minify`.
- Hosting: Cloudflare Pages project `timothywheels-com`, built from `main`.

| Address | What it shows |
|---|---|
| `timothywheels.com` | Live site (`main`) |
| `timothywheels-com.pages.dev` | Same live site at Cloudflare's address. Never shows unmerged work. |
| `<branch-name>.timothywheels-com.pages.dev` | Preview of one branch / PR. Cloudflare posts it as a PR comment ("Branch Preview URL"). |

## Post file
Path: `content/blog/<slug>.md`. Frontmatter, matching existing posts exactly:

```yaml
---
title: "Code Yellow"
description: "One- or two-sentence subtitle."
date: 2026-11-17            # date only, no time
draft: false
canonicalURL: "https://timothywheels.substack.com/p/<slug>"   # only if Substack published first
layout: essay
ghost: "UPTIME"             # one decorative background word in the page header (essay-hero__ghost)
cover:
  image: "/images/blog/<slug>-cover.png"
  alt: "Plain description of the cover."
  relative: false
---
```

- No `tags` field (no post uses it).
- Body format, matching existing posts:
  - If republished from Substack, the first line is `*Originally published on Substack: [Awareness In Action](<url>).*`
  - Then the subtitle as one **bold** line.
  - Section headers are **bold lines** (`**The exercise**`), not `##` headings.
  - Ends with "This is how you Control Your World.", then `**References**` (or `**References & context**`), then the bio in italics.
- Don't repeat the title in the body; the layout renders it.
- Raw HTML in markdown is not confirmed enabled. Never use `<img>` or `<video>` tags in a post. Use markdown images and the shortcodes below. Don't change `markup.goldmark.renderer.unsafe` without Fly's OK.
- `essay-figure` is a different shortcode: it renders a named partial from `layouts/partials/essay-figures/<name>.html`. It doesn't take an image path.

## Media
- All post media goes in `static/images/blog/`, referenced as `/images/blog/<file>`. Name files with the slug: `<slug>-cover.png`, `<slug>-card.png`, `<slug>-clip.mp4`.
- Cover: 1600×900. Inline cards: 1080×1350 (4:5). Palette and fonts come from `aia-house-style`. Visuals are made with Python (Pillow) or HTML/CSS only.
- Every image and clip gets alt text or a label that describes everything readable in it.

### Short video clips (to keep readers on the page)
Use the shortcode, never a raw `<video>` tag:

```
{{< essay-video src="/images/blog/<slug>-clip.mp4" poster="/images/blog/<slug>-card.png" label="What the clip shows" >}}
```

Optional: `caption="Text under the clip"`, `maxwidth="540px"` (default 540px). The shortcode (`layouts/shortcodes/essay-video.html`) autoplays muted, loops, and plays inline on phones.

Clip rules:
- 6–15 seconds, silent, H.264, `yuv420p`, `-movflags +faststart`, 30 fps.
- Under ~5 MB (Code Yellow's 10 s clip is 260 KB). Cloudflare Pages rejects any file over 25 MiB. No Git LFS.
- 4:5 (1080×1350) works on the blog and doubles as an Instagram/Facebook Reel. Use 9:16 (1080×1920) only for a TikTok-first cut.
- Poster = the post's static card, or the clip's final frame.
- Re-encode an oversized clip: `ffmpeg -i in.mp4 -c:v libx264 -preset veryfast -crf 26 -vf "scale='min(1080,iw)':-2" -pix_fmt yuv420p -movflags +faststart -an out.mp4`
- Place a clip where it previews or reinforces the exercise. Don't put one next to the identical still image.

## Publishing flow
1. `cd ~/Contruil/_personal/timothywheels.com && git checkout main && git pull`
2. Branch: `blog/<slug>`, or `handoff/<tool>-<YYYYMMDD>-<task>` when another AI does the work (per `ai-handoff-protocol`).
3. Add only this post's files. `git add` each path by name, never `git add .` or `-a`: the working tree may hold unrelated, unfinished changes.
4. `git push -u origin <branch> && gh pr create --base main --fill && gh pr checks --watch`
5. Open the **branch preview URL** + `/blog/<slug>/` on phone and desktop. Check the cover, ghost word, inline media, clip playback, and the ending. A green check means the site built. It doesn't mean the post looks right.
6. Fly merges: `gh pr merge <n> --squash`. Then `git checkout main && git pull && git rev-parse HEAD` for the audit hash.
7. Live within ~2 minutes at `timothywheels.com/blog/<slug>/`. Put that URL into the distribution kit and the LinkedIn comment.

## Rules for any tool doing this work
- Never commit to or merge into `main`. Fly merges.
- Essay text is final copy from Fly's kit. Copy it word for word: formatting changes only. Never reword, "fix," or add sentences, and never fill a `[PLACEHOLDER]` without Fly's exact text.
- A tool that can't run commands (a chat window, not a CLI) should say so up front and hand Fly exact commands. It must never ask Fly to paste a whole essay so it can retype it.
- Don't touch build config, the theme, CI, `static/_redirects`, or other posts unless that's the task.
- Report real command output, not summaries.

## Known issues (not blocking)
- `static/_redirects` uses Netlify-style `301!`. Cloudflare rejects every line ("Parsed 0 valid redirect rules"), so those blocks are inactive. The fix is to drop the `!`. Track it as its own task.
- The Cloudflare build logs harmless `could not read Username for 'https://github.com'` lines before Hugo installs.
