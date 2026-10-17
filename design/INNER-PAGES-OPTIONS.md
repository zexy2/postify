# Postify — Aşama 8 / Inner Pages & Editorial Experience

**Tarih:** 2026-10-17
**Durum:** **INNER-01 / INNER-02 / INNER-03 tasarım alternatifleri sunuldu — Aşama 8 KULLANICI ONAYI BEKLENİYOR.**
**Üretim durumu:** Yalnızca araştırma, tasarım belgesi ve bağımsız statik prototip. Postify uygulama kodu, CSS, fonksiyonlar, API, route, font asset, SEO veya deploy **değişmedi**. Aşama 9 Motion & Interaction Design **başlamadı**.

## 0. Kesin korunacak önceki onaylar

- CD-001: Uygulanabilir, kaynaklı teknik bilgi + bağımsız dijital dergi (A+B).
- CD-002: MOOD-02 Independent Issue ana; MOOD-01 kanıt ve kullanışlılık; MOOD-03 yalnızca teknik açıklamaya gerçekten katkı sağlayan görsellerde.
- CD-003: **PL-01 Oxide & Newsprint** onaylı renk ailesi.
- CD-004: **TYPE-02 Fraunces** editoryal başlık / **Inter** metin+UI / **IBM Plex Mono** kod+meta.
- CD-005: **G-01 Editorial Spine** genel 12 kolon/1280px dış grid, ~715px merkez makale ölçüsü; G-02 **yalnızca seçili featured yayın dosyalarında**.
- CD-006: **C-02 Inked Folio** bileşen grameri; her kart veya teknik tablo G-02 geniş kapak kompozisyonuna dönüşmez.
- CD-007: **H-01 Issue Front** ana sayfa onaylı; yeni iç sayfa tasarımı ana sayfayı sessizce değiştiremez.

## 1. Kaynak koddan tespit edilen gerçek iç sayfalar ve etkileşimler

Güncel route envanteri: `design/PAGE-INVENTORY.md`. İç rotalar toplam **16** (1 Home hariç; 10 public + 6 protected).

| Route / ekran ailesi | Mevcut görev ve state | Aşama 8 tasarım koruma kuralı |
| --- | --- | --- |
| `/posts/:id` Article | `PostDetailPage`, progress, TOC, `KnowledgeEvidencePanel`, `EvidenceBadge`, code-copy, source, bookmark/share, comment, related adjacent, server fallback, loading/error | Başlık/giriş/body en yüksek öncelik; gerçek verified/author-claim/stale/unknown ayrımı korunur; kanıt ve navigasyon ekran okuyucudan saklanmaz |
| `/users/:id` Public author | `UserPage`, yazar profili, yayın listesi, unavailable/not-found | Yazar sesi ve gerçek yayın geçmişi; eksik profil alanlarına hayali istatistik eklenmez |
| `/auth/login` & `/auth/register` | email/password, OAuth, validation, submit/pending, account redirect | Mobilde form önce; gerçek parola kontrolleri, form hatası/focus, üçüncü parti giriş korunur |
| `/auth/forgot-password` & `/auth/reset-password` | e-posta, yeni şifre / doğrulama, validasyon, success/error | Kurtarma görevi ilk ekranda, dekoratif editoryal hikâye formu geriye itemez |
| `/auth/callback` | OAuth bekleme, geçiş, timeout/error | Kişinin kimlik durumu görsel süs için gizlenemez |
| `/posts/create` & `/posts/:id/edit` | Draft, rich text/Markdown-Tiptap, kaynak, image, publish-readiness, submit, autosave/error | Yazı çalışma alanı, taslak kaybı ve gerçek izin; hızlı yazma/önizleme ve duruma göre yayım hazırlığı |
| `/bookmarks` | saved/empty, remove/clear, redirect | Kişisel yayın rafı; empty’de kısa açıklama ve geri dönüş aksiyonu |
| `/profile` | authenticated account, avatar, stats, edit, loading/error | Açık ve özel profil ilişkisini karıştırma; gerçek olmayan veriler yok |
| `/knowledge` | backend inactive, author knowledge, evidence status, gap and correction queues | Erişilemeyen servisi “hazır” gibi gösterme; gerçek status, kaynak düzeyi ve kayıt akışı |
| `/admin` | role-based auth, kullanıcı/gönderi tablo, moderation, status, loading | C-02 stil ama işlevsel tablo; yetki/silme onayı, klavye ile yatay tablo kaydırma, gerçek rol doğrulaması |
| `/about` | yayın kimliği/amaç/CTA | H-01 yayın karakterini iç sayfada açık ve kısa manifesto olarak sürdür |
| `/contact` | iletişim, correction ve dış linkler | İletişim eylemi görünür, ikincil içerik/öykü görevi bastırmaz |
| `*` Not Found | 404, geri dönüş, site arşivine bağlantı | Recovery-first; süslü grafik sahte sonuç değil, güvenli ve anlaşılır yönlendirme |

**Güvenlik/ürün davranışı sınırı:** Gerçek kullanıcıya ait hiçbir özel bilgi, kimlik doğrulama state'i veya post içeriği araştırma prototiplerine bağlanmadı. Ekran görüntülerindeki içerikler yalnızca *etiketlenmiş örnektir*; gerçek kanıt, yazar veya yayın iddiası değildir.

## 2. Aşama 8 alternatifleri — HİÇBİRİ ONAYLI DEĞİL

### INNER-01 — Reading Folio / Okuma Dosyası

**Ana tema:** Dergi okuması, büyük ama kontrollü editorial Fraunces başlığı, nefes alan tipografi ve uzun metin. Gerçek kaynak/kanıt alanı makalenin sonunda okunaklı bir bölüm; TOC ve eylemler yakın ve ikincil.

**Makale:** G-01 ~715px merkez, sakin okuyucu kolonu; yanal küçük navigation; kanıt bilgisi hem özet rozetinde mevcut olmalı hem sonunda tam panel. Yalnızca sonda göstermek **uygulamada yeterli değil**.
**Yazar & About:** Portfolyo gibi bağlamsal yayın kimliği, bağımsız metin/öykü; About uzun manifestoya dönüşmez.
**Auth:** Dergi kapağı yan hikâyesi ama desktopta iki sütun; mobilde form ilk sırada.
**Editör:** Büyük açık metin tuvali; küçük ayrık publishing rail.
**Bookmark/Knowledge/Admin:** Dolgusuz açık bölümler, gerekli tablolar işlevsel kalır.

**Artı:** Çok güçlü uzun okuma; H-01/C-02 sanat yönetimini derinleştirir; düşük gürültü.
**Eksi:** Kanıt ve güncellik ayrıntısı aşağı kayabilir; gerçek sık teknik veri/yan panel durumu için ek kurallar gerekir.

### INNER-02 — Evidence Marginalia / Kaynak Kenar Notları

**Ana tema:** Bir bağımsız dergi makalesini okurken alıntı, kaynak ve test koşulları doğal *marginalia* gibi görünür. Okuma sütunu korunur, destek bilgi blokları metnin yanında yer alır; mobilde anlamlı sırayla akışa girer.

**Makale:** G-01 ~715px ana okuma alanı, uygun viewportta küçük TOC/evidence rayı; metnin üst bölümünde kaynak/güncellik özet şeridi. Tam evidence panel ve düzeltme yolları ayrı ilgili bölümlerde; doğrulama iddiası yoksa unknown açıkça yazar. Mobilde önce başlık ve **kısa kanıt özeti**, sonra metin; kaynak linkleri kaybolmadan dikeyleşir.
**Yazar & About:** Gerçek yayımlanmış konu ve kanıt geçmişini abartmadan yazar kimliği; kamuya açık/özel bilgi ayrımı.
**Auth:** Task-first form; Inked Folio hikâye yan paneli desktopta, mobilde formun altında.
**Editör:** Metin tuvali + yayın hazırlığı/evidence yan paneli; autosave durumu, kaynak eksikleri, publish validation açık ve ayrı.
**Bookmark/Knowledge/Admin:** Salt dekoratif dashboard değil; yoğun olgusal panellerde açık section ayırıcı ve durum mesajı, tablolar korunur.

**Artı:** MOOD-02 editorial karakter + MOOD-01 kanıt/readability birlikte en kuvvetli. Kullanıcı hızlıca “neye dayanıyor?” sorusuna yanıt bulabilir.
**Eksi:** Çok fazla rail/panel mikro-metni okunurluğu zayıflatabilir; küçük ekranlarda kaynak kutusu yazı başlangıcını aşağı itebilir. Sınırlı, içerikçe yararlı ve doğru state gereken alanlarda kullanılmalı.

### INNER-03 — Chaptered Field Guide / Bölümlenmiş Saha Rehberi

**Ana tema:** Adım, karar, deney ve sonuçları sıralayan teknik kitap/bölüm yapısı; tipografi ve renk aynı, daha belirgin bölüm numaraları ve prosedürel içerik.

**Makale:** Bölüm numarası, kapsam, koşullar, kod/test, sınırlamalar, kanıt dökümü; kaynak bilgisi makale akışı içindeki net kutuda. G-01 genel grid değişmez.
**Yazar & About:** Yazarın rehber serileri/konu ustalığı, gerçek içerik yoksa sahte rota/seri çizilmez.
**Auth:** Düz görev akışı; yayın karakteri yardımcı alanlarda sınırlı.
**Editör:** Publish readiness ve kaynak alanları daha teknik, yapılandırılmış kutular; gerçek rich text düzenlemeyi engellememeli.
**Bookmarks/Knowledge/Admin:** Erişilebilir bölüm bazlı indeks, rol ve veri odaklı bölümler; mümkünse gereksiz kutu/panel sayısı düşük tutulmalı.

**Artı:** Rehber ve runbook içeriğinde çok güçlü uygulama yardımı, kod/kanıt ayrımı belirgin.
**Eksi:** Bir dergiden ziyade API dokümantasyonu hissine kayabilir; her yazıyı zorla “adımlar” formatına sokmak gerçek editoryal çeşitliliği azaltır.

## 3. Kısa karşılaştırma (nitel hipotez)

| Değerlendirme | INNER-01 | INNER-02 | INNER-03 |
| --- | --- | --- | --- |
| Bağımsız premium dergi okuması | **Çok güçlü** | **Çok güçlü** | Güçlü |
| Kanıt ve güncellik bilgisinin erken erişilebilirliği | Orta (kuralla güçlendirilir) | **En güçlü** | Güçlü |
| Uzun metne odak | **En güçlü** | Çok güçlü | Güçlü |
| Teknik rehber/runbook açıklığı | İyi | Çok iyi | **En güçlü** |
| Auth/editor/admin'a görsel bütünlükle taşınma | Güçlü | **En dengeli** | Güçlü ama panelleşme riski |
| Mobil ilk anlamlı metne ulaşım | **Kuvvetli** | Kaynak şeridi sınırlanırsa güçlü | Bölüm başlıklarına bağlı |
| Temel risk | Kanıtı aşağı itmek | Panel/rail kalabalığı | Jenerik teknik dokümantasyon |

**Sanat yönetimi önerisi (ONAY DEĞİL):** **INNER-02 Evidence Marginalia**, fakat kanıt özeti kısa ve gerçekten veriye bağlı olmalı; uzun makale gövdesi INNER-01 kadar sakin kalmalı. INNER-03'teki bölüm numaralandırması yalnızca gerçekten adım adım teknik anlatım gerektiren makalelerde opsiyonel olabilir. Bu bir öneridir; kullanıcının açıkça onaylayacağı kombinasyon henüz yok.

## 4. Statik karşılaştırmalı tasarım kanıtı

**Uygulama değil:** Aşağıdaki prototipler Postify `src/` içine değil, bu sohbetin `/mnt/data` alanına bağımsız HTML/CSS olarak üretildi.

- **3 seçenek × 4 örnek ekran ailesi (Article, Auth, Editor, Author) × 4 viewport (1440/768/390/320) = 48** gerçek yerel Chromium render.
- **48/48** örnekte yatay taşma **0** ve yakalanan `pageerror` **0**.
- G-01 içerik üst sınırı, PL-01 onaylı renkler ve C-02 Inked Folio karakteri; TYPE-02 aile isimleri CSS üzerinde, ancak örnekler offline oldukları için fallback font kullanabilir. Bunlar **Fraunces final font piksel doğrulaması değil**.
- Giriş örneklerinde input label kullanıldı; mock buton/linklerin çalışır login, editor autosave, publish veya backend eylemi gibi davranması beklenmez. Gerçek OAuth/editor/admin/kanıt işleyişi test edilmedi.
- Tekil dosyalar: `/mnt/data/postify-stage8-I-0{1,2,3}-{article,auth,editor,author}-{1440,768,390,320}.png`, mock HTML örnekleri.
- Karşılaştırma: `/mnt/data/postify-stage8-{article,auth,editor,author}-{desktop,mobile}-comparison.jpg`.
- `/mnt/data/postify-stage8-measurements.json` kaynak gözlemler.
- Repository içinde **telifsiz ve onaysız** soyut gramer: `design/inner-pages-composition-reference.svg`.

**Örnek içerik statüsü:** “Bir teknik iddia nasıl doğrulanır?”, “Yazar profili”, kaynak durumu ve yazı taslağı **sadece tasarım örneği**. Postify içeriği, gerçek yazar/kanıt/verified ya da hesaba bağlı veri iddiası değildir.

## 5. İç sayfalarda state QA kapıları — henüz çalıştırılmadı

- Makale: loading, unknown author-claimed, independently verified ancak backend doğrularsa, stale/recheck, kod taşması, link/TOC/progress, bookmark/login gating, comments fallback, correction, error/not-found.
- Yazar/account: public author not found, unpublished/privacy, profile upload state, account edit, backend unavailable.
- Auth: invalid email, password toggle, OAuth callback timeout, error/success, reset token, mobile keyboard.
- Editör: rich text/Markdown, undo, draft persistence, autosave debounce, publish readiness, source evidence, preview, image upload, error and protected redirect.
- Bookmarks/knowledge/admin: empty/loading/offline, data table overflow keyboard scroll, permission denied, role changes, moderation confirmation.
- About/contact/404: localization, external link, keyboard, recover action, responsible copy.
- Global: true TR/EN copy and text growth, WCAG 2.2 AA, 200/400% zoom, high contrast and reduced motion, dark theme semantic tokens, 320–1920 real responsive, perf budgets and SEO.
- All source services and routes preserved; no code behavior test inferred from static screenshots.

## 6. Onay kapısı

**Aşama 8 onayı henüz YOK.** Kullanıcı **INNER-01 / INNER-02 / INNER-03** veya açıkça tarif edilmiş hibriti seçerse seçilen kurallar `DESIGN-DECISIONS.md` ve `DESIGN-SYSTEM.md` içinde onaylı kaydedilebilir. **Aşama 9 Motion & Interaction Design kullanıcı onayından önce başlamayacak.** Aşama 8 onayı bile uygulama kodu, push/deploy yetkisi anlamına gelmez.
