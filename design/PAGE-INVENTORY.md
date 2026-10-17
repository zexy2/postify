# Postify — Pages & Components Inventory (Aşama 0)

**Durum:** Tüm route'lar envantere alındı; Aşama 0 onaylandı, Aşama 1 strateji seçimi bekleniyor.
**Yorum:** “Denetlendi” ≠ “Yeni tasarım onaylandı/uygulandı”.

## Public routes — 11
| # | Rota | Component | İşlev / önemli durum | Aşama 0 tarayıcı | Tasarım onayı |
| --- | --- | --- | --- | --- | --- |
| 1 | `/` | `HomePage` | Hero, featured, arama, topic/type, advanced filter, feed, fallback/empty | 390/768/1440 | Bekliyor |
| 2 | `/posts/:id` | `PostDetailPage` | Markdown, source/evidence, outline, reading progress, bookmark, feedback, comments; error/loading | 390/768/1440 örnek slug | Bekliyor |
| 3 | `/users/:id` | `UserPage` | Public author portfolio, trust counters, feed; loading/error/not-found | 390/768/1440 örnek author | Bekliyor |
| 4 | `/auth/login` | `LoginPage` | Email/password, OAuth, validation, redirect | 390/768/1440 | Bekliyor |
| 5 | `/auth/register` | `RegisterPage` | Register, validation, OAuth | 390/768/1440 | Bekliyor |
| 6 | `/auth/forgot-password` | `PasswordRecoveryPage(request)` | Request, invalid email, success | 390/768/1440 | Bekliyor |
| 7 | `/auth/reset-password` | `PasswordRecoveryPage(update)` | Reset, validation, completion | 390/768/1440 (hesap değişimi denenmedi) | Bekliyor |
| 8 | `/auth/callback` | `AuthCallbackPage` | OAuth waiting/timeout/error | 390/768/1440 (gerçek callback yok) | Bekliyor |
| 9 | `/about` | `AboutPage` | Yayın değerleri, inançlar ve CTA | 390/768/1440 | Bekliyor |
| 10 | `/contact` | `ContactPage` | Düzeltme, iletişim, GitHub dış linkleri | 390/768/1440 | Bekliyor |
| 11 | `*` | `NotFoundPage` | 404 / kurtarma indeksi / geri dönüş | 390/768/1440 | Bekliyor |

## Protected routes — 6
| # | Rota | Component | İşlev/denetlenmesi gereken gerçek state | Bu turun güvenli kanıtı | Tasarım onayı |
| --- | --- | --- | --- | --- | --- |
| 12 | `/posts/create` | `CreatePostPage` | Templates/Markdown-Tiptap, autosave, image, publish readiness/error | Redirect login; önceki tur yalnızca yerel örnek veriyle layout | Bekliyor |
| 13 | `/posts/:id/edit` | `CreatePostPage` | Existing post load, editor + update validation | Redirect login; gerçek içerik edit edilmedi | Bekliyor |
| 14 | `/bookmarks` | `BookmarksPage` | Saved/empty/clear/delete; gerçek kayıt durumu | Redirect login; önceki tur mock empty shelf | Bekliyor |
| 15 | `/profile` | `ProfilePage` | Account/avatar/edit, stats, error/loading | Redirect login; mock profile preview | Bekliyor |
| 16 | `/knowledge` | `KnowledgeDashboardPage` | Backend inactive/loading, current/stale evidence, queue, corrections | Redirect login; mock active/inactive states | Bekliyor |
| 17 | `/admin` | `AdminPage` | Admin auth, stats, users, posts, role/visibility/moderation | Redirect login; previous mock dashboard/tabs | Bekliyor |

## Sayfa olmayan ama tasarımda korunacak ekran durumları
Home: filter, zero results, fallback, loading, server timeout. Article: loading, error, not-found, source, new copy/runbook, bookmarks, comments unavailable. Auth: validation, OAuth pending/error, password success. Private: empty/loaded/error, modal confirmation, keyboard scrolling and protected redirect. Global: command palette, mobile navigation sheet, dark/light, progress/footer, toasts, error boundary, 200% text, reduced motion.

## Ortak UI alanları
| Bölüm | Mevcut component | Audit notu |
| --- | --- | --- |
| Header/nav/brand | `Header`, `BrandMark`, `CategoryNav`, `LanguageSwitcher` | Geniş navigasyon; mobil sheet + language/theme; responsive copy |
| Hero / keşif | `Hero`, `DiscoveryFilterPopover`, `EditorialFeed`, `KnowledgeCard`, `CommandPalette` | Ana mimari; filtering/empty/fallback/featured |
| Okuma | `MarkdownRenderer`, `ContentImage`, `ReadingProgress`, `CopyLinkButton`, `CopyableCodeBlock` | Uzun içerik ve code/readability kritik |
| Kanıt | `EvidenceBadge`, `KnowledgeEvidencePanel`, `LocalEvidenceActions`, `CommunityEvidenceDetails`, `VerificationRunbook`, `CorrectionSuggestionPanel` | Doğrulama ile yazar beyanı farklı tutulmalı |
| Yazma | `RichTextEditor`, `CreatePostPage`, `AuthorCorrectionQueue`, `AuthorFailurePanel` | Draft, publish-readiness, focus/validation |
| Hesap/UI | `ProtectedRoute`, `SystemStatus`, `ErrorBoundary`, `confirm-dialog`, `sheet`, `Footer`, `SEO` | Loading,error,dialog,keyboard ve metadata korunmalı |

## QA kapsamı ve açık alan
Bu aşamada **17 × 3 = 51 render**; gerçek hesap gerektiren 6 sayfanın **içerikleri değil redirect davranışı** tekrar teyit edildi. Ekran görüntüleri Oracle `/home/ubuntu/.oracle-dev/visual/postify-stage0`. Authenticated state ve gerçek backend testleri açık; tasarım uygulaması başlamadı. Sonraki aşama yalnızca kullanıcı Aşama 0'ı onaylayınca açılır.

## Güncel tasarım aşaması notu (2026-10-17)
Aşama 5 için üç farklı dış grid/okuma measure/spacing sistemi `GRID-LAYOUT-SPACING-OPTIONS.md` içinde geliştirildi. **G-01/02/03 onaylanmamıştır.** İçerik, giriş, makale ve korumalı sayfaların hiçbiri bu yeni gridle uygulanmadı; bu tablodaki “Bekliyor” durumları tüm sayfalar için geçerlidir.

## Güncel Stage 5 kararı (CD-005)
G-01 tüm rotalarda layout omurgasıdır; G-02 yalnızca onaylı istisna kapsamındaki öne çıkan editoryal dosyalar için değerlendirilebilir. Bu tablo sayfaların implementasyon durumu için geçerlidir ve hiçbir sayfa yeni sistemle **henüz uygulanmış değildir**.


## Aşama 6 bileşen sözlüğü — bekleyen karar (2026-10-17)

Mevcut component envanteri ve 17 rota için **C-01 Editorial Grammar / C-02 Inked Folio / C-03 Research Instruments** bileşen estetiği araştırıldı. Tüm seçeneklerin Home, Article, Auth, Profile, Editor, Knowledge ve Admin akışlarında aynı gerçek veri/role semantiğini koruması gerekir. `design/COMPONENT-SYSTEM-OPTIONS.md` içindeki kart/nav/form/evidence/loading/empty/error/disabled örnekleri yerleşim prototipidir ve gerçek ekran uygulanmış sayılmaz. **Aşama 6 için henüz kullanıcı seçimi yoktur; bütün sayfaların uygulama statüsü beklemede.**

## Aşama 6 — CD-006 seçimi / sayfa kapsamı
C-02 Inked Folio ortak bileşen dili olarak onaylandı, fakat G-02 Modular Broadsheet sadece seçili featured editoryal dosyalarda kullanılabilir. Standart Home akışı, bütün iç sayfalar, formlar ve servis durumları G-01 genel gridini korur. Aşama 7 Homepage Design ile Aşama 8 Inner Pages onayı ve uygulaması **henüz yapılmadı**.


## Aşama 7 Homepage (tasarım alternatifleri)
Sadece `/` ana sayfa için H-01 Issue Front, H-02 Discovery Desk, H-03 Curated Edition karşılaştırıldı. Üçü de `Hero`, `EditorialFeed`, `KnowledgeCard`, `DiscoveryFilterPopover`, filtre state'leri ve read-only fallback davranışlarını bozmadan yeniden dizmeyi hedefliyor. **Onay yok, uygulama yok**. Diğer 16 route tasarım/uygulama statüsü değişmedi. `design/HOMEPAGE-OPTIONS.md` ayrıntıları içerir.


## Aşama 7 kararı — CD-007
**H-01 Issue Front** onaylandı. Sadece `/` rota ana sayfa kompozisyonu tasarım kararıdır; `/posts/:id` ve kalan **16 rota** yeni tasarım onayı/uygulaması bekliyor. Aşama 8 araştırması bu 16 route ve özel durumları kapsayacak. `src/` kodu değiştirilmedi.


## Aşama 8 iç sayfa kapsamı (ONAYSIZ)

`design/INNER-PAGES-OPTIONS.md` dosyasında **kalan 16 iç rota** için ortak görsel prensipler ve korunacak gerçek işlevler envantere alındı. Üç editoryal dil: INNER-01 Reading Folio, INNER-02 Evidence Marginalia, INNER-03 Chaptered Field Guide. Makale/auth/editor/yazar örnekleri karşılaştırıldı; bookmarks, profile, knowledge, admin, about, contact ve 404 için gerçek bileşen akışları ve state sınırları belgelendi, ancak **tasarım onayı veya uygulama yapılmadı**. Önceki H-01 ana sayfa kararı değişmedi.


## CD-008 iç sayfa yönü (2026-10-17)
Aşama 8'de **INNER-02 Evidence Marginalia** ana iç sayfa dili ve **INNER-01 sakin uzun okuma** kullanıcı delegasyonu kapsamında seçildi. INNER-03 yalnız gerçek teknik adım rehberlerinde yardımcı; kalan 16 rota artık bu tasarım *yönü* altında fakat **uygulama durumu hâlâ bekliyor**. `src/` unchanged; gerçek auth/publish/kanıt API testleri yapılmadı.


## CD-010 / Aşama 10 kapsam onayı (2026-10-17)
**17 rota genelinde R-01 Editorial Reflow** ana responsive sistem onaylandı. **R-02 Adaptive Marginalia yalnız makale/evidence**, **R-03 Task-first Workbench yalnız auth/editör/admin/knowledge** ekranlarında kullanılabilir. Bütün rotalarda ve işlevsel state'lerde **WCAG 2.2 AA uygunluğunu sağlamak ve doğrulamak zorunlu release kapısı** olarak seçildi; mevcut site buna şimdiden uygun ilan edilmedi.

## Aşama 11 QA planı (ONAYSIZ)
[FINAL-QA-VISUAL-POLISH-PLAN.md](./FINAL-QA-VISUAL-POLISH-PLAN.md) 17 rota ailesi ve public/6 protected route'lar için görsel, auth/role, UI state, TR/EN, light/dark, responsive, zoom, screen-reader, security/SEO/PWA ve performans acceptance planını içerir. QA-01/02/03 kapsam alternatifi **kullanıcı tarafından henüz seçilmedi**. Test çalıştırma, UI uygulama, push veya deploy izni verilmedi.


## CD-011 onaylı kalite planı — implementation BEKLEMEDE (2026-10-17)
Bütün 17 rota ve ilgili state'lerde **QA-02 Editorial Excellence** görsel polish planı; **QA-03 güvenlik, WCAG 2.2 AA, veri bütünlüğü ve performans** zorunlu kapılar olarak onaylandı. Buradaki onay **yalnız QA PLANIDIR**; rota satırlarındaki **Bekliyor** uygulama durumları değişmedi. Gerçek auth/editor/admin fixture'ları, font yüklenmesi, görsel before/after, manual AT, performans ve tüm testler henüz yürütülmedi. Kod yazmak, test çalıştırmak, GitHub push veya deployment yapmak kullanıcı ayrıca onaylayana kadar yasaktır.
