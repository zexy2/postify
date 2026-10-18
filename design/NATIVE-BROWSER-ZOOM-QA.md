# Native Chromium zoom reflow QA — 2026-10-18

## Goal and verified method

WCAG reflow must not be marked as tested by injecting CSS `font-size` or changing device pixel density alone. The new `scripts/qa/native-browser-zoom.mjs` opens a **visible** system Chromium instance in a dedicated ephemeral Xvfb session, focuses its browser window with X11, and sends OS-level `Ctrl++` accelerators through `xdotool`. Browser measurements confirmed **actual Chrome zoom** via both `window.devicePixelRatio` and the reduced `window.innerWidth`, not `page.keyboard` or CSS transforms:

| Chrome zoom | Browser DPR | Viewport in CSS pixels | Desktop window viewport |
| --- | --- | --- | --- |
| 100% | 1 | 1280 | 1280 device pixels |
| 200% | 2 | 640 | 1280 device pixels |
| 400% | 4 | 320 | 1280 device pixels |

Nine selected public and controlled-fixture screens were checked at each level: Home, public Article, Login, About, not-found page, empty Bookmarks, populated Bookmarks, ownerless legacy Bookmarks import and authenticated Profile fixture. The **27/27 state checks** found no *document-level horizontal overflow* (max 0 CSS px); each rendered one main landmark and at least one h1; no uncaught page errors were observed. At true 400% zoom, Login email/password/submit controls retained keyboard focus and remained inside the horizontal viewport; no credentials were submitted. The legacy archive's ownership checkbox worked with Space and the 44px import button with Enter, yielding exactly two imported records without clipping.

These are actual native Chromium browser zoom and keyboard **automated smoke checks**, not a comprehensive WCAG 2.2 AA conformance assessment. They do not replace manual screen reader (VoiceOver/NVDA), full focus-order/focus-not-obscured review, visual pixel acceptance, all app/editor/admin states or real Supabase staging authentication. Account fixtures do not provide backend authorization evidence. Pinch zoom and mobile accessibility settings have distinct behavior and were not tested here.

## Repeat it on isolated Oracle Linux VM

Prerequisites: Node 24 project dependencies, system Chromium (`/usr/bin/chromium-browser`), `xvfb-run`, `xdotool`, and a **dedicated Xvfb display**. Never send `xdotool` zoom events to the user's actual desktop Chrome session. Run a local server separately (port can be overridden in both commands):

```sh
npm run dev -- --host 127.0.0.1 --port 4414 --strictPort
```

In the other isolated VM terminal:

```sh
NATIVE_ZOOM_ISOLATED_XVFB=1 \
NATIVE_ZOOM_BASE_URL=http://127.0.0.1:4414 \
NATIVE_ZOOM_REPORT=/tmp/postify-native-browser-zoom.json \
xvfb-run -a --server-args='-screen 0 1600x1050x24' \
node scripts/qa/native-browser-zoom.mjs
```

Optionally set `NATIVE_ZOOM_CHROME` if the system binary path differs. The script rejects non-local addresses, non-Linux/default desktop displays and missing explicit `NATIVE_ZOOM_ISOLATED_XVFB=1`, requires actual zoom DPR/viewport changes, prints per-route results, emits a JSON report, and exits nonzero on any measured failure. Results are lab samples of the isolated current source tree, not live production evidence. No screenshot baseline images were modified, no Supabase accounts used and no deployment/push performed.

## Remaining blockers

- Four existing bookmark screenshot baseline geometry mismatches were independently reproduced on the older `7743e51` source before the account-scope refactor, and remain awaiting visual review/approval; the zoom results do not resolve pixel-level baseline acceptance.
- Complete manual native zoom 200/400 across all interactive authenticated/editor/admin pages, screen reader/focus review, real Supabase RLS/OAuth/CRUD, field p75 CWV and paired mobile Lighthouse improvements remain release gates.
