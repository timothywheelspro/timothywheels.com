# Essay and distribution records

One JSON record per essay connects its canonical URL, scene, source PR, poster, two social videos, screenshot evidence, production verification, and publication status. Paths are relative to the repository root. All three rollout essays are present in production commit `1f12ffa413312b55495a035e82546564bb2067ea`; its matching verification passed.

Platform publication is recorded when the owner supplies a public post URL; the evidence field distinguishes owner confirmation from independent verification. `not recorded` means no publication evidence was supplied. At posting time, update the platform status and public URL together. A drafted caption or exported video does not qualify as distributed. Never publish to a platform merely to complete this record without the owner's explicit posting instruction.

## Update a record

1. Prepare one PR per essay; verify canonical ownership first. Keep orchestration-layer and 14-day-playbook material on contruil.com. Preserve original essay wording; captions/pull quotes reuse existing sentences.
2. Describe the scene's mechanism: what moves, stalls, changes, and becomes possible. Review once with captions hidden before adding labels. Batch only two or three eligible essays at a time.
3. Use the export workflow, record its run URL in `latest_export_run`, and retain its source-commit/tool-version/checksum evidence with the media. Regenerated assets require fresh visual review.
4. Update asset paths, byte counts, and the scene checksum after changes. Screenshots at 1440/390 must show no overflow or console errors.
5. Move through prepared → validated → merged → verified live, with the matching production workflow link. Add distributed only for a real platform post with a public URL. Never push to a merged essay branch.
6. Stop new release work while production verification fails or an environment mismatch remains unresolved.

## Storage baseline and retention

At this batch closeout, `docs/pr-assets` contains 6 MP4s totaling **5,212,243 bytes** (4.97 MiB). This is tracked-file payload, not Git history/clone size. Run `git count-objects -vH` separately to inspect repository storage; compression and retained history make the numbers different.

Future render runs upload all formats to GitHub Actions artifacts with **30-day retention**. Download the complete package before expiration to the owner's existing archive and record its durable location. An expired artifact URL is not a durable asset location. Do not delete existing versioned assets or rewrite Git history as part of this cleanup. Before adding more binary media to Git, review growth and agree on archival storage; no new service is introduced here.

## Weekly review (manual, using existing records)

Record a dated note with source links: first-pass build results and matching production verification; review-ready-to-live elapsed time and unresolved PRs; complete asset packages; platform posts with URLs; repeated unchanged configuration failures; stale branches and media growth; and available reader replies/inquiries. Establish measured baselines before numerical targets. Do not add trackers or claim exports demonstrate reader value. No scheduled job or automatic posting is created by this record.
