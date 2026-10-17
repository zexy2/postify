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
