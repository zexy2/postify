# Postify — Visual reference owner acceptance register (19 October 2026)

**Status: 81/81 PENDING_OWNER — zero approved or rebaselined.**

## Evidence, scope and release boundary

- Isolated Postify branch test source: `4942307` (`run-96210d9920c1`), local Chromium, Node 24.
- Latest exact-source Playwright visual inventory: **182 tests / 101 passed / 81 failed screenshot comparisons / 0 skipped**. Playwright exit **1**, *not* a passed suite.
- File: `/tmp/postify-4942307-visual-full.json`, SHA-256 `795c01bcf692d9b6deebac1cdf65a32c4f87882639243b1a90dfd55906ca09ea`.
- Each failure has actual/expected/diff PNGs in `/tmp/postify-4942307-visual-failures`, copied to an **uncommitted** review gallery `/tmp/postify-owner-review-4942307`. The portable gallery includes `index.html`, `manifest.json`, 243 PNGs, and filters by screen/diff type. Local Oracle preview requires an Oracle localhost HTTP server/SSH port forward, not a public site.
- The 81 cases contain **53 dimension mismatches** and **28 same-dimension pixel mismatches**. All 81 failed at screenshot assertions and were imported as *visual failures*; passing behavioral tests do **not** authorize an auto-golden update.
- Do not use `--update-snapshots`, modify tolerance, push, merge main, deploy, or make a release approval without explicit separately scoped user consent.

## Review order and material differences

1. **About / Contact (8): owner art-direction approval outstanding.** All 8 are dimension mismatches. About mobile height grows by **588px** (390×2588 → 390×3176); Contact mobile by **760px** (390×1298 → 390×2058) in light/dark. Check editorial narrative, contrast, section lengths, mobile footer, link targets and whether the revised composition is the intended final direction.
2. **Home / Discovery (10):** verify hero, article hierarchy, discovery filters and mobile drawer. Current Home mobile is **589px** taller than its historic reference; opening, filters, keyboard navigation and LCP should remain meaningful alongside visual signoff.
3. **Article / Author (14):** review type hierarchy, knowledge evidence, image placements, article mobile bottom toolbar, author fallback/error states. Existing functional contract protects some hit targets/reflow, not exact art direction.
4. **Task screens (Editor / Profile 11, Admin 10, Knowledge 8, Bookmarks 6):** verify density, roles, form focus, action buttons, tap targets and empty/loading/errors. Do not approve by appearance if real staging auth/RLS remains untested.
5. **Auth / Error (14):** mostly same-dimension pixel drift; compare light/dark typography/feedback, error-recovery affordances and focus; staging OAuth/session and manual AT remain separate release blockers.

## Breakdown

| Area | Total pending | Dimension mismatch | Pixel mismatch | Decision |
|---|---:|---:|---:|---|
| About / Contact | 8 | 8 | 0 | PENDING_OWNER |
| Home / Discovery | 10 | 7 | 3 | PENDING_OWNER |
| Article / Author | 14 | 8 | 6 | PENDING_OWNER |
| Editor / Profile | 11 | 10 | 1 | PENDING_OWNER |
| Admin | 10 | 6 | 4 | PENDING_OWNER |
| Knowledge | 8 | 8 | 0 | PENDING_OWNER |
| Bookmarks | 6 | 6 | 0 | PENDING_OWNER |
| Auth / Error | 14 | 0 | 14 | PENDING_OWNER |
| **Total** | **81** | **53** | **28** | **0 approvals** |

## Itemized visual review matrix

All entries require a human direction: **Accept exact new layout and authorize only selected new golden PNGs**, **Request specific design corrections**, or **Keep existing reference**. An unmarked scenario remains PENDING_OWNER. IDs map to `images/VR-NNN-{expected,actual,diff}.png` *inside the temporary gallery*, **not** to committed repository files.

### About / Contact

| ID | State | Screen / variant | Historic size | Current size | Δ height | Owner decision |
|---|---|---|---|---|---:|---|
| VR-020 | dimensions | About desktop baseline | 1440×2577 | 1440×2780 | +203 px | PENDING |
| VR-021 | dimensions | Contact desktop baseline | 1440×1509 | 1440×1820 | +311 px | PENDING |
| VR-026 | dimensions | About mobile baseline | 390×2588 | 390×3176 | +588 px | PENDING |
| VR-027 | dimensions | Contact mobile baseline | 390×1298 | 390×2058 | +760 px | PENDING |
| VR-076 | dimensions | Dark theme about public surface desktop baseline | 1440×2577 | 1440×2780 | +203 px | PENDING |
| VR-077 | dimensions | Dark theme contact public surface desktop baseline | 1440×1509 | 1440×1820 | +311 px | PENDING |
| VR-079 | dimensions | Dark theme about public surface mobile baseline | 390×2588 | 390×3176 | +588 px | PENDING |
| VR-080 | dimensions | Dark theme contact public surface mobile baseline | 390×1298 | 390×2058 | +760 px | PENDING |

### Home / Discovery

| ID | State | Screen / variant | Historic size | Current size | Δ height | Owner decision |
|---|---|---|---|---|---:|---|
| VR-001 | pixels | Mobile navigation drawer open baseline | 390×844 | 390×844 | +0 px | PENDING |
| VR-002 | pixels | Mobile command palette open baseline | 366×591 | 366×591 | +0 px | PENDING |
| VR-003 | dimensions | Home no-results desktop baseline | 1124×174 | 1184×174 | +0 px | PENDING |
| VR-004 | dimensions | Home no-results mobile baseline | 358×183 | 358×184 | +1 px | PENDING |
| VR-005 | dimensions | Discovery filter popover desktop baseline | 520×506 | 520×510 | +4 px | PENDING |
| VR-006 | pixels | Discovery filter popover mobile baseline | 390×620 | 390×620 | +0 px | PENDING |
| VR-007 | dimensions | Home desktop baseline | 1440×2790 | 1440×3220 | +430 px | PENDING |
| VR-010 | dimensions | Home mobile baseline | 390×3273 | 390×3862 | +589 px | PENDING |
| VR-056 | dimensions | Dark theme Home desktop baseline | 1440×2790 | 1440×3220 | +430 px | PENDING |
| VR-060 | dimensions | Dark theme Home mobile baseline | 390×3273 | 390×3862 | +589 px | PENDING |

### Article / Author

| ID | State | Screen / variant | Historic size | Current size | Δ height | Owner decision |
|---|---|---|---|---|---:|---|
| VR-008 | dimensions | Article desktop baseline | 1440×2940 | 1440×3159 | +219 px | PENDING |
| VR-011 | dimensions | Article mobile baseline | 390×3097 | 390×3321 | +224 px | PENDING |
| VR-022 | pixels | Author portfolio desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-023 | pixels | Author not found desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-024 | dimensions | Author service unavailable desktop baseline | 1440×560 | 1440×520 | -40 px | PENDING |
| VR-025 | dimensions | Author published-work unavailable desktop baseline | 1440×1000 | 1440×1088 | +88 px | PENDING |
| VR-028 | pixels | Author portfolio mobile baseline | 390×844 | 390×844 | +0 px | PENDING |
| VR-029 | pixels | Author not found mobile baseline | 390×844 | 390×844 | +0 px | PENDING |
| VR-030 | dimensions | Author service unavailable mobile baseline | 390×473 | 390×439 | -34 px | PENDING |
| VR-031 | dimensions | Author published-work unavailable mobile baseline | 390×844 | 390×851 | +7 px | PENDING |
| VR-057 | dimensions | Dark theme Article desktop baseline | 1440×2940 | 1440×3159 | +219 px | PENDING |
| VR-061 | dimensions | Dark theme Article mobile baseline | 390×3097 | 390×3321 | +224 px | PENDING |
| VR-078 | pixels | Dark theme author public surface desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-081 | pixels | Dark theme author public surface mobile baseline | 390×844 | 390×844 | +0 px | PENDING |

### Editor / Profile

| ID | State | Screen / variant | Historic size | Current size | Δ height | Owner decision |
|---|---|---|---|---|---:|---|
| VR-009 | dimensions | Editor desktop baseline | 1440×2543 | 1440×2481 | -62 px | PENDING |
| VR-012 | dimensions | Editor mobile baseline | 390×3181 | 390×3251 | +70 px | PENDING |
| VR-015 | pixels | Authenticated header account menu desktop baseline | 1440×65 | 1440×65 | +0 px | PENDING |
| VR-016 | dimensions | Authenticated profile dashboard desktop baseline | 1440×2271 | 1440×2230 | -41 px | PENDING |
| VR-017 | dimensions | Authenticated profile dashboard mobile baseline | 390×3560 | 390×3566 | +6 px | PENDING |
| VR-018 | dimensions | Authenticated profile editor desktop baseline | 1220×631 | 1280×640 | +9 px | PENDING |
| VR-019 | dimensions | Authenticated profile editor mobile baseline | 374×761 | 374×775 | +14 px | PENDING |
| VR-058 | dimensions | Dark theme Editor desktop baseline | 1440×2543 | 1440×2481 | -62 px | PENDING |
| VR-059 | dimensions | Dark theme authenticated profile desktop baseline | 1440×2271 | 1440×2230 | -41 px | PENDING |
| VR-062 | dimensions | Dark theme Editor mobile baseline | 390×3181 | 390×3251 | +70 px | PENDING |
| VR-063 | dimensions | Dark theme authenticated profile mobile baseline | 390×3560 | 390×3566 | +6 px | PENDING |

### Admin

| ID | State | Screen / variant | Historic size | Current size | Δ height | Owner decision |
|---|---|---|---|---|---:|---|
| VR-032 | dimensions | Admin empty dashboard desktop baseline | 1440×950 | 1440×957 | +7 px | PENDING |
| VR-033 | dimensions | Admin empty dashboard mobile baseline | 390×958 | 390×964 | +6 px | PENDING |
| VR-034 | pixels | Admin empty management tabs are explicit and mobile-safe | 390×664 | 390×664 | +0 px | PENDING |
| VR-035 | pixels | Admin error recovery desktop baseline | 1440×820 | 1440×820 | +0 px | PENDING |
| VR-036 | pixels | Admin error recovery mobile baseline | 390×664 | 390×664 | +0 px | PENDING |
| VR-037 | dimensions | Admin dashboard desktop baseline | 1440×1184 | 1440×1190 | +6 px | PENDING |
| VR-038 | dimensions | Admin dashboard mobile baseline | 390×1379 | 390×1398 | +19 px | PENDING |
| VR-039 | pixels | Admin delete confirmation is focus-safe, mobile-contained, and native-dialog free | 374×248 | 374×248 | +0 px | PENDING |
| VR-066 | dimensions | Dark theme Admin dashboard desktop baseline | 1440×1184 | 1440×1190 | +6 px | PENDING |
| VR-069 | dimensions | Dark theme Admin dashboard mobile baseline | 390×1379 | 390×1398 | +19 px | PENDING |

### Knowledge

| ID | State | Screen / variant | Historic size | Current size | Δ height | Owner decision |
|---|---|---|---|---|---:|---|
| VR-013 | dimensions | Edit knowledge desktop baseline | 1440×2409 | 1440×2418 | +9 px | PENDING |
| VR-014 | dimensions | Edit knowledge mobile baseline | 390×3284 | 390×3355 | +71 px | PENDING |
| VR-044 | dimensions | Knowledge unavailable desktop baseline | 1440×322 | 1440×398 | +76 px | PENDING |
| VR-045 | dimensions | Knowledge unavailable mobile baseline | 390×288 | 390×475 | +187 px | PENDING |
| VR-046 | dimensions | Knowledge health desktop baseline | 1440×1673 | 1440×1684 | +11 px | PENDING |
| VR-047 | dimensions | Knowledge health mobile baseline | 390×2582 | 390×2636 | +54 px | PENDING |
| VR-065 | dimensions | Dark theme Knowledge health desktop baseline | 1440×1673 | 1440×1684 | +11 px | PENDING |
| VR-068 | dimensions | Dark theme Knowledge health mobile baseline | 390×2582 | 390×2636 | +54 px | PENDING |

### Bookmarks

| ID | State | Screen / variant | Historic size | Current size | Δ height | Owner decision |
|---|---|---|---|---|---:|---|
| VR-040 | dimensions | Empty bookmarks desktop baseline | 1440×700 | 1440×620 | -80 px | PENDING |
| VR-041 | dimensions | Empty bookmarks mobile baseline | 390×591 | 390×422 | -169 px | PENDING |
| VR-042 | dimensions | Bookmarks shelf desktop baseline | 1440×814 | 1440×746 | -68 px | PENDING |
| VR-043 | dimensions | Bookmarks shelf mobile baseline | 390×1052 | 390×1098 | +46 px | PENDING |
| VR-064 | dimensions | Dark theme Bookmarks desktop baseline | 1440×814 | 1440×746 | -68 px | PENDING |
| VR-067 | dimensions | Dark theme Bookmarks mobile baseline | 390×1052 | 390×1098 | +46 px | PENDING |

### Auth / Error

| ID | State | Screen / variant | Historic size | Current size | Δ height | Owner decision |
|---|---|---|---|---|---:|---|
| VR-048 | pixels | login desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-049 | pixels | register desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-050 | pixels | forgot-password desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-051 | pixels | reset-password desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-052 | pixels | auth-callback desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-053 | pixels | not-found desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-054 | pixels | Error recovery desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-055 | pixels | Error recovery mobile baseline | 390×510 | 390×510 | +0 px | PENDING |
| VR-070 | pixels | Dark theme login desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-071 | pixels | Dark theme register desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-072 | pixels | Dark theme forgot-password desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-073 | pixels | Dark theme reset-password desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-074 | pixels | Dark theme auth-callback desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |
| VR-075 | pixels | Dark theme not-found desktop baseline | 1440×1000 | 1440×1000 | +0 px | PENDING |

## Reproduction and approvals

```bash
python3 scripts/qa/build-visual-review.py \
  --report /tmp/postify-4942307-visual-full.json \
  --artifacts /tmp/postify-4942307-visual-failures \
  --output /tmp/postify-owner-review-new \
  --source 4942307
```

The generator is **read-only** with respect to golden images, fails closed if any expected/actual/diff screenshot is absent or report counts disagree, and refuses to overwrite nonempty prior review output. Tests: `PYTHONDONTWRITEBYTECODE=1 python3 scripts/qa/test_build_visual_review.py` (4 cases).

After explicit owner approval of a **named subset**, regenerate only those baselines on the same source/environment, review expected-versus-actual a second time, rerun affected visual and interaction suites, and preserve evidence before any PR/release action. Real isolated Supabase staging A/B/C OAuth/RLS/CRUD, manual WCAG 2.2 AA and mobile field p75 CWV still block production.
