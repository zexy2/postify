# POSTIFY — Current Product Audit (Aşama 0)

**Tarih:** 2026-10-17
**Durum:** Analiz tamamlandı; **kullanıcı onayı bekleniyor**. Aşama 1 başlatılmadı.
**Depo:** `zexy2/postify` — `chatgpt/ws-48c6861345cf` / HEAD `30a5a12`; orijinal `main` ayrı.
**Denetim yüzeyleri:** `http://127.0.0.1:4176/` (çalışma branch'i), `https://postify.zekiakgul.dev/` (canlı, salt okunur), kod, mevcut test/dokümantasyon.
**Kod değişikliği:** YOK. Bu aşamada yalnızca `design/` raporları oluşturulur.

## 1. Ürün gerçekte nedir?
Teknoloji odaklı uygulanabilir bilgi yayını. İçerik biçimleri: **guide, decision note, explainer, field note**. İddia/kanıt seviyesi, güncellik, okunma süresi, doğrulama adımları, topluluk geri bildirimleri ve taşınabilir runbook, salt bir blogdan ayırıcı. İçerik keşfi ve yazı okuma asıl deneyim; yetkili kullanıcıların editör, hesap, kaydedilenler, moderasyon ve bilgi sağlığı iş akışları ikinci katman.

## 2. Mimari ve işletim sınırları
- React 19, Vite 7, React Router 7, Redux Toolkit + redux-persist, TanStack Query, CSS Modules, i18next, Tiptap 3, Supabase JS, React Helmet Async; Playwright, Vitest, ESLint ve PWA/Workbox.
- `src/App.jsx` rota kaynağıdır: **17 rota tanımı** (16 tanımlı erişim yolu ve wildcard 404); 6 korumalı rota. Dinamik yazı/yazar yolları içerik ID veya slug'a bağlı.
- `src/services/` auth, post, user, storage, admin, knowledge ve comment erişimini yönetir. Supabase üretim verisinin kanonik kaynağıdır; yerel dahili yazı kataloğu bağlantı kapalıyken **salt okunur fallback** sağlar. Kanıt yazma/yayınlama işlemlerinin bir kısmı production schema migration / backend capability durumuna bağlıdır.
- `src/lib/` bilgi güvenilirliği, doğrulama, sıralama, metrik, markdown, i18n, SEO sanitization vb. alan mantığını taşır.
- `src/index.css` ve **36 CSS Module** (toplam 38 CSS dosyası, yaklaşık 9.502 satır) kapsamlı mevcut görsel yüzeyi taşır. Tek başına stilleri tamamen değiştirmek yüksek regresyon riski doğurur.
- `vite.config.js` çıktıyı `docs/` içine alır; GitHub Pages SPA `public/404.html` yönlendirme kurgusu, `CNAME`, PWA manifest/caching ve knowledge artifact yolları korunmalıdır.
- `src/components/SEO/SEO.jsx`: canonical, Open Graph, Twitter, JSON-LD, makale tarihleri, kaynaklar ve JSON alternatifleri. Dönüşüm sırasında metadata ve heading semantiği kaybolmamalı.
- İki dil `tr/en`, light/dark, keyboard palette (`Ctrl/⌘K`), reduced-motion, responsive navigasyon ve yerel kaydetme davranışları mevcut.
- Başlangıçta güvenli Git çalışma alanı temizdi. Önceki `ec6e368` ve `30a5a12` premium UI commit'leri **mevcut aday tasarım**, fakat yeni onay protokolünde otomatik onaylı karar değildir. Mevcut uygulama koduna dokunulmadı.

## 3. Gerçek tarayıcı kontrol kapsamı
- Yerel Chromium CDP/Playwright: **17 rota × 3 viewport = 51 kontrol**; `1440 × 900`, `768 × 900`, `390 × 900`. Her kontrolde bir H1, sıfır gözlemlenen yatay taşma ve sıfır yakalanan JS pageerror. Örneklemde DOM üzerindeki img için eksik `alt`, metin inputu için eksik ilişkilendirilmiş label görülmedi. **Bu sonuç WCAG uygunluk belgesi değildir.**
- 11 public route durumu ve korumalı rotalardan login'e yönlendirme test edildi. Oturumlu Create/Edit/Bookmarks/Profile/Knowledge/Admin ekranları bu turda gerçek kimlik doğrulamasıyla **test edilmedi**. Önceki turdaki izole sahte verili ekran görüntüleri yalnızca düzen önizlemesidir; gerçek yetkilendirme/işlem kanıtı sayılamaz.
- Canlı site ana sayfası 1440/390, makale 390 açıldı; mevcut editoryal kompozisyonu gösteriyor. Bağlantı/fallback durumu mesajı görünür: içerik okunabilir, canlı giriş/yorum/yayın fonksiyonları duruma bağlı olabilir.
- Görsel kanıtlar: Oracle sunucusu `/home/ubuntu/.oracle-dev/visual/postify-stage0/`; `audit-matrix.json`, `1440-*.png`, `390-*.png`, `live-*.png`, `mobile-contact-sheet.jpg`, `desktop-contact-sheet.jpg`, `performance-audit.json`. Üretimden kişisel veri yakalanmadı.

## 4. Güçlü taraflar — korunacak değer
- Başlık/format/güncellik/kanıt/okuma süresi arasındaki bilgi ilişkisi gerçek ürün değeridir.
- Tanınabilir serif editorial voice, premium koyu kapak + açık okuma yüzeyi; kart görüntüleri gerçek konuya bağlanıyor.
- Makale detayında ‘okumadan önce’, kaynaklar, yazar, outline, yorum ve kanıt katmanları bulunması.
- Kategori, içerik biçimi, güncellik, kanıt, kısa okuma, sıralama ve komut paleti ile derin keşif.
- Gerçek form label/validation, klavye focus ve skip link temelinin mevcut olması; 390/768/1440'ta taşma bulunmaması.
- Read-only fallback içerik kataloğunun veritabanı kesintisinde içerik kaybı yaratmaması.

## 5. Saptanan sorunlar ve öncelik (tasarım teşhisi, henüz çözüm onayı değil)
| Kod | Şiddet | Kanıt / teşhis | Etki ve takip |
| --- | --- | --- | --- |
| A0-01 | **P1** | Live English UI'da öne çıkan yazının English başlığı yanında Türkçe kısa outcome metni var; makale özetinde de dil karışımı görüldü | Yayın tutarlılığı ve bilgi güveni; içerik çeviri alanlarıyla birlikte audit |
| A0-02 | **P1** | Ana sayfada hero, feature, servis fallback durumu, kategori şeridi, formatlar ve gelişmiş filtreler art arda geliyor; mobilde önemli yazılar aşağıya itiliyor | Öncelik sırası / keşif bilişsel yükü için gezinme görevleriyle değerlendirme |
| A0-03 | **P1** | Meta/indeks yazıları gerçek tarayıcıda bazı noktalarda ~8–12 CSS px; özellikle bilgi güveni ve tarih verileri çok küçük | Okunabilirlik ve 200% text reflow; gerçek kontrast ve ölçü testleri şart |
| A0-04 | **P1** | Supabase capability/fallback durumunda canlı giriş, yorum ve içerik güncellemesi sınırlı; önemli uyarılar ürün mesajlarıyla çakışabiliyor | Offline/fallback/empty/error durumlarının bilgi mimarisi |
| A0-05 | **P2** | Aynı global CSS içinde yeni sıcak renkler ve kullanılabilir durumda kalan indigo/electric-violet/glow/gradient token'ları, eski “Linear Indigo” yorumları var | Token borcu: kullanılan/deprecated ayrımı için renk envanteri |
| A0-06 | **P2** | `--font-sans` Inter, `--font-display` Iowan/Baskerville/Palatino/Georgia, `--font-mono` JetBrains/Fira fallback; depoda font asset yok | Platformlar arası kompozisyon değişebilir; font ve lisans/perf değerlendirmesi |
| A0-07 | **P2** | Global spacing yalnızca 7 basamak, sayfa bazında çok sayıda clamp/px/radius/typographic override | Ortak grid/spacing/type ölçü sistemine ihtiyaç |
| A0-08 | **P2** | Makalede sticky mobil araç çubuğu ve fallback/bildirimler aynı görünür alanda birbirine yaklaşıyor | Görünürlük, focus, bottom inset, toast/z-index kesişimleri tekrar incelenmeli |
| A0-09 | **P2** | Protected editör/profil/admin/knowledge durumları gerçek hesap/veri olmadan kesin görsel & fonksiyonel QA'ya kapalı | Güvenli test hesabı / staging ve state fixture matrisi gerekli |
| A0-10 | **P3** | 404, About, Contact ve auth ekranlarında güçlü başlıklar mevcut; tipografi hiyerarşisi kullanıcı görevinden zaman zaman daha baskın | Sayfa amacı/görsel atmosfer dengesinin test edilmesi |

Şiddetler kullanıcı güveni ve yapılacak işin etkisine göre **öneri**, henüz kesin tasarım çözümü değil.

## 6. Performans gözlemi (ölçüm koşullarıyla)
Canlı Chromium tek örnek navigasyon, 390px, ağ/cihaz sınırlaması özel ayarlanmadan:
- Home: responseEnd ~249ms, DOMContentLoaded ~694ms, First Contentful Paint ~1100ms, Largest Contentful Paint ~1100ms.
- Article: responseEnd ~26ms, DOMContentLoaded ~211ms, FCP ~428ms, LCP ~728ms.
Bunlar **tek koşum ön gözlemidir**, Core Web Vitals alan verisi veya düzenli Lighthouse sonucu değildir; browser cache, ağ ve makine şartları değişir. Ölçüm izleri `performance-audit.json`. Önceden `npm run verify` ve güncel V3 Playwright 55/55 geçtiği kayıtlıdır; **bu Aşama 0'da uygulama kodu değişmedi veya build çalıştırılmadı**.

## 7. Korunması gereken kritik davranışlar
1. Route/slug, query param, filtre ve anchor link, history geri dönüşü/scroll restore.
2. Post okuma, arama, category/type filtreleri, zero results + local knowledge gap, komut paleti.
3. Kanıt statüsü ile bağımsız doğrulama ayrımı; freshness, worked/failed feedback, runbook ve copy actions.
4. Bookmark, local draft/autosave, Markdown/Tiptap, publication readiness, login/OAuth/recovery.
5. Supabase auth/RLS/API/Storage, fallback/production capability gating, admin role moderation.
6. TR/EN, light/dark, keyboard focus/skip link, mobile sheet, reduced-motion ve toast.
7. Canonical/OpenGraph/structured data, PWA, GitHub Pages/404 ve `/knowledge/*` artifacts.

## 8. Önerilen yeniden tasarım yaklaşımı — **yöntem, konsept kararı değil**
Önce marka kişiliğini ve editoryal kullanıcı hedefini birlikte tanımla; görsel alternatifleri referans araştırmasında **karşılaştırmalı sun**. Sonra seçilen yön için renk, tipografi, grid, bileşen, homepage, iç sayfalar ve motion sistemini **kullanıcı onay kapılarıyla** kademeli tasarla. Her aşamada UX görevleri, state matrisi, responsive ve erişilebilirlik gözlemleri olmalı. Onay gelmeden yeni font, palet, konsept veya UI koduna geçilmez.

## 9. Sıradaki aşama — 1: Brand Personality & Creative Strategy (BAŞLANMADI)
Kullanıcı Aşama 0'ı onayladıktan sonra: ürün vaadi, hedef okur/editör personları, “ne değildir” anti-pattern'leri, yayın tonu, 2–3 yaratıcı strateji alternatifi (gerekçe, avantaj/dezavantaj, özgünlük, siteye uygunluk) ve karar matrisi hazırlanacak. Herhangi bir renk veya font henüz seçilmeyecek. **Aşama 1 başlamadan onay bekle.**

## 10. Kaynaklar
`src/App.jsx`, `src/index.css`, `src/pages/*`, `src/components/*`, `src/services/*`, `src/lib/*`, `vite.config.js`, `package.json`, `playwright.config.js`, `project/premium-*.md` ve Stage0 Chromium kanıtları. Ayrıntılı rota listesi için `PAGE-INVENTORY.md`, kalite kapıları için `QUALITY-CHECKLIST.md`.
