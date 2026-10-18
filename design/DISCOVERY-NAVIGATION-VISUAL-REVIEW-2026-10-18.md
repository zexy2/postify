# Postify — Discovery, empty states, and navigation release QA (18 Oct 2026)

**Status: all observed functional behavior passed; six historic screenshot baselines still differ; visual approval PENDING.** No production change, remote push, golden image write or blanket image-tolerance relaxation.

## Evidence and finding

Six visual reference mismatches from the earlier 81-case full screenshot inventory were isolated and rerun against the current source, without updating any expected image:

| Screen | Historic golden mismatch | Browser function evidence |
| --- | --- | --- |
| Mobile drawer open (390px) | Changed pixels | Dialog visible/contained, Escape closes, accessible close control |
| Mobile keyboard command palette (390px) | ~4% pixel difference | Combobox focus, ≥44px listbox options, Escape closes |
| Home empty search desktop | Expected 1124×174 vs actual 1184×174 | Unknown query yields explanatory empty state and reset |
| Home empty search mobile | Expected 358×183 vs actual 358×184 | Same, no horizontal scroll; button≥44px |
| Discovery advanced filters desktop | Expected 520×506 vs actual 520×510 | Dialog contained, sort value updates URL and clear resets |
| Discovery advanced filters mobile | ~4% pixel difference | Dialog within viewport, 44px options, dismiss/restores trigger focus |

A first screenshot rerun also surfaced a measurement precision issue: Chromium returned **43.999969px** for a CSS **44px** menu-close control, causing a strict raw-float threshold failure before the screenshot assertion. Updated *only the existing mobile drawer test assertion* to normalize to **0.01 CSS-pixel precision**, retaining the original **44px** requirement; no UI pixels or hit-area size were altered. After that correction the same **six screenshot checks failed exclusively on their expected image comparisons**, not on any functional assertion. This does not make those screenshots pass.

Added `e2e/visual/discovery-release-contract.spec.js` with **9 independent Chromium scenarios**, including unknown-search reset and persistence of Home feed at 320/390/1440 widths; filter selection/sort query sync/clear/Escape/44px targets at 320×650, 390×844, 568×320 and 1440×900; and mobile drawer/palette keyboard and no-scroll-overflow safety at 320/390. **9/9 PASS**.

Complete source regression after the new contract: **205/205 Vitest**, **64/64 product Chromium**, **7/7 staging/release safety guards**, lint, PWA build/smoke and npm security audit PASS. Oracle report evidence: unit `ev-ad635ebe396576600cd3`; product E2E `ev-27aa86478ad480985438`; discovery functional `ev-86ab051ad197a86813ec`; historic visual **failed QA** `ev-7a67c4e74b1564f0d633`. Reports copied to `/tmp/postify-discovery-release-evidence-20261018/` before cleanup.

## Release decision

- Dark editorial **Home masthead concept CD-012 approved**, but this did **not** approve the separate filter popover, no-results micro-layout, mobile drawer or command-palette pixel references.
- These **six** old goldens remain `unreviewed/needs visual acceptance`; old golden assets and screenshot diff thresholds unchanged. Sitewide earlier full visual gate had **40/121 pass and 81 screenshot fails**; this focused run is **not** a fresh full-site count.
- About/Contact design proposals likewise await owner review. Actual isolated nonproduction Supabase OAuth/RLS actor tests, human-assisted WCAG2.2AA and performance budgets still block production. Production merge/deploy requires separate explicit approval.
