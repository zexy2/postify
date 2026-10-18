# Postify — Quality Checklist & Gates

**Aktif durum: TASARIM/QA PLANLAMASI TAMAMLANDI (Aşama 0–11, 12/12). CD-011 QA-02 ana + QA-03 zorunlu güvenlik/WCAG/veri bütünlüğü/performans onaylı; gerçek uygulama, test, push ve deployment ayrı izin bekliyor.** Her durumun güven düzeyi belirtilmelidir: **gözlendi** / **kontrol gerekli** / **erişilemedi** / **onaylanmadı**.

## Audit 0 — doğrulanan asgari kanıt
- [x] Doğru GitHub repository ve ayrı worktree, temiz başlangıç HEAD `30a5a12` doğrulandı.
- [x] 17 rota tanımı, 6 protected redirect, 11 public route ayrımı kod ve Chromium ile kontrol edildi.
- [x] 51 route/viewport gözlemi (390/768/1440); bir H1, sıfır gözlemlenen horizontal overflow, sıfır yakalanan pageerror.
- [x] Ekran görüntüleri (Oracle, repo dışında) kaydedildi; canlı site desktop/mobile ayrıca açıldı.
- [x] Geçerli CSS token ve font stack envanteri; **tasarım seçimi yapılmadı**.
- [x] Public img alt ve form input label için basit DOM taraması (örneklemde eksik yok). **Otomatik WCAG garantisi değil**.
- [x] Live mobile tek-run performance sample: home FCP/LCP ~1100ms, article FCP ~428ms/LCP ~728ms. **Alan metriği değil**.
- [x] Önceki iterasyonda kayıtlı `npm run verify` PASS + 55/55 V3 Chromium E2E PASS var; **Aşama 0 içinde build/test tekrar çalıştırılmadı**.
- [x] Aşama 0'da app, routing, API, style, font veya metadata kodu değiştirilmedi.
- [x] Aşama 0 kullanıcının 2026-10-17 tarihli **Onaylıyorum** yanıtıyla onaylandı.
- [x] Aşama 1 için A/B/C stratejileri, avantaj/risk ve kompozisyon eskizleri belgelendi.
- [x] Aşama 1 **A+B hibrit yaratıcı stratejisi** kullanıcı tarafından açıkça onaylandı (2026-10-17).
- [x] Aşama 2: yedi gerçek yayın sitesi, desktop/mobile kaynak taraması ve sınırlamalar belgelendi.
- [x] Aşama 2: MOOD-01/02/03 alternatifleri, ürün uyumu ve riskleri belgelendi.
- [x] Aşama 2 CD-002 kapsamında MOOD-02 ana, MOOD-01 kanıt/UX, MOOD-03 sınırlı teknik kullanımla onaylandı.
- [x] PL-01/02/03 light/dark ve temel metin/CTA kombinasyonları için matematiksel kontrast hesapları belgelendi.
- [x] Kaynak CSS değiştirilmeden üç exact-hex renk örneği araştırma SVG dosyasına kaydedildi.
- [x] Aşama 3 PL-01 renk kararı CD-003 ile kullanıcı delegasyonu kapsamında onaylandı.
- [x] Aşama 4 Newsreader/DM Sans, Fraunces/Inter ve Literata/IBM Plex Sans kombinasyonları lisans/okunabilirlik/karakter destekleriyle araştırıldı.
- [x] Oracle Chromium specimen TYPE-01/02/03 1100px/390px TR/EN metin, meta ve kod ile karşılaştırıldı; fontlar loaded, örneklerde taşma ve JS hatası yok.
- [x] Aşama 4 TYPE-02 (Fraunces + Inter + IBM Plex Mono) açık kullanıcı onayı CD-004 ile kaydedildi.
- [x] Aşama 5 G-01/02/03 grid ölçü/spacing adayı ve 17 rota için layout sorumlulukları belgelendi.
- [x] Statik prototipte 3 seçenek × 2 sayfa × 4 viewport = 24 Chromium kontrolünde yatay taşma görülmedi (gerçek site QA değildir).
- [x] Aşama 5 **G-01 ana sistem + G-02 yalnızca seçilmiş editoryal dosyalar** CD-005 kullanıcı onayıyla kaydedildi.
- [x] Aşama 6 mevcut component API/rolleri, protected/empty/loading/error/verification durumları envantere bağlandı.
- [x] Aşama 6 C-01/C-02/C-03 karşılaştırmalı bileşen örnekleri Oracle Chromium'da 1440/768/390/320px (12 statik render) görüldü; taşma/pageerror yok ve görünür buttonlar ≥44px.
- [x] Aşama 6 **C-02 Inked Folio** kullanıcı tarafından CD-006 ile açıkça onaylandı; G-01 genel grid ve G-02 seçici istisnası korundu.
- [x] Aşama 7 H-01/H-02/H-03 ana sayfa kompozisyon ve görev hiyerarşileri karşılaştırıldı; arama, filtre, featured, fallback ve evidence davranışları kaynak düzeyinde koruma envanterine alındı.
- [x] Aşama 7 üç statik homepage prototipi 1440/768/390/320 Chromium ile kontrol edildi: 12/12 yatay taşma/pageerror yok. Gerçek uygulama/ekran okuyucu testi değildir; webfontlar fallback kullandı.
- [x] Aşama 7 Homepage Design **H-01 Issue Front** kullanıcı onayı CD-007 ile kaydedildi.
- [x] Aşama 8 tüm 16 iç rota için makale, yazar, auth, editör, kayıt, knowledge/admin, about/contact/404 ve durumlar tasarım koruma tablosuna alındı.
- [x] Aşama 8 üç iç sayfa yaklaşımı (INNER-01/02/03) makale/auth/editör/yazar × 1440/768/390/320 = **48** bağımsız statik Chromium örneğinde incelendi, gözlenen yatay taşma/pageerror sıfır; gerçek app QA değildir.
- [x] Aşama 8 INNER-02 ana + INNER-01 uzun okuma + sınırlı INNER-03 kullanıcı delegasyonuyla CD-008 olarak kararlaştırıldı.
- [x] Aşama 9 M-01/M-02/M-03 alternatifleri, component/state performans ve reduced-motion sınırları karşılaştırıldı.
- [x] Aşama 9 Chrome bağımsız demo 3×2×2 = 12 farklı viewport/motion tercihiyle test edildi; overflow ve JS pageerror yok, Escape sonrası focus return; reduced-motion transition ~0.01ms. Gerçek app testi değildir.
- [x] Aşama 9 M-02 Editorial Rhythm genel + M-01 sakin görev ekranları + selected featured-only özel hareket kullanıcı tarafından CD-009 ile açıkça onaylandı.
- [x] Aşama 10 gerçek uygulama salt okunur 85 ilk görünüm + 30 yüklenmiş görünüm Chromium taraması; keyboard/filter kontrolü ve palette contrast hesabı belgelendi.
- [x] Aşama 10 R-01/R-02/R-03 responsive politika seçenekleri ile WCAG 2.2 AA minimum kabul şartları belgelendi.
- [x] Aşama 10 R-01 sitewide + R-02 yalnız article/evidence + R-03 yalnız auth/editor/admin/knowledge ve bütün ekranlarda WCAG 2.2 AA kullanıcı onayı CD-010 ile kaydedildi.
- [x] Aşama 11 QA-01/QA-02/QA-03 alternatifli son kalite/estetik kontrol planı, 17 rota için işlev ve acceptance kanıtı, P0/P1 çıkış eşiği ve ayrı implementation/release yetki kapıları belgelendi.
- [x] Aşama 11 QA-02 ana + QA-03 güvenlik/WCAG 2.2 AA/veri bütünlüğü/performans zorunlu kapılarının kullanıcı plan onayı CD-011 ile alındı.\n- [x] Onaylı tasarımın uygulamasına **ayrı kullanıcı “Devam” izniyle başlanıldı**; PL-01/TYPE-02/G-01, H-01/C-02 ve ilgili shared/inner/task-first CSS değişiklikleri izole dalda commit edildi. **Tam 17 rota estetik kabulü henüz yapılmadı.**\n- [x] Ayrı kullanıcı **“Evet”** test/build onayından sonra Vitest, ESLint, Playwright, build, güvenlik ve sınırlı tarayıcı görsel kontrolleri gerçekten çalıştırıldı. **Tam QA-02/QA-03 release kabulü bu anlama gelmez.**\n- [ ] GitHub push ve production deployment **yapılmadı**; ayrı onay gerekir.\n- [ ] WCAG 2.2 AA gerçek uygulama uygunluğu **henüz doğrulanmadı**.

## Bilinçli olarak açık kalan kontroller
- [ ] 200%/400% text resizing/reflow: bütün işlevler için yeniden ekran karşılaştırması.
- [ ] WCAG 2.2 AA: gerçek foreground/background kontrast matrisi (normal 4.5:1; büyük metin 3:1), UI component kontrast 3:1, focus indicator 2.4.11 ve 2.4.13 hedef ayrımı; klavye sırası, bypass, status announcements, aria dialog. **Mevcut uygunluk iddia edilmez.**
- [ ] Meta/tarih/kanıt yazıları 8–12px ölçümlerinin gerçek cihaz/dil/kontrast etkisi.
- [ ] Mobil sticky controls ile toast/banner/focus/keyboard çakışmalarının etkileşim testi.
- [ ] VoiceOver/NVDA/TalkBack gerçek yardımcı teknolojilerle manuel okuma denetimi.
- [ ] Türkçe/İngilizce tam copy ve tarih/sayısal yerelleştirme, uzun metinler.
- [ ] True auth login, signup, OAuth callback, recovery, save/delete bookmark, profile upload, create/edit/publish, admin role moderation; staging/test account gerekir.
- [ ] Empty/loading/error/offline/fallback durumlarının tüm sayfalarda görsel ve semantik kontrolü.
- [ ] Gerçek production LCP/CLS/INP, network throttling, CPU/Android/iOS; birden fazla koşum ve p75 gerçek veri.
- [ ] Responsive: 320/360/390/430/768/1024/1280/1440/1920 ve landscape/zoom.
- [ ] SEO/canonical/JSON-LD/hreflang/PWA/SPA redirect regressions — uygulama sonrası.
- [ ] Uygulamaya başlanacaksa görsel before/after onayı, birim/E2E, performance budget ve user approval gates.

## Gelecek aşamalar için çıkış kapısı
1. Her aşama alternatiflerini, gerekçesini, trade-off'unu ve uygun görsel örneklerini sun.
2. Kullanıcının **açık onay metnini** `DESIGN-DECISIONS.md` içine yaz; aksi halde dur.
3. Onaylı tasarım kararını `DESIGN-SYSTEM.md`'ye taşı; uygulama ve test kanıtını ancak ilgili aşamada ekle.
4. Branch'te yalnızca ilgili kontrollü değişiklikleri commit et; hiçbir onay olmadan push/deploy veya sonraki aşamaya geçme.

**Şimdiki sonraki adım:** Tasarım ve QA **planı 12/12 onaylı**, izole UI **uygulaması ve testleri devam ediyor**. Son taramada 17 rota × dört genişlik × iki tema = **136 anonim erişim görünümü** ölçüldü; altı korumalı rota girişe yönlendi, girişli içerikleri test edilmedi. **56 E2E**, **162 Vitest**, ESLint/build/security başarılı; eklemeli WCAG 2.2 AA, gerçek oturumlu veri/rol akışları ve canlı Core Web Vitals **açık**. GitHub push/deploy ayrıca açık onay bekliyor.


## 2026-10-17 / Final uygulama dilimi ve kapsam kontrolü (PLAN DEĞİL, GERÇEK İŞ)

- [x] \`c94c8e4\`: Auth/login/register/profile/editor/home CTA kontrastı koyu tema \`--text-inverse\`; \`useTheme\` mobil tarayıcı theme-color açık \`#A13826\`, koyu \`#151B19\`; footer/küçük meta erişilebilir okunabilirlik; editör toolbar 44px buton; E2E regression.
- [x] Test onayı kapsamında gerçek \`npm run lint\`, \`npm test\` **162/162**, izole \`npm run build -- --outDir /tmp/postify-final-polish-build\`, \`npm run verify:security\` **0 advisory**, Chromium E2E **56/56** geçti.
- [x] İzole Chromium'da **17 route × 320/390/768/1440 × light/dark = 136 görüntü**; gözlenen **0 document yatay taşma, 0 pageerror, 0 eksik main landmark**. Yanlış yönlendirme iddiası yok: \`/posts/create\`, \`/posts/:id/edit\`, \`/bookmarks\`, \`/admin\`, \`/knowledge\`, \`/profile\` anonim kullanıcıyı \`/auth/login\`'e götürdü. Oturumlu içerik **test edilmedi**.
- [ ] Gerçek authenticated staging/editor/admin/role/write-flow, 200%/400% native browser zoom ve ekran okuyucu manuel testleri, field CWV p75, tüm kritik state'lerin tasarım sahibi tarafından piksel/görsel kabulü **açık**.
- [ ] **Release/push/deploy** ayrı kullanıcı izni olmadan yapılmaz. Otomatik regresyon / anonim görünüm başarıları **WCAG 2.2 AA sertifikası değildir**.


## Son Lighthouse QA bulguları — Yayın kararı DEĞİL (2026-10-17)

- [x] \`b82db88\`: gazete kartı sıra numaralarının kontrastını düzeltti, konu başlığını içeren anlamlı okumaya devam et bağlantısı, gerçek \`robots.txt\` crawl politikası.
- [x] Yerel mobil Lighthouse 13.5 lab: **Accessibility 96→100**, **SEO 85→100**, **Best Practices 100→100**, \`color-contrast/link-text/robots-txt\` audit PASS; son kaynakla Vitest **162/162**, Playwright **56/56**, build ve security PASS.
- [ ] **Mobil performans KAPISI AÇIK:** Son Lighthouse lab **55/100**, **LCP ~4.7s**, **TBT ~860ms**, **CLS 0**. Entry/Supabase başlangıç JS ve main-thread kritik yük profili çıkarılacak; güvenli kod ayrıştırma kararı, karşılaştırmalı performans ölçümü ve regresyon testleri gerekiyor. Lab ≠ gerçek kullanıcı p75.
- [ ] Manuel WCAG 2.2 AA, destekleyici teknolojiler, gerçek kullanıcı oturumlu işlemler, tüm durumların görsel kabulü ve deployment onayı açık. **Otomatik 100 Lighthouse erişilebilirlik puanı bunu kapatmaz.**


## Oracle recovery and mobile image performance (2026-10-17)

- [x] Exact interrupted Postify run `run-96210d9920c1` recovered without resetting Git; working assets preserved in isolated branch.
- [x] Earlier failed Sheet-on-click and offscreen `content-visibility` trial **reverted** because it failed first-click/touch-target E2E. Existing menu and scroll behavior preserved.
- [x] Local featured images given 480/800px responsive WebP variants with local-only `srcSet`, real Chromium mobile selection verified; remote media unmodified.
- [x] Entry chunk brought under existing 320000-byte build budget (319294 bytes) via second Terser compression pass; Vitest 164/164, Chromium Playwright **57/57**, lint/build/smoke/security pass.
- [x] Two-run mobile Lighthouse baseline/candidate comparison: score **55/55 → 55/56**, no reliable improvement; **Performance gate remains OPEN**, despite measured transfer savings for example featured image.
- [ ] Future performance focus remains JS/hydration/main-thread and authorized data flows; no false Lighthouse performance victory or manual WCAG compliance claim.


## Deferred post service performance experiment (2026-10-17)

- [x] Moved eager postService imports in read queries/mutations and legacy Redux async thunks to dynamic imports while preserving the same canonical data service, fallback and auth behavior.
- [x] Production main entry **319294→309650 bytes** (saves 9644 bytes) without raising 320000-byte budget; lint, 164/164 Vitest, 57/57 Chromium E2E, build, npm security 0 passed.
- [ ] Lighthouse mobile A/B scores baseline 58/55 vs candidate 52/60 across two passes: **not statistically meaningful improvement**, keep performance QA gate OPEN. Investigate style/main-thread, session-safe lazy initialization and real CWV next.


## 2026-10-17 — Home LCP issue cover preload, acceptance pending

- [x] Home-only responsive image preload; actual 390px browser downloads the 480px cover only once. Auth/login and article routes have no home cover preload.
- [x] ESLint, Vitest 164/164, E2E 58/58, production build, 11-critical-file smoke, security audit zero.
- [x] Lighthouse LCP request discoverability false to true in both candidate mobile rounds.
- [ ] Lighthouse performance unchanged as a reliable conclusion: baseline 49/52 versus candidate 48/59 is noisy. Mobile performance release gate remains OPEN.
- [ ] Genuine signed-in workflows, manual WCAG 2.2 AA, real zoom and field CWV remain pending; push/deployment need separate user approval.


## 2026-10-17 — Fallback anchor layout polling reduction

- [x] 390px Chromium anchor geometry measurements: idle1.75s 106 to 0, scroll0.8s 48 to1 using ResizeObserver.
- [x] 165 Vitest, 58 E2E, lint/build/smoke/security PASS; scroll restoration and legacy fallback unit tests preserved.
- [x] Lighthouse mobile A/B baseline60/59 versus candidate60/60; small delta, performance gate still OPEN.
- [ ] Field performance, manual WCAG, real protected workflows, final visual acceptance, and explicit remote push/deployment approvals still pending.

## 2026-10-17 — Verified auth subject and protected UI gate

- [x] RED to GREEN: failed getCurrentUser after restored session cannot set authenticated UI.
- [x] RED to GREEN: mismatched session-user subject cannot initialize user/profile.
- [x] RED to GREEN: password login does not succeed with an unverified missing user.
- [x] RED to GREEN: account route rejects stale flag-only and stale user-only state.
- [x] Positive mocked SIGNED_IN callback and previous login/logout revision tests remain green.
- [x] ESLint, Vitest 175/175, production build, critical 11-file smoke (310760/320000-byte JS entry), npm security audit 0 and Chromium E2E 58/58 PASS.
- [ ] Actual signed-in OAuth, refresh, staging RLS and protected CRUD need fixtures and manual validation.
- [ ] Real browser zoom 200/400%, screen reader WCAG 2.2 AA, field CWV and mobile speed release gate pending. No push/deploy without authorization.

## 2026-10-18 — Recovered QA: delayed password login and route subject consistency

- [x] Recovered run-96210d9920c1 and inspected clean e9b0cf1 baseline; main untouched. Node.js 22 failed the Node 24 knowledge verification runtime gate; used preinstalled isolated Node 24.21.0 without modifying global PATH.
- [x] Baseline independent verification (Node 24): 175/175 Vitest, 58/58 Playwright Chromium, lint/build/smoke/security PASS; JUnit/Playwright reports imported into Oracle evidence.
- [x] Three RED tests reproduced: delayed password-login profile response restoring account UI after SIGNED_OUT; protected route accepting absent session or mismatched session subject.
- [x] Fix: password login checks current Redux session/account before applying delayed profile or reporting success, and ProtectedRoute requires matching session.user.id, user.id and isAuthenticated; no backend/RLS changes.
- [x] Targeted 17/17 GREEN; full 178/178 Vitest (43 suites), 58/58 Chromium E2E, ESLint, Vite PWA build, 11-asset smoke (310957/320000 JS entry), npm security 0 known vulnerabilities PASS. JUnit/Playwright reports imported into Oracle evidence.
- [ ] Real OAuth, refresh, RLS, staging protected CRUD, native zoom/AT WCAG 2.2 AA, field CWV and mobile Lighthouse release gates remain OPEN. No push/deploy.

## 2026-10-18 — Authenticated account switch regression (mocked, not live service)

- [x] Two RED regression tests reproduced previous account A remaining in UI while provider SIGNED_IN account B was unverified or verification failed.
- [x] Auth hook clears existing Redux identity and sets neutral loading state when a new provider session subject differs; guarded hydration only unlocks B after matching getCurrentUser. Same-account restoration/refresh path is not force-logged-out by this condition.
- [x] Targeted auth 12/12 GREEN; full Node 24 Vitest 180/180 (43 files) GREEN, Chromium E2E 58/58, ESLint, Vite PWA production build, 11-file smoke (311037/320000 entry bytes), npm security audit zero PASS. JUnit and Playwright JSON imported to Oracle phase 4.
- [ ] Real provider sign-in, token refresh, staging RLS and role-based CRUD, native 200/400% zoom/assistive technology, mobile Lighthouse and field CWV remain unverified; production auth security is not established by mocked hooks. No push/deployment.

## 2026-10-18 — Login target and article 200% text reflow QA

- [x] Browser reflow sample (not true native zoom): 4 public routes × 5 viewport widths (320/360/390/720/1440), 20 observations, no horizontal document overflow and no missing h1 detected. Limited to sampled states.
- [x] RED Chromium: login recovery link 19.28px tall and registration link ~15px at 720/1440, below the intended 44px hit target. CSS inline-flex alignment/minimum 44×44px; GREEN across 320/720/1440 and no page overflow.
- [x] Existing 200% text-scaling Playwright test could finish before lazy article/adjacent navigation mounted. It now waits for the actual neighboring post title, producing a repeatable RED 320px viewport, article next-link right edge ~337.8px outside viewport.
- [x] Article neighbor CSS adds min-width:0 and overflow-wrap:anywhere, disables three-line title clamping on narrow screens so enlarged titles remain readable, and adds .14em bottom ink spacing (browser probe scroll/client 285/282 -> 288/288). Strengthened 200% text-scaling + login hit-area targeted tests 2/2 GREEN.
- [x] Final independently executed QA under local Node 24: Vitest 180/180 (43 suites), full Chromium UI E2E 59/59 (0 flaky), ESLint 0 errors/0 warnings after updating useCallback dependency, PWA build PASS, build smoke 11 critical assets and entry 311039/320000 bytes, verify:security npm audit 0 known vulnerabilities. Structured reports imported into Oracle Evidence Collector.
- [ ] This 200% test injects root CSS font-size, it is NOT native browser zoom and is NOT manual screen-reader WCAG 2.2 AA sign-off. Real staging auth/OAuth/RLS/CRUD, field CWV p75, mobile Lighthouse performance ~60 and final visual acceptance remain pending. No push or deployment.

## 2026-10-18 — Preserve mobile article back-navigation during performance work

- [x] Actual Chromium cold mobile navigation test opens a feed article from ~2400px scroll and returns with the original card at the same viewport position; strengthened permanent E2E guard allows at most 10px displacement. Targeted test passed.
- [x] Mobile feed CSS `content-visibility:auto` performance experiment tested with five 4x-CPU cold CDP runs each; 5 focused E2E passed but weak ~20ms FCP / ~10ms estimated blocking median improvement with large candidate worst-case regression. Reverted experiment; no CSS product change.
- [ ] True performance gate requires paired stable Lighthouse gains, field p75 Core Web Vitals, mobile assistive-tech/native zoom manual signoff, and authenticated Supabase staging flows; do not declare complete.

## 2026-10-18 — Profile update and identity handoff race

- [x] Two RED mocked hook tests exposed a delayed profile mutation incorrectly returning success and rehydrating old account A after SIGNED_OUT or during A→B identity verification. The older update's `finally` could also dismiss B's pending loading state.
- [x] Profile mutation now validates a consistent authenticated user, session subject, and original Redux session object before writing or reporting success. Completion after sign-out, account switch or token replacement returns a non-success result without changing new user state or dismissing new identity's loading indicator. A legitimate same-session update still succeeds.
- [x] Added separate positive profile-edit and same-account TOKEN_REFRESHED stale-edit regression tests. Targeted useAuth 16/16; full independent Node24 QA: Vitest 184/184 in 43 suites; Playwright Chromium 60/60 (0 failed/skipped/flaky); ESLint no warnings; Vite PWA build PASS; smoke 11 artifacts, JS entry 311319/320000 bytes; npm security audit zero known vulnerable dependencies. JUnit and Playwright JSON reports imported to Oracle phase 4.
- [ ] Backend mutation cancellation is not guaranteed by this UI guard. Actual Supabase staging sign-out/OAuth, refresh, authorization and RLS write protection need real nonproduction accounts and evidence. Native browser 200%/400% zoom/AT, mobile Lighthouse and field p75 CWV remain open; no remote push/deployment.

## 2026-10-18 — Profile avatar accessibility and truthful persistence

- [x] RED tests verified the profile photo trigger was not a semantic keyboard-focusable button and a failed `updateProfile` returned false while the view still announced avatar success. Converted trigger to a real labeled 44×44px button with focus outline, disabled/busy state and hidden file-input activation; success toast now requires confirmed `updateProfile.success`.
- [x] RED storage service regression exposed two writes: `storageService.uploadAvatar` directly updated `profiles` and the page then called guarded `useAuth.updateProfile` a second time. Avatar upload now returns URL only; the account-scoped hook performs the sole requested profile write. JPEG/PNG/GIF/WebP and 5MB service validation remain.
- [x] Focused ProfilePage + storage service 8/8 GREEN. Full Node24 QA: Vitest 189/189 (44 files), Chromium UI 60/60 0 failed/flaky, eslint 0 warnings, PWA production build, 11-critical-asset smoke 311319/320000 bytes, npm security audit zero known vulnerable dependencies. Structured XML/JSON imported to Oracle phase4.
- [x] **Historical cross-account bookmark issue (resolved locally in `96cbee0`).** Previously, A bookmarks were visible to B because Redux persistence had no owner. User-approved v2 account shelves with consent-only legacy migration now cover A→B, guest, pending identity and actual persisted rehydration; staging/production confirmation remains open in later QA sections.
- [ ] Native browser zoom, screen reader WCAG 2.2 AA, real Supabase RLS/account upload/CRUD and mobile Lighthouse/field CWV remain unverified. Mocked tests do not prove actual storage authorization; no push/deployment.

## 2026-10-18 — Account-keyed bookmarks with consent-only legacy migration

- [x] User approved account-specific shelves and preserving all unknown-owner legacy data without silently assigning it. Redux-Persist v1 → v2 migrator quarantines unowned IDs and cached posts intact as `legacyUnassigned`, with separate `accounts[verifiedId]` and `guest` shelves.
- [x] Scoped selectors and mutation handlers hide A records from B, guest items from accounts, and all shelves during inconsistent/pending auth. Current-owner clear does not erase other users. Stale A-render click handlers cannot save to B after an identity transition (RED/GREEN regression).
- [x] The protected bookmark page offers an explicit owner acknowledgment checkbox and separate import button, never auto-importing on sign-in. Missing cached post metadata still leaves an ID visible; duplicate and orphan caches preserved in account on explicit import. Consent state resets across owner changes.
- [x] Pure migrator tests + actual redux-persist serialized v1 rehydration tests; account isolation/hook action tests; protected UI import unit tests; real Chromium dev fixture import at 320 and 1440 widths, 2/2 functional PASS. Existing loaded/empty bookmark and profile visual fixture data models updated.
- [ ] Existing bookmark screenshot baselines did not match current rendered geometry in optional visual baseline runs (4 screenshot comparisons failed). Preserve expected images; separately review and approve visual changes instead of mass updating screenshots. This remains a visual acceptance gate.
- [x] Final source release QA job `job-750a0a5f179d` exit0: 203/203 Vitest (48 suites), 60/60 Chromium UI, ESLint no warnings, PWA build, smoke 11 assets and 314022/320000 JS entry, dependency audit 0 known vulnerabilities; separate explicit import browser 2/2 PASS. JUnit/Playwright structured reports imported to Oracle phase4. Runtime status still flags a Node24 version recheck.
- [ ] Root persistence stores per-account keys/records on the **same device**, not encrypted or remotely synchronized. Staging real Supabase authorization/RLS and role-based operations, native zoom/AT, Lighthouse mobile performance and field CWV p75 still not signed off. No remote push or deployment.

## 2026-10-18 — Historical visual drift investigation and bookmark text reflow

- [x] Compared identical four bookmark screenshot cases from **pre-migration 7743e51** source and post-migration 96cbee0; both showed **4/4 snapshot mismatches** with the same image dimensions. The optional failed visual run is pre-existing reference drift, not a migration-caused screenshot size regression. Preserve baselines pending design review.
- [x] Discovered actual new responsiveness bug using 320px/200% CSS text enlargement: empty bookmark archive grid stretched a confirmation button past viewport (right ~447px). Applied minmax(0,1fr), safe child wrapping and bounded import/back controls; three Chromium functional tests now pass, including keyboard Space/Enter and 44px button target.
- [x] Added actual in-memory persistStore flush/restart/re-hydrate regression for owner A/B/guest independently, without persisting authenticated identity; store verification passed.
- [ ] The browser test scales root CSS font-size to 200%, not native browser zoom. True native zoom 200/400%, manual screen-reader review, existing visual pixel approval, Supabase staging RLS/OAuth and field mobile CWV remain open.

## 2026-10-18 — Genuine Chromium 200%/400% zoom smoke

- [x] Added reproducible **native browser zoom** QA harness `scripts/qa/native-browser-zoom.mjs` (dedicated Xvfb + headed system Chromium + OS `xdotool` Ctrl++). Browser devicePixelRatio **1→2→4** and CSS viewport **1280→640→320** were actually measured. It is **not** CSS-only font enlargement or DPR emulation.
- [x] Nine selected public/auth-controlled fixture routes × 100%/200%/400%: **27/27** with no document-level horizontal overflow, exactly one main and at least one h1; 0 uncaught browser pageerrors. 400% Login email/password/submit focus/bounds and legacy owner acknowledgment + keyboard import passed without backend form submission. Full details and repeat command: `design/NATIVE-BROWSER-ZOOM-QA.md`.
- [ ] This closes only sampled native Chromium zoom/reflow automation. Manual VoiceOver/NVDA screen reader, full tab/focus order, 400% all authenticated/editor/admin screens, WCAG 2.2 AA acceptance, visual snapshot drift review, real Supabase staging auth/RLS and mobile Lighthouse/field CWV **remain open**. No user/production browser profile touched; no push/deployment.
- [x] Verified source QA job `job-880c165a4f4a` exit0: Vitest **204/204** in 48 suites; regular Chromium UI E2E **60/60**; lint, PWA build, 11-asset smoke (entry **314022/320000** bytes), security npm audit **0 known vulnerabilities**. Dedicated final Xvfb/system Chromium native zoom run **27/27** and 400% keyboard Login/legacy import passed; all three structured JUnit/Playwright reports imported to Oracle phase4. A temporary earlier native retry failed when its preview server expired; a fresh-server rerun passed and supersedes that interrupted run.

## 2026-10-18 — Native Chromium 400% settled keyboard focus sampling

- [x] Expanded dedicated Xvfb native zoom harness beyond geometry to **real sequential Tab traversal** at genuine 400% browser zoom, waiting 235ms per focused element for 160ms skip-link CSS animation completion. Early 55ms offscreen skip-link report was an animation-timing false positive: it becomes visible when the transition completes; no unproven CSS fix was applied.
- [x] Four controlled/public UI sequences **4/4 PASS**, **81 sampled focus positions**: Login24, Home48 (bounded), Legacy Bookmarks2, Populated Bookmarks7. Every sampled control had `:focus-visible`, viewport intersection and no observed midpoint occlusion. Native 27/27 geometry/landmark checks also pass.
- [ ] This is a bounded automated sample, **not** an exhaustive WCAG 2.2 AA or screen reader audit. Manual assistive-technology/focus indicator size and contrast, other protected editor/admin screens, staging RLS/auth, open visual image baselines and field CWV remain pending.

## 2026-10-18 — Native 400% protected workbench focus and sticky-column correction

- [x] Added two 320px keyboard-to-admin-table E2E regressions. Before change at detached `250b532`: **0/2 PASS**; frozen first column covered focused role selectors in Users and publish/edit/delete controls in Posts. Scoped CSS fix at `max-width:360px` removes first-column stickiness; new E2E **2/2 PASS**.
- [x] Expanded isolated Xvfb true-Chromium 400% zoom harness to mocked Editor/Knowledge/Admin screens. **27/27** original native zoom route checks + **8/8** keyboard focus sequences (**124 sampled positions**) PASS, including Admin Users and Posts. No account credentials or server writes used.
- [x] Admin existing responsive/visual comparison: two new 320px focus cases and existing tab arrow-key test pass. Four existing light/dark screenshot comparisons at 390px/1440px still fail identically on old `250b532` and current code (desktop 1184→1190 height, mobile 1379→1398). **Keep visual baseline acceptance OPEN; no snapshots updated.**
- [ ] These fake-service browser fixtures do not establish production author/admin accessibility or Supabase permissions. Manual AT/WCAG2.2AA, protected staging role/RLS tests, image baseline visual signoff, field CWV and mobile Lighthouse performance remain unfinished.

## 2026-10-18 — Mobile menu initial-load/on-demand experiment rejected

- [x] Built old `5ae3813` and deferred-Sheet candidate separately and compared **three alternating Lighthouse 13.5 mobile pairs**. Median score **59→60**, FCP **3860→3341ms**, LCP **4727→4343ms**, TBT **594→746ms**. Candidate initially sent 13,544 fewer JS bytes but degraded interactive menu latency.
- [x] Actual CDP lab 4× CPU/150ms RTT + constrained throughput, three cold-context first-menu samples: baseline median **423ms** versus candidate **1382ms**. On-demand experiment therefore **reverted entirely**, keeping original Header and prewarmed E2E acceptance. No measured mobile performance release success claimed.
- [x] New read-only `scripts/qa/mobile-menu-startup.mjs` local production-preview QA guard: prewarmed baseline **3/3 PASS**, rejected experiment **3/3 expected FAIL**, no user data or external services. Full reproducibility and limitations in `design/MOBILE-MENU-PERFORMANCE-AUDIT-20261018.md`.
- [ ] Genuine field p75 LCP/INP/CLS, statistically reliable mobile Lighthouse performance gains and safe React startup/main-thread optimizations remain open. No push/deployment.

## 2026-10-18 — Initial zero-scroll fallback anchor geometry avoidance

- [x] New RED→GREEN `useScrollAnchorTransition` regression: while reader is at top, initial hook commit no longer performs a forced DOM geometry read; scrolling again samples the anchor, and existing fallback→live delta compensation behavior stays intact. Changed only the small 0px branch, not restoration for scrolled readers.
- [x] Three interleaved mobile Lighthouse 13.5.0 lab A/B runs: baseline→candidate score medians **57→59**, LCP **4868→4728ms**, FCP **3984→3855ms**, style/layout **1568→1510ms**, TBT **602→607ms**. Candidate LCP slightly improved in all three pairs but TBT not consistently better. **Mobile performance release gate still OPEN**, no field p75 or statistically significant gain claimed.
- [x] Retained preloaded mobile menu with constrained-network/4× CPU first-click lab 416/587/670ms (**3/3 PASS** under 900ms) and must preserve article history exact-card restoration regression. Full method and limits: `design/HOME-INITIAL-ANCHOR-REFLOW-QA-20261018.md`.
- [ ] React/vendor heavy evaluation and remaining synchronous reflow, mobile Lighthouse acceptance and production p75 INP/LCP/CLS remain unverified; manual WCAG/Supabase staging and design screenshots also open.
- [x] Final hook experiment job `job-058e16d07686` exit0: 205/205 Vitest, 60/60 Chromium E2E including article history card restoration, ESLint, PWA build, smoke (11 assets, main entry 314094/320000), npm audit0; 3/3 mobile menu latency under 900ms. Still only small lab LCP improvement; performance gate OPEN.

## 2026-10-18 — Production go/no-go inventory, full visual CI blocker

- [x] Inspected **live read-only** GitHub Pages: production HTTP200, `/release.json` source `cba2c86` built 2026-09-28; new implementation in isolated branch 64 commits ahead of main, main itself clean. Public `/knowledge-backend-status.json` still reports `ready:false` (artifact flag, not definitive DB schema status).
- [x] Ran **entire** required Playwright visual CI suite without updating snapshots: **115 scenarios, 34 PASS and 81 FAIL**. All 81 failures are screenshot diffs (**49 dimension** + **32 pixel-level**), not proof of 81 functional defects. Prior Admin/Bookmark A/B samples were already mismatched before recent changes; the remaining screenshot differences require manual triage and design approval. **CI deploy is blocked until 115/115 green.**
- [x] Release path audited: `main` merge triggers automatic GitHub Pages deploy after CI, stamps exact SHA and tests production; production Supabase migrations are a distinct confirmation-only manual workflow. No merge/push/deploy authorized. Added fail-closed read-only release inventory script with tests. Detailed report: `design/RELEASE-GO-NOGO-2026-10-18.md`.
- [ ] Release remains **NO-GO** until reviewed visual acceptance + full green CI, isolated staging OAuth/RLS/CRUD evidence, manual WCAG2.2AA + mobile performance signoff, owner-approved rollback/cutover. No real-user data or production DB mutation.

## 2026-10-18 — Staging identification and screenshot review batch 1

- [x] Read-only GitHub environments inventory found only `github-pages` and `production`; staging Supabase config not present in the agent session. **No assertion** that staging does not exist elsewhere. Created safe `scripts/qa/staging-readiness.mjs` requiring a distinct Supabase project ref, refusing production and printing no secrets; no write or login operations, fail-closed until safe independent staging configured.
- [x] Produced full 81-case visual discrepancy inventory by area: Home8, Article/Author14, Editor6, Knowledge8, Admin10, Profile/Bookmarks10, Auth/Error15, Navigation2, other8. 49 size +32 pixel. Representative Home/Article/Admin old-versus-new side-by-side screenshot reviewed, **not signed off**, available as Oracle-private evidence. See `design/VISUAL-REVIEW-INVENTORY-2026-10-18.md`.
- [ ] Need design owner approval for accepted new hero/typography/layout and each responsive visual group before baseline refresh. Need independently configured *nonproduction* staging with synthetic A/B test users and genuine auth/authorization evidence; public capability probes alone do not pass release.
- [x] `npm run verify` now includes `verify:release-guards` (Node test runner for 7 release/staging fail-closed tests); staging owner/A-B-C RLS acceptance matrix is documented in `design/STAGING-AUTH-RLS-ACCEPTANCE-2026-10-18.md`. **This is safe local scaffolding only, NOT backend signoff.**

## 2026-10-18 — Owner approved Home editorial direction, snapshot signoff still pending

- [x] Owner explicitly approved the shown **dark editorial Home masthead/featured cover direction** (CD-012), compatible with approved H-01/C-02/TYPE-02. Keep dark cover in light theme; **do not revert** to prior light-hero screenshot solely to silence CI.
- [x] Compared current vs old Home at desktop and 390px mobile light/dark. Four full Home screenshot mismatches marked `direction-approved / exact pixels pending`; 4 other discovery/empty/filter states are not covered by this design approval.
- [x] Fresh production build: four visual-direction UI tests (light/dark at 390/1440) **4/4 PASS** for approved dark Hero CSS tokens, H1 contrast ≥4.5, search, featured link, visible ≥44px archive CTA and no horizontal document overflow. Earlier 0/4 stale-prebuilt preview was an invalid source comparison, not a functional dark-theme bug.
- [ ] No golden PNG updated by conceptual signoff. Conduct full exact-image accessibility/layout review and approved baseline changes case-by-case, then entire 115-case CI visual run; staging authenticated RLS and production release remain NO-GO pending other QA gates.
- [x] Exact source after CD-012 approval: **64/64 Chromium product E2E**, **205/205 Vitest**, **7/7 release guard checks**, lint/build/security pass. Light/dark Home editorial invariants added, but **81/115 visual baseline differences and real staging RLS are not cleared**.

## 2026-10-18 — Article and Author responsive visual triage

- [x] Re-reviewed 14 existing Article/Author failing screenshot cases (4 dimension mismatches: Article desktop light/dark +21px, mobile light/dark +53px; 10 Author pixel diffs 2–11%). Separately compared old/current Article light/dark desktop/mobile and author portfolio/not-found/unavailable mobile.
- [x] Added six non-screenshot Article reading layout invariants across 320/390/1440 × light/dark: accessible H1/title/quick-brief/cover alt, no horizontal overflow/heading clipping and ≥44px named mobile actions. Focused run: **6/6 functional PASS**, **14/14 existing screenshot comparisons still FAIL**. See `design/ARTICLE-AUTHOR-VISUAL-TRIAGE-2026-10-18.md`.
- [ ] Article/Author exact visual direction NOT yet accepted as golden reference. Keep 14 screenshot mismatches OPEN until reviewed by owner; no mass `--update-snapshots`/tolerance relaxation. Full visual CI, staging OAuth/RLS and manual WCAG still release-blocking.

- [x] After adding six Article accessibility/layout test cases, full Chromium visual CI suite retested: **40/121 PASS, 81 screenshot FAIL**, all failures still `toHaveScreenshot`, no new functional failures. Visual release gate remains BLOCKED; no goldens rewritten or pixel-diff tolerance lowered.

## 2026-10-18 — Article Studio modern design proposal (not yet accepted)

- [x] User requested a **more modern Article screen** than the old Fraunces/newsprint reading view. Built isolated Article Studio concept: dark immersive cover both themes, large readable Inter display title, overlapping rounded cover image, reworked outcome card, accessible category/evidence metadata and refined mobile action dock. Previous Home CD-012 remains unchanged; no golden snapshots or deployment.
- [x] Six new design/accessibility Chromium cases (320/390/1440 × light/dark) + existing six Article release contracts **12/12 PASS**. Fixed low contrast of global light-theme author-tested badge on the dark cover; new checks require verification label contrast ≥4.5. Genuine native 100/200/400 Chromium zoom **27/27** and eight focus sequences **8/8 PASS**.
- [ ] Article Studio is **preview only, owner design acceptance OPEN**. Do not replace goldens or claim release, full WCAG manual and Supabase staging still outstanding. See `design/ARTICLE-STUDIO-CONCEPT-2026-10-18.md`.
- [x] Article Studio candidate final QA: 205/205 Vitest, 64/64 Chromium product, 12/12 Article responsive/contrast, 27/27 native real zoom and 8/8 bounded focus, lint/PWA build/smoke/security PASS. **Still preview-only**, all screenshot baseline acceptance/real staging/production gates OPEN.

## 2026-10-18 — Author Studio adaptation, visual proposal

- [x] After user agreed to adapt approved Article Studio styling to the public Author page, created a modern dark-forest masthead, large Inter name, real author-bio and role, decorative monogram, anchored published-work CTA, three real-data summary cards, lighter elevated content block, plus refreshed missing-author/error treatment. Screenshot collages captured from real local Chromium for light/dark desktop/mobile. **Only a candidate**, not owner pixel approval or golden update.
- [x] New 9-case independent author QA covers light/dark × 320/390/1440 profile with heading/contrast/CTA/nav/author statistics/overflow and three negative 320px recovery paths. Source implementation uses no fake profile metric, no production data and no new authorized actions.
- [ ] Visual acceptance of Author Studio, related old golden snapshots, real staging RLS and full release quality gates remain open. See `design/AUTHOR-STUDIO-CONCEPT-2026-10-18.md`.

- [x] Author Studio prototype after full QA: Vitest **205/205**, release guards **7/7**, full product Chromium **64/64**, new Author responsive/negative scenarios **9/9** PASS; ESLint, build/PWA smoke and npm audit PASS. Existing Author golden samples **8/8 FAIL (screenshot only)** and saved as failed Oracle evidence, no snapshot overwrite. **Owner visual approval still pending.**
