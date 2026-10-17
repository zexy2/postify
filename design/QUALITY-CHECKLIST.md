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
- [ ] **Cross-account bookmark isolation — confirmed QA risk, migration design needed.** Redux persists global bookmarks without an account owner. Minimal reducer scenario: save ID under account A, dispatch logout, authenticate B; `selectBookmarkedIds` still returns A's ID to B. Do not silently delete legacy user bookmarks or assign their ownership to a later account. Decide/approve account-keyed persistence plus safe existing-data migration (or explicitly opt into shared-device bookmarks), then test A→B/refresh/rehydration before release. No migration applied this turn.
- [ ] Native browser zoom, screen reader WCAG 2.2 AA, real Supabase RLS/account upload/CRUD and mobile Lighthouse/field CWV remain unverified. Mocked tests do not prove actual storage authorization; no push/deployment.
