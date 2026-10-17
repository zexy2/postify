# Postify — Design Decision Ledger

**Aktif protokol:** Kullanıcı talebi, 2026-10-17.
**Aktif aşama:** 6 / Component Design System — **alternatif tasarım sistemleri araştırılıyor; Aşama 6 kullanıcı onayı henüz yok**.
**Sonraki aşama:** 7 / Homepage Design — **Aşama 6 onayı olmadan başlamayacak**.

## Süreç kararları — kullanıcı açık talimatı
| Kayıt | Karar | Durum | Kapsam |
| --- | --- | --- | --- |
| PROCESS-001 | 0–11 sıralı tasarım aşaması ve her aşama sonunda açık kullanıcı onayı | **Kullanıcı tarafından belirlenmiş kural** | Tüm gelecekteki çalışmalar |
| PROCESS-002 | İlk turda yalnızca audit; uygulama koduna dokunma; tasarım alternatiflerini erkenden seçme | **Kullanıcı tarafından belirlenmiş kural** | Aşama 0 |
| PROCESS-003 | `design/` altındaki altı belge kalıcı hafıza; sürüm kontrollü | **Kullanıcı tarafından belirlenmiş kural** | Tüm aşamalar |
| PROCESS-004 | Ayrı Git branch/worktree, test ve görsel QA, mevcut akış/SEO/auth koruma | **Kullanıcı tarafından belirlenmiş kural** | Uygulamaya geçilen aşamalar |

## Mevcut tasarım ile onaylı kararın ayrımı
| Referans | Gözlemlenen mevcut durum | Kullanıcı onayı | Politika |
| --- | --- | --- | --- |
| `ec6e368` | Ana sayfa editoryal kapak, tema ve bazı ortak CSS iyileştirmeleri | **Yeni protokol kapsamında verilmedi** | Korunan mevcut Git çalışma durumu; onaylı brand direction sayılamaz |
| `30a5a12` | Auth, admin tablosu, bookmarks boş durumu, knowledge panel CSS/UX | **Yeni protokol kapsamında verilmedi** | Korunan mevcut Git çalışma durumu; nihai sistem onayı sayılamaz |
| Eski `project/premium-editorial-design-system.md` | Önceki çalışma dönemi tasarım notu | **Yeni protokole göre yeniden değerlendirilmesi gerekli** | `design/DESIGN-SYSTEM.md` içinde onaysız audit baseline; yeni seçim yapılmadı |

## Tasarım onay kayıtları
| Aşama | Status | Önerilen seçenekler | Kullanıcının seçimi | Tarih |
| --- | --- | --- | --- | --- |
| 0 Current Product Audit | **ONAYLANDI** | Teknik, tasarımsal ve 51-render denetimi | Kullanıcının açık yanıtı: **“Onaylıyorum”** | 2026-10-17 |
| 1 Brand Personality & Creative Strategy | **ONAYLANDI** | **A: Living Field Manual, B: Independent Review, C: Knowledge Atlas** | **A+B hibriti** — kullanıcının açık onayı | 2026-10-17 |
| 2 Reference Research & Moodboards | **ONAYLANDI** | MOOD-01, MOOD-02, MOOD-03 | **MOOD-02 ana + MOOD-01 kanıt/UX; MOOD-03 yalnız uygun teknik yazılarda** | 2026-10-17 |
| 3 Color System | **ONAYLANDI** | PL-01 Oxide & Newsprint, PL-02 Evergreen & Brass, PL-03 Ultramarine & Chalk | **PL-01 — delegasyonla seçildi** | 2026-10-17 |
| 4 Typography System | **ONAYLANDI** | TYPE-01 Quiet Authority; TYPE-02 Expressive Issue; TYPE-03 Evidence Library | **TYPE-02 Expressive Issue: Fraunces + Inter + IBM Plex Mono** | 2026-10-17 |
| 5 Grid, Layout & Spacing | **ONAYLANDI** | G-01 Editorial Spine, G-02 Modular Broadsheet, G-03 Reading Sanctuary | **G-01 ana sistem + G-02 yalnızca öne çıkan editoryal yayın dosyalarında** | 2026-10-17 |
| 6 Component Design System | **Alternatifler araştırılıyor; karar bekliyor** | Bileşen aileleri/etkileşim ve durum matrisi | — | 2026-10-17 |
| 7 Homepage Design | Başlanmadı | Henüz yok | — | — |
| 8 Inner Pages & Editorial Experience | Başlanmadı | Henüz yok | — | — |
| 9 Motion & Interaction Design | Başlanmadı | Henüz yok | — | — |
| 10 Responsive & Accessibility | Başlanmadı | Henüz yok | — | — |
| 11 Final QA & Visual Polish | Başlanmadı | Henüz yok | — | — |

## Aşama 0 açık kullanıcı onayı
**2026-10-17:** Kullanıcı önceki Stage 0 raporunun ardından **“Onaylıyorum”** dedi. Bu onay **yalnızca Aşama 0 denetimi** içindir; önceki UI commitleri, marka stratejisi, renk, tipografi veya Aşama 2 için tasarım onayı anlamına gelmez.

## Aşama 1 seçenek kaydı (ÖNERİ ve KARAR geçmişi)
**2026-10-17:** Mevcut ürün mimarisinden türetilmiş üç seçenek hazırlandı; tam analiz ve ASCII kompozisyon eskizleri `CREATIVE-DIRECTION.md` dosyasındadır.
- **A: Living Field Manual** — Problem/sonuç/kanıt/kullanım, editoryal saha kaydı; risk: fazla teknik etiket.
- **B: Independent Review** — Seçici, ifade gücü yüksek bağımsız teknoloji yayını; risk: kapak estetiği kanıt ve keşfi gölgeler.
- **C: Knowledge Atlas** — İçerik bağları/öğrenme yolları; risk: dashboard karmaşıklığı ve gerçek bağlantı veri ihtiyacı.
**İlk sunumda onay:** YOK; bu durum aşağıdaki yeni ve açık kullanıcı kararıyla değişti. İlk üretilen, yanlışlıkla lifestyle bloga kayan imaj konsept kanıtı olarak **reddedildi**.
**Yeni açık kullanıcı onayı — 2026-10-17:** “Postify için A + B hibrit yaratıcı stratejisini onaylıyorum. Aşama 1 kararını kaydet ve yalnızca Aşama 2 referans araştırması ve moodboard çalışmalarına geç.”

**Seçilen strateji (CD-001, ONAYLI):** Yaşayan Uygulama Rehberi (A) bilgi modeli ve işe yararlılık/kanıt/güncellik yaklaşımı + Bağımsız Dijital Dergi (B) özgün editoryal karakter, güçlü anlatı ve rafine kompozisyon. **C Knowledge Atlas bağımsız birincil marka kimliği olarak seçilmedi**; kanıtlanmış bağlantılı içerik keşfi sonraki UX aşamalarında gerekirse ayrıca teklif edilebilir. A+B hibriti bir renk, font, layout, hero şablonu veya UI kodu onayı değildir. Bu kararın başka konseptle değiştirilmesi kullanıcı onayı gerektirir.

**Sıradaki karar:** Aşama 2 referans ve moodboard alternatiflerinin kullanıcı tarafından onaylanması. Ardından ve ancak ardından Aşama 3 renk sistemi başlatılabilir.

## Aşama 2 moodboard araştırması (ONAYSIZ)

**2026-10-17:** A+B stratejisine uygun üç farklı görsel ifade dengesi, gerçek yayınlardan kaynak doğrulanarak `design/MOODBOARD-RESEARCH.md` içinde belgelendi. **MOOD-01 Evidence-led Editorial, MOOD-02 Independent Issue, MOOD-03 Illustrated Field Stories**. Karşılaştırmalı gerekçeler, güçlü/zayıf yönler, Postify sayfa/akış eşleştirmeleri, reddedilecek desenler ve URL'ler kaydedildi.
- **Gerçek araştırma:** Yedi site, Oracle Chromium 1440/390 ekran görüntüleri. Stripe Press ilk viewport'u içeriksiz göründüğü için ikincil kavramsal kaynak; kalan altı site temel referans.
- **Görsel kanıt:** `/home/ubuntu/.oracle-dev/visual/postify-stage2/moodboard-{01,02,03}.jpg`; gerçek kaynakların screenshot'ları telif koşulları nedeniyle kamuya açık repo içine taşınmadı.
- **Öneri, karar değil:** MOOD-02 editoryal vurgu + MOOD-01 kanıt disiplini değerlendirilebilir.
- **Aşama 2 onayı:** **YOK.** Renk, font, grid, motion, component, uygulama kodu onayı verilmedi.
- **Sonraki karar:** Kullanıcı MOOD-01 / MOOD-02 / MOOD-03 veya açık hibriti seçmeli; yalnızca sonra Aşama 3 renk sistemi başlayabilir.

## Stage 0 değişiklik defteri
2026-10-17 — `design/` raporları yazıldı. **Uygulama, component, CSS, route, service, test ve build artifact kodu değişmedi.** Aşama 1'e geçilmedi. Git commit yalnızca doküman dosyalarını içermelidir; push/deploy yok.

## Gelecek onay değişikliği formatı
Her görsel karar için ID, aşama, alternatifler, önizleme referansı, gerekçe, artı/eksi, etkilenen sayfalar, erişilebilirlik/performans etkisi, kullanıcıdan gelen açık onay metni/tarihi, ilgili commit ve gerekirse geri alma notu yazılır. **Cevap verilmemesi onay sayılmaz.**

## CD-002 — Kullanıcının Aşama 2 onayı (2026-10-17)
Kullanıcının açık kararı: “Aşama 2 için MOOD-02 Independent Issue ana görsel referansını, MOOD-01 Evidence-led Editorial'ın kanıt ve kullanılabilirlik prensipleriyle birlikte onaylıyorum. MOOD-03 sadece uygun teknik açıklayıcı makalelerde değerlendirilsin. Kararı kaydet ve yalnızca Aşama 3 renk sistemi alternatiflerine geç.”

**ONAYLANDI:** MOOD-02 ana editoryal kimlik; MOOD-01 kanıt, güven, kullanılabilirlik ve okunabilirlik disiplini; MOOD-03 yalnızca yarar sağlayan teknik açıklayıcı makalelerde destek. Bu seçim CD-001 A+B hibritini korur. MOOD-01 ve MOOD-03 bağımsız ana yön olarak seçilmedi.

**ONAYLANMADI:** Belirli renk/hex, açık/koyu tema, font, grid, bileşen, hareket ve uygulama kodu. Aşama 3'te yalnızca renk seçenekleri ve ölçülü kontrast analizleri sunulacak. Kullanıcı Aşama 3'ü onaylamadan Aşama 4 açılmayacak.

## Aşama 3 renk alternatifleri (ONAYSIZ)
2026-10-17: PL-01 Oxide & Newsprint; PL-02 Evergreen & Brass; PL-03 Ultramarine & Chalk. Light/dark hex, rol eşleştirmeleri, karşılaştırmalı gerekçe ve matematiksel kontrast oranları design/COLOR-SYSTEM-OPTIONS.md dosyasındadır; design/color-palette-reference.svg renk swatch sunumudur. **Kullanıcı renk paleti seçmedi.** Bir sonraki karar PL-01/02/03 veya açık hibrit; Aşama 4 kapalı, app koduna renk taşınmadı.


## CD-003 — Aşama 3 delegasyonla onaylanan renk kararı (2026-10-17)

**Kullanıcının aynen ifadesi:** “Sana bıraktım en modern ve profesyonel duranı seç”.

**Yetkilendirme yorumu:** Kullanıcı, daha önce sunulan PL-01 / PL-02 / PL-03 arasından seçimi asistana devretti. Bu, yalnızca Aşama 3 renk sistemine ilişkin karardır; tipografi, grid, animasyon, uygulama veya deployment yetkisi değildir.

**Seçilen ve ONAYLI palet: PL-01 — Oxide & Newsprint.** Gerekçe: MOOD-02 karakterli bağımsız dergi dili ve MOOD-01 kanıt/kullanılabilirlik disipliniyle en tutarlı, fazla kurumsal/ekolojik PL-02 ve jenerik teknoloji/SaaS hissine yakın PL-03'ten daha ayırt edici.

**Kesinleşen opak brand/theme tokenları:**
- Açık tema: paper `#F4EFE6`; surface `#FDFBF6`; primary ink `#1F2420`; secondary ink `#4F5A53`; primary interactive/link `#A13826`; interactive üstü yazı `#FFFFFF`; yardımcı dekoratif `#C8B89E` (asla body/kanıt metninin rengi değil).
- Koyu tema: background `#151B19`; elevated surface `#222A26`; primary ink `#EFEDE5`; secondary ink `#B7BCAF`; link/button background `#F2AC91`; bu butonda ön plan `#151B19`.
- Metin/CTA eşleşmeleri aday araştırmasında 4.5:1 üzerindedir; bu **tekil opak çiftlerin** kontrastıdır, WCAG site genelinde henüz doğrulanmadı.
- Semantik success, error, warning, info; border, focus, disabled, hover, fotoğraf üzerinde yazı ve mikro-tipografi **bu seçimle otomatik onaylanmadı**; sonraki bileşen/erişilebilirlik kapılarında test edilerek kesinleştirilecek. Renk, anlamın tek işareti olamaz.

**Değiştirme süreci:** Her onaylı temel token değişikliği gerekçe, etkilenen sayfalar, kontrast kanıtı ve kullanıcı onayı ister. **Uygulama koduna henüz dokunulmadı.**

**Sonraki kapı:** Yalnızca Aşama 4 Typography System alternatifleri hazırlanır. Font kesinleşmeden Aşama 5'e geçilemez.


## Aşama 4 — Tipografi karşılaştırması (ONAYSIZ)

**2026-10-17:** Kullanıcının Stage3 palet seçimini asistana bırakmasına dayanılarak yalnızca **PL-01 renk sistemi** seçilmiş ve CD-003 ile onaylanmıştır. Bu delegasyon tipografi seçimini **kapsamaz**.

- TYPE-01 **Quiet Authority** = Newsreader display + DM Sans body/UI + IBM Plex Mono kaynak/kod.
- TYPE-02 **Expressive Issue** = Fraunces display + Inter body/UI + IBM Plex Mono.
- TYPE-03 **Evidence Library** = Literata display + IBM Plex Sans body/UI + IBM Plex Mono.
- Altı gerçek Oracle Chromium specimen (1100/390), TR/EN/technical copy ve kaynak/mono karşılaştırması repo dışındaki `/home/ubuntu/.oracle-dev/visual/postify-stage4` yolunda kayıtlı. FontFaceSet loaded; örneklerde yatay taşma ve pageerror yok. Bunlar üretim performans testi değildir.
- Lisans (SIL OFL) ve kaynaklar, font tradeoff ve font loading riskleri `design/TYPOGRAPHY-OPTIONS.md` dosyasında.
- **Tasarım yönetmeni önerisi: TYPE-01**; kullanıcı onayı verilmedi. TYPE-02/TYPE-03 alternatifleri açık.
- **Sonraki karar:** TYPE-01/02/03 veya açık hibrit. Seçimden önce Aşama 5 Grid/Spacing başlamaz. JSX, CSS, build, font dosyası, GitHub push ve deployment yapılmadı.


## CD-004 — Aşama 4 tipografi onayı (2026-10-17)

**Kullanıcının açık ve aynen talebi:** “Postify Aşama 4 için TYPE-02 tipografi sistemini onaylıyorum. Oracle ve design belgelerine kaydet; yalnızca Aşama 5 Grid, Layout & Spacing alternatiflerine geç. Henüz uygulama kodunu değiştirme.”

**ONAYLANAN EŞLEŞME: TYPE-02 Expressive Issue**
- Büyük editoryal başlıklar ve uygun uzun yazı ara başlıklarında **Fraunces**. Bağımsız bir yayının dikkat çekici karakterini taşıyacak; aşırı yumuşak/oyuncu SOFT/WONK eksenleri metnin güvenilirliğini zedelemeyecek.
- Gövde metinleri, navigasyon, butonlar, formlar ve kullanıcı arayüzü için **Inter**. Uygulanabilir bilgi okuma önceliğini korur.
- Kod blokları, teknik komutlar, kaynak/kanıt/tarih metaverisi için **IBM Plex Mono**. Meta metinleri okunamayacak kadar küçültülmez.
- TYPE-01 Quiet Authority ve TYPE-03 Evidence Library **ana sistem olarak seçilmedi**. İkisi tarihsel karşılaştırma olarak saklanır.
- Silinen/değiştirilen önceki onaylı renkler yoktur: **PL-01 Oxide & Newsprint** ve önceki CD-001/CD-002 sanat yönetimi geçerlidir.
- Aile düzeyindeki font isimleri ve kullanım rolleri onaylıdır; kesin font-size/scale, optical axis preset, tracking, line-height, heading ölçüleri, self-hosting/subset, responsive spacing, layout/grid ve uygulama bileşeni değerleri **henüz kararlaştırılmadı**; uygulanmadan önce ayrı test ve aşama onayları gerekir.
- **Uygulama kodu değiştirilmedi**, font dosyası eklenmedi; push veya deployment yapılmadı.

**Sonraki kapı:** Yalnızca Aşama 5 **Grid, Layout & Spacing** alternatiflerini hazırla ve kullanıcının kararını bekle. Aşama 6, Aşama 5 onayı olmadan başlamaz.


## Aşama 5 Grid/Layout/Spacing teklifleri (ONAYSIZ)

2026-10-17: **G-01 Editorial Spine** (12col dengeli 7:5, 1280px dış container, 24px gap, ~715px makale); **G-02 Modular Broadsheet** (12col değişken 8:4, 1440px dış container, 20px gap, ~740px makale); **G-03 Reading Sanctuary** (8col merkez, 1160px dış container, 32px gap, ~710px makale) alternatifleri hazırlandı.

- Detaylı dış/makale/mobile/desktop/grid/breakpoint/spacing taslakları ve tradeoff matrisi `design/GRID-LAYOUT-SPACING-OPTIONS.md`; repo içinde geometrik konsept eskizleri `design/grid-layout-reference.svg` dosyasındadır.
- 3 varyant × Home/Article × 1440/768/390/320 = **24** statik Chromium layout kontrolü (önizleme, uygulama değil); yatay taşma gözlenmedi. Makale okuma ölçüleri desktopta 715/740/710px olarak ölçüldü. Bağımsız prototip çıktıları konuşma dosyalarında.
- Örnek CSS HTML sadece repo dışında. Onaylı PL-01 ve TYPE-02 aile isimlerine uyma hedefiyle hazırlanmıştır; Fraunces'ın son font dosyası/font metrikleri bu prototiplerde garanti edilmez.
- **Öneri:** G-01'in kontrollü tasarım omurgası, ancak özgün kapaklara gerektiğinde G-02'nin sınırlı editorial sapması düşünülebilir. **Bu öneri onay değildir.**
- **Onay durumu: BEKLENİYOR.** Grid/spacing henüz kesinleşmedi, uygulama JSX/CSS, diğer repo, push/deploy değiştirilmedi. Aşama 6, kullanıcı Aşama 5'e açık onay verene kadar kapalı.


## CD-005 — Aşama 5 G-01 + seçici G-02 onayı (2026-10-17)

**Kullanıcının tam onay metni:** “Postify Aşama 5 için G-01 Editorial Spine ana grid sistemini ve G-02 Modular Broadsheet kompozisyonlarının yalnızca öne çıkan editoryal yayın dosyalarında seçici kullanımını onaylıyorum. Kararı design belgelerine ve Oracle'a kaydet. Yalnızca Aşama 6 Component Design System alternatiflerine geç; uygulama kodunu henüz değiştirme.”

**ONAYLI:** Site çapında **G-01 Editorial Spine** ana düzen ilkesi: 12 kolonlu düzen omurgası; önerideki masaüstü max container **1280px**, gutter **56px**, içerik gap **24px**, 7:5 öne çıkan içerik asimetrisi, 3 kolonlu feed, yaklaşık **715px** makale ana okuma ölçüsü; iki yan alan TOC ~170px, evidence ~210px yalnızca kullanışlı olduğu durumlarda. Mobil ilk örnekler: 390px için yaklaşık 26px, 320px için yaklaşık 20px dış gutter; küçük ekranlarda tek akış, içerik ve kanıt kaybolmaz. Spacing gramerinin 8px temel ritimle 4/8/12/16/24/32/48/64/96 aday adımları, onaylı sistemin uygulanırken gözden geçirilecek ölçü hedefidir.

**SINIRLI İSTİSNA:** **G-02 Modular Broadsheet** ancak seçilmiş editoryal dosyalar / özel featured kapaklarda, gerekçe ile kullanılabilir. Bu izin, G-02'nin 1440px site genelinde max genişliği, düzensiz kartları veya bütün iç ekranlarda modüler dağılımını **onaylamaz**. Büyük editoryal kapak, arama ve kaynak bilgisinin görünürlüğünü geri plana atamaz.

**SEÇİLMEYEN:** G-03 Reading Sanctuary site çapında ana sistem değil. Seçilmeyen alternatiflerin dokümantasyonu geçmiş araştırma olarak saklanacak.

**UYGULAMA DURUMU:** Dokümantasyon onayı. Gerçek CSS breakpoint uyarlamaları, içerik yüksekliğine ve erişilebilirliğe göre doğrulanmalı; bu karar herhangi bir production kod değişikliği, font dosyası yükleme veya release onayı değildir. PL-01 renkleri, TYPE-02 font rolleri ve CD-002 moodboard kararı korunur.

**SONRAKİ ADIM:** Sadece Aşama 6 bileşen tasarım alternatifleri. Aşama 6 onayı olmadan Aşama 7'ye geçilmez.
