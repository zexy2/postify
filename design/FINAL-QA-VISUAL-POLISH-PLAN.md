# POSTIFY — Aşama 11 / Final QA & Visual Polish Planı

**Tarih:** 2026-10-17
**Durum:** **CD-011 ONAYLANDI — QA-02 Editorial Excellence ana plan + QA-03 güvenlik, WCAG 2.2 AA, veri bütünlüğü ve performans zorunlu kapıları.** Aşağıdaki seçenek karşılaştırmaları ilk araştırmanın tarihsel kaydıdır.
**Yetki:** **Yalnız plan/dokümantasyon.** QA testleri bu aşamada çalıştırılmadı; yeni UI CSS/JS/React/font varlıkları yazılmadı, uygulama kaynağı veya kullanıcı verisi değiştirilmedi, GitHub push veya deploy yapılmadı.
**Ana ilke:** Onaylı bir tasarımın **belgelenmiş olması** ile **uygulanmış / WCAG 2.2 AA ölçülmüş / yayına hazır olması** üç farklı durumdur. Bu plan sonuncusunu iddia etmez.

## 0. Değişmez tasarım sözleşmesi

| Karar | Onaylı yön | Aşama 11 QA karşılığı |
| --- | --- | --- |
| CD-001 | Uygulanabilir saha rehberi + bağımsız yayın | Makale içerik/kanıt işlevleri ve editorial kimlik |
| CD-002 | MOOD-02 bağımsız issue, MOOD-01 kanıt kullanılabilirliği | Gösterişli featured bile bilgiye erişimi bozmaz |
| CD-003 | PL-01 Oxide & Newsprint light/dark | Kontrast ve semantik success/error/unknown durumları |
| CD-004 | TYPE-02 Fraunces, Inter, IBM Plex Mono | Gerçek font dosyası/metriği, TR/EN ve fallback |
| CD-005 | G-01 Editorial Spine genel, G-02 yalnız selected featured dossier | Container/measure/grid ve istisna kapsam denetimi |
| CD-006 | C-02 Inked Folio | Bilgi kartları, form, nav, state komponentlerinin ortak grameri |
| CD-007 | H-01 Issue Front | Öne çıkan kapak + ulaşılabilir arama ve keşif |
| CD-008 | INNER-02 evidence marginalia + INNER-01 sakin okuma; sınırlı INNER-03 teknik | TOC/kaynak akışı, auth görev ilkeli, editör |
| CD-009 | M-02 Editorial Rhythm; auth/editor/admin/makale M-01 kadar sakin | Reduced motion, etkileşimde gecikme yok, featured-only dekoratif motion |
| **CD-010** | **R-01 genel; R-02 yalnız makale/kanıt; R-03 yalnız auth/editör/admin/knowledge; her ekranda WCAG 2.2 AA** | Responsive ve manual/automated a11y release blocker |

**Onaysız ek yaratıcı karar üretme:** Renk/font ailesi, grid ve özellik genişletmek veya gerçek issue/verified metadata üretmek Final Polish değildir. Değişiklik gerekiyor ve tasarım yönünü etkiliyorsa ayrı değişiklik kaydı/önizleme/onay gerekir.

## 1. Üç Aşama 11 uygulama/kanıt planı alternatifi — HİÇBİRİ KULLANICI TARAFINDAN ONAYLANMADI

QA-01/02/03 farklı kalite **kapsamı ve kanıt derinliği** önerir. Bütün seçeneklerde mevcut ürün fonksiyonlarını korumak ve **WCAG 2.2 AA'ya ulaşmak ve bunu doğrulamak zorunludur**; daha dar plan, AA'dan muafiyet demek değildir.

### QA-01 — Essential Release Gate / Temel Yayın Kontrolü

**Çalışma:** 17 route, önemli gerçek akışlar, representative mobile/tablet/desktop, otomatik a11y, basic design-token/composition diff, unit/E2E, build ve SEO/PWA smoke. P0/P1 hata varsa dur.

**Artı:** En az tekrarlı çalışma; hızlı kusur tarama.
**Risk:** H-01 Issue Front + C-02 Inked Folio'nun editorial mikrodetaylarını ve az rastlanan durum kombinasyonlarını sistematik yakalamak güçleşir. Yine WCAG 2.2 AA manuel değerlendirmesi atlanamaz.

### QA-02 — Editorial Excellence / Görsel Yayın Standardı

**Çalışma:** QA-01 üzerine **bütün route ailelerinde** ışık/karanlık, TR/EN, görsel içerik/boş durum, 320–1920 genişlik, gerçek fontla pixel-level değişim ve kullanıcı görevlerine göre ekran görüntüsü karşılaştırmaları. Yazı uzunluğu, micro-type, 715px okuma ölçüsü, baskı benzeri çizgi/ayraç, featured-only istisna, motion/reduced, focus/hover, form invalid/loading/empty/fallback, sticky/focus çakışmalarında ayrıntılı polish checklist.

**Artı:** Awwwards seviyesine yaklaşmayı amaçlayan editoryal tutarlılık; sistematik before/after değerlendirme ve kullanıcı görünür onay durakları.
**Risk:** Daha yoğun görsel inceleme ve manuel onay, üretim takvimini uzatabilir. Screenshot çokluğu WCAG/işlev testi yerine geçmez.

### QA-03 — Reliability & Performance Assurance / Sağlamlık ve Hız Odaklı Kontrol

**Çalışma:** QA-01 üzerine özellikle etkileşim güvenliği, gerçek login/publish/role/verification veri state'leri, düşük güçlü mobil cihaz, throttle, dark/theme/zoom, offline/fallback, genuine font/Web Vitals ölçümü; bundle/focus/semantic/SEO/PWA regresyonuna daha fazla kaynak.

**Artı:** Güvenilir ve hızlı üretim sistemi; veri/rol/SEO regrezyon risklerini erken yakalama.
**Risk:** Editoryal son piksel/optik boşluk ritmi QA-02 kadar titiz değerlendirilmezse karakter kaybı olabilir.

**Tasarım yönetmeni önerisi — ONAY DEĞİL:** **QA-02 Editorial Excellence** ana planı, **QA-03'ün güvenlik, a11y, performans ve veri bütünlüğü kapıları zorunlu** olarak. Bu kombinasyon görsel kaliteyi üretim gerçekliğiyle bağlar. QA-01 temel kontrolleri her iki planda da vardır. Plan onayı **test çalıştırma, kod yazma veya yayın izni değildir**.

## 2. QA sırası ve karar kapıları

| Kapı | İş | Kanıt/çıktı | İzin durumu |
| --- | --- | --- | --- |
| 11.0 | Approved decisions freeze: CD-001..010, component/route/state envanteri | Değişmez tasarım kontratı ve bekleyen kararlar | Yalnız plan hazırlanıyor |
| 11.1 | Eski **çalışan ürün** görsel/functional baseline; ayrık screenshot referans | Tarihli baseline seti, browser/font build bilgileri | **Plan, henüz çalıştırılmadı** |
| 11.2 | Kullanıcının **ayrıca açık izniyle** onaylı sistemin application CSS/JS/fontlarına izole worktree'de uygulanması | Küçük, geri alınabilir commit'ler; before/after | **İzin verilmedi — BLOCKED** |
| 11.3 | New design UI visual review (screenshot/diff + manuel art direction) | Route/state/viewport karşılaştırması, polish defect list | Kod olmadığı için **BLOCKED** |
| 11.4 | Functional + accessibility QA, TR/EN/light/dark, keyboard + AT | Test runs, reproducible issue, WCAG criteria-by-criteria sonuç | **Plan; authenticated fixture gerekli** |
| 11.5 | Performance, SEO/PWA, security, fallback/recovery | Lab traces, field stats varsa p75, CI run, release checklist | **Plan, çalıştırılmadı** |
| 11.6 | Gate remediation + acceptance: P0/P1 sıfır, kalan P2 gerekçesi | Audit pack, changelog, before/after comparison | Kullanıcıyla karar gerekli |
| 11.7 | Release candidate ve kullanıcı **ayrı deploy onayı** | Tag/rollback/deploy/checks | **İzin verilmedi — BLOCKED** |

**Önemli ayrım:** Aşama 11 QA **planının** onaylanması, aşama 11 testlerinin geçildiğini ya da implementasyon/deployment'ın başladığını ifade etmez. Önce bu plan onayı; ardından ayrı **tasarım uygulama talimatı** beklenir. Yeni plan değişikliği kullanıcı onayı ve `DESIGN-DECISIONS.md` gerekçesiyle yönetilir.

## 3. 17 rota, kritik gerçek user-flow ve state kapsamı

| Aile | Yol / işlev | Korunan state / test sözleşmesi |
| --- | --- | --- |
| Home | `/` | H-01 featured kapak, arama Ctrl/⌘K, kategori/type/evidence/freshness/read time/sort, URL query/history, zero, fallback, loading, 9-item load more, bookmark |
| Article | `/posts/:id` | INNER-02 kaynak özeti, genuine verified / author-claim / unknown / stale; TOC, rich content/code copy, related, feedback/comment, bookmark, mobile action bar, 404 |
| Public author | `/users/:id` | Gerçek yazar, not-found, profile visibility, listed posts, legal/accessible landmark |
| Auth (5) | `/auth/login`, `register`, `forgot-password`, `reset-password`, `callback` | OAuth failure/timeout, email/password validation, submit/loading, redirect back, focus/error and safe reset |
| Creation/edit | `/posts/create`, `/posts/:id/edit` | Real rich text/Tiptap, draft preserve, autosave, source/evidence, image upload, publish-readiness, permission denied |
| Personal | `/bookmarks`, `/profile` | Auth redirect, empty/populated, add/remove, profile editing, avatar/error |
| Workbench | `/knowledge`, `/admin` | R-03 tables, role permissions, evidence queues, real status/capability fallback, moderation confirmation |
| Static | `/about`, `/contact`, wildcard 404 | H-01 brand voice, useful CTA, URL recovery, heading, metadata, i18n |

**Protected states:** 6 protected route contents and real write flows **currently lack authorized test account/session fixtures**. They must be verified against an isolated, safe staging or dedicated test account. Do **not** use real user data, fake successful publish/verifications or bypass RLS. Without these fixtures, release evaluation remains explicitly **blocked/unverified**, never “pass”.

## 4. Görsel polish ve cihaz/tema matrisi

**Genişlikler:** 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 CSS px; portrait/landscape as appropriate. **Gerçek** browser 200%/400% zoom ayrı, viewport emülasyonuyla ikame edilemez. TR/EN (uzun metin), light/dark, normal/reduced motion; 1x ve uygun olduğunda retina 2x screenshots.

**Bütün route family'lerde görsel gözlemler:**
- Fraunces/Inter/IBM Plex Mono gerçek font load, fallback ve `font-display`; self-host/subset ve lisans/delivery kullanıcı uygulama iznine bağlı; 8–12px metadata okunur düzenlenmeli.
- Typographic hierarchy, baseline rhythm, line wrapping, `ch` measure ve 715px okuma genişliği; alan/reflow nedeniyle overflow/kesilme olmamalı.
- H-01 editorial promise, search ve featured cover küçük ekranda gerçek discovery feed'i gizlememeli.
- G-01 grid tüm sayfalarda; G-02 kompozisyonu yalnız featured dossier, normal kart/auth/admin'de **yok**.
- C-02 ayraç/çerçeve/CTA kullanımı odak ve boş durumunu bozmamalı; semantic success/error/warning/unknown yalnız renk değil.
- INNER-02 evidence rail desktop + mobil kısa kaynak özeti, TOC/fixed action + toast + keyboard/focus örtüşmeleri.
- M-02 özel featured cover transition; form/auth/editor/admin M-01 sakin ve anlık, reduced motion tüm dekoratif hareketleri kaldırır.
- Placeholder/empty/error/loading/offline/backend-fallback ekranlarında sözcük/ikon/durum açıklığı, skeleton CLS.
- Sayfa içeriğinin görsel tasarım nedeniyle kesilmemesi; CTA görseli art-direction ile kaybolmaması.

**Onay paketi:** Aynı route, aynı içerik fixture, aynı viewport, aynı light/dark ve language state ile before/after screenshot; manuel kabul/red gerekçesi. Statik prototip görüntüleri **ürün implementation baseline değildir**.

## 5. Doğrulanabilir işlev ve kalite kapıları

### 5a. İşlev ve repo kontrolü
Planlanan (şimdi çalıştırılmadı) komutlar:
- `npm run verify`: knowledge verification + Vitest + ESLint + build + built smoke test (script gerçek side-effect'leri önce kontrol edilmeli: prebuild runtime status ve knowledge artifacts üretir).
- `npm run verify:security` yalnız uygun test ortamında, release security check.
- `npm run test:e2e:ui` ve `npm run test:e2e:visual` / Playwright, uygun izolasyonla güncel app behavior ve screenshot regressions; doğru port/reporter/baseline onaylanmalı.
- Test fixtures must not inadvertently overwrite committed screenshots, manipulate production data or disrupt running services. Commands and exact variants confirmed at execution permission gate.

**Release engelleri:** Auth/RLS bypass, wrong verification badge, user draft loss, failed publish falsely signaled, broken bookmarks/search/filter/route, lost SEO canonical/hreflang/JSON-LD, production PWA/SPA 404 redirect, uncontrolled personal data / destructive action.

### 5b. WCAG 2.2 AA (gerekli)
- Normal text ≥4.5:1, büyük text ≥3:1, gerekli UI border/focus/icon ≥3:1; dekoratif `#C8B89E` paper karşısında ~1.70:1 olduğu için **işlevsel control edge/focus olarak tek başına kullanılamaz**.
- Text resizing 200%, real zoom/reflow, custom text spacing, logical reading and DOM order, one page-level main landmark, meaningful headings.
- Keyboard-only, skip-to-content, visible focus, focus not obscured by sticky header/action/toast, Escape/drawer/command palette focus return, no traps.
- Meaningful accessible names for article TOC/artifact/source links; descriptive controls; form labels, real error/state announcements, `aria-live` chosen judiciously.
- WCAG 2.2 2.5.8 targets 24×24 or contextual spacing/inline exceptions; 44×44 recommended important touch action.
- Reduced motion semantic information still visible, functional status not hidden behind animation; actual iOS VoiceOver / Android TalkBack / NVDA manual sample and axe/DOM checks complement each other.
- **No release acceptance** if AA failure remains, even when Lighthouse/axe score is 100; no false “WCAG-certified” claim.

### 5c. Performance / real delivery
**Proposed objective (not a measured current outcome):** Good Core Web Vitals where field data exists: p75 LCP ≤2.5 seconds, INP ≤200ms, CLS ≤0.1. Lab: mobile throttling and low-power CPU, at least repeated runs, compare baseline/candidate consistently. Test hero art/fonts/sizes, preloads only when justified, CSS budget, cache/PWA, image variants, task interaction response. No fake p75 or current score claims; Lighthouse alone cannot establish live field Core Web Vitals. If p75 unavailable, mark **not measured in field**, not fail/pass speculation.

### 5d. SEO / PWA / security regression
Route canonical/OG/JSON-LD/hreflang, sitemap/robots, GitHub Pages 404 SPA fallback, selected content source slugs, page language, offline read-only content explanation, state-safe admin/login routes, CSP/font external requests; protect existing env/keys.

## 6. Defect severity, acceptance evidence, exit conditions

**P0 Blocker:** security/data disclosure, lost data/drafts, unauthorized privilege, false publication/verification, critical keyboard trap, indispensable flow inaccessible. **P1 High:** significant WCAG AA unmet, major route/auth/search/feed failure, critical content/focus occlusion, major mobile layout break or essential resource hidden. **P2 Medium:** visual misalignment, noncritical empty-state/typographic readability, content copy issue that doesn't change claims. **P3 Minor:** subtle optical detail with no functional effect.

**QA acceptance prerequisite:** Zero unresolved P0/P1 for considered release, WCAG 2.2 AA evidence in all functional route families and important states, relevant E2E/unit/security + baseline diff completed, visual design gate owner approval, performance evidence or explicit unknown state, release rollback plan and separate deployment approval. P2/P3 may be documented with owner and date; any WCAG AA issue is P1/P0 regardless of visuals.

## 7. Oracle checkpoint, proof pack, user decision

At each *future authorized* milestone store: Git SHA/worktree, date and env, tested real page/state, viewport/theme/lang, screenshot/trace refs, WCAG criterion, severity, test output, limits, next action, rollback safety. Do not claim done for tasks not run.

**Aşama 11 alternatives currently pending:** QA-01 Essential Release Gate, QA-02 Editorial Excellence, QA-03 Reliability & Performance Assurance or a clearly scoped hybrid.

**Recommended (unapproved) final plan:** **QA-02** plus the critical **QA-03 performance/security/a11y/data checks**. This can be *approved as a plan only*. Its adoption completes creative planning, **not visual reimplementation, test execution, acceptance, or launch**. When approved, ask for explicit separate implementation authorization/scope and preserve original main worktree, services, credentials and user modifications.


## 8. CD-011 — ONAYLI kalite planı ve ayrı execution yetki kapısı

**Tarih:** 2026-10-17. Kullanıcı **QA-02 Editorial Excellence** ana planı ve **QA-03'ün güvenlik, WCAG 2.2 AA, veri bütünlüğü ve performans** denetimlerini zorunlu kapılar olarak açıkça onayladı. QA-01 taban regresyon kontrolleri kapsamdan çıkarılmadı. Bu kararın birebir metni \`DESIGN-DECISIONS.md\` içindeki CD-011 kaydındadır.

**Öncelikli kalite mantığı:** Gerçek görsel polish + mevcut işlevleri ve verified/claim/unknown ayrımını koruma; 17 rota, her önemli state ve korumalı akış, dark/light, TR/EN, real zoom/reflow/AT, güvenlik ve performance ölçümü; **P0/P1 açık hata ile çıkış yok**. WCAG 2.2 AA otomatik testler tek başına yeterli görülmeyen **zorunlu kabul standardıdır**, henüz doğrulanmış uygunluk iddiası değildir.

**İŞLEM YETKİSİ: YOK.** Bu onay kullanıcıya göre yalnızca planı kesinleştirir. React/JSX/CSS, font veya servis kaynakları **değiştirilmez**; testler **çalıştırılmaz**; GitHub push ve deployment **yapılmaz**. Gelecekte uygulama kodlaması ve test yürütmesi için ayrı açık izin; GitHub push veya canlı dağıtım için ayrıca açık onay beklenecektir. Çalışan servis, kimlik bilgileri ve kullanıcı değişiklikleri dokunulmadan korunur.

**Aşama durumu:** 12/12 onaylı planlama aşaması tamamlandı; uygulama/QA execution/release işleri **başlatılmadı**. Kullanıcı yetkisine kadar dur.
