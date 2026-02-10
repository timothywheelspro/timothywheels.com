---
title: "IEEEXtreme 19.0 Appeal Audit"
description: "Public audit record for the IEEEXtreme 19.0 appeal packet."
date: 2026-02-10
draft: false
---

# IEEEXtreme 19.0 Appeal — Public Audit Record

This page provides a public, neutral audit record for the IEEEXtreme 19.0 appeal packet. It is intended to enable independent verification of document integrity without requiring reliance on participant testimony.

## Status

| Record | Status | Date (UTC) | Notes |
|---|---|---|---|
| APPEAL_LOCK_2026-02-10 | Locked | 2026-02-10 | Submission packet locked with proctor statement |
| Packet v2.1 | **Current (submission)** | 2026-02-10 | 5 pages: Cover + Workflow Timeline + Proctor Statement (merged) |

## Current Release (Submission Packet)

- **Packet:** `IEEEXtreme19_Appeal_Packet_v2.1.pdf`
- **Pages:** 5
- **Contents:** Cover letter (with title page), Workflow Timeline (with proctor observation row), Proctor Statement (Dr. Edwin Hill, received 2026-02-09 10:31 AM)
- **Build:** Merged from `01_cover_letter.pdf` + `03_workflow_timeline.pdf` + `04_proctor_statement.pdf`

## Why only the submission packet is published

Previous generations (v2.0, v2.2) are **not** offered for download here. Reasons:

- **Hash mismatch:** Older builds have different SHA-256 hashes. Publishing them would create confusion about which file was officially submitted.
- **Scope mismatch:** Long-form packets contain more material (full forensic timeline, manifest tables, evidence index, etc.) than the 5-page submission. Only the merged submission packet matches what is sent to the committee.
- **Single source of truth:** The canonical PDF and its hash below are the only public artifacts; they align with the submitted packet.

## Download

- **Evidence Packet (PDF) — submission version:** [IEEEXtreme19_Appeal_Packet_v2.1.pdf](https://timothywheels.com/downloads/appeal/IEEEXtreme19_Appeal_Packet_v2.1.pdf)
- **CANONICAL URL:** https://timothywheels.com/downloads/appeal/IEEEXtreme19_Appeal_Packet_v2.1.pdf

### Integrity check (submission packet)

Verify the PDF you download matches the submitted packet:

```bash
shasum -a 256 IEEEXtreme19_Appeal_Packet_v2.1.pdf
```

**Expected SHA-256:** `313bfa639e349f4cfcbfa4f96eaa6c55d9adf8a734c178165210b9fd19728f94`

- **RULE_REF:** IEEEXtreme 19.0 Competition Rules §4.2 (AI Usage & Assistance)

## AI Usage Compliance (per §4.2)

Per IEEEXtreme 19.0 Rules §4.2 "Internet Resource Use, Including AI and Plagiarism":

| Usage type | Permitted | This packet |
|------------|-----------|-------------|
| Conceptual clarification (theory, methodology) | Yes | E-017: Graph theory, vertical line test |
| Syntax lookup / documentation | Yes | Not applicable to flagged content |
| Code generation (direct copy-paste) | No | No AI-generated code in packet |
| Problem decomposition discussion | Yes | E-017A: 28 conceptual messages |

**Statement:**

1. **Nature of AI interaction:** Conceptual guidance only. Evidence Item E-017A documents 28 messages on graph-theory methodology—no code generation requests or responses.
2. **Timestamp verification:** All AI interactions fall within the documented competition window (16:09:16–16:20:56 UTC, 25 September 2025). Timestamps are OpenAI-generated (`create_time`) and not user-editable.
3. **Conversation ID for independent verification:** `68d5692d-c44c-832d-abff-f827a7755eea` (OpenAI can confirm on committee request).
4. **Negative evidence:** The packet contains no AI-generated source code. AI use is disclosed for conceptual clarification only, which is permitted under §4.2.

## E-017A source-file verification (optional)

If you have the evidence repository and want to verify the E-017A source file:

```bash
sha256sum "01_EVENT_WINDOW/E-017A_identify_graph_functions_verbatim.md"
```

**Expected:** `9ca99a7564295ec5575285a34a96eac352243b762ff66ed4883fd91902caa792`

## Version history (record only; no downloads for superseded)

- v1.0 (2026-02-07): Frozen baseline evidence ZIP
- v2.0 (2026-02-08): Superseded
- v2.1 (2026-02-10): **Submission packet.** 5-page merged PDF; proctor statement received 2026-02-09 10:31 AM
- v2.2 (2026-02-08): Long-form packet; superseded for public audit

## Notes on scope

- Evidence is limited to system-generated records and disclosed gaps.
- No fabricated artifacts are included.
- Counts reconcile to JSON source, including image-only messages.

## Reviewer resources

- [Reviewer Guide](/appeal-audit/reviewer-guide/)
- [Contingency Responses](/appeal-audit/contingency-responses/)

## Contact

For verification questions or additional context:  
Timothy I. Wheels — `timothywheelspro@gmail.com`
