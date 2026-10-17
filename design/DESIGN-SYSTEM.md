# Postify — Design System Approval Registry

**Durum: KISMEN ONAYLI — PL-01, TYPE-02, G-01 (+sınırlı G-02), C-02 Inked Folio, H-01 Homepage, INNER-02 ana + INNER-01 sakin okuma (sınırlı INNER-03 teknik rehber) ONAYLI; motion/diğer ayrıntılar ONAYSIZ.**
Aşağıdaki 0. bölüm mevcut uygulamayı gösteren onaysız baseline envanteridir. 1. bölüm ise Aşama 3 için **onaylı yeni marka renklerini** içerir; henüz uygulama CSS dosyalarına yazılmadı.

## 0. Mevcut görünüm (baseline; seçilmedi)
| Alan | Çalışma branch'inde görülen | Kaynak | Onay |
| --- | --- | --- | --- |
| Light background | `--bg-primary: #f7f5f0`, secondary `#efebe3` | `src/index.css` | **Yok** |
| Dark background | `--bg-primary: #11100f` | `src/index.css` | **Yok** |
| Light text | `--text-primary: #1d1b18` | `src/index.css` | **Yok** |
| Light accent | `--primary: #a64628` | `src/index.css` | **Yok** |
| Dark accent | `--primary: #f08a67` | `src/index.css` | **Yok** |
| Hero art direction | koyu kapak, `--hero-bg: #202721`, sıcak cream/coral/paper | `Hero.module.css` | **Yok** |
| Body type | Inter + system fallback; kurumsal font dosyası yok | `src/index.css` | **Yok** |
| Display type | Iowan Old Style, Baskerville, Palatino, Georgia fallback | `src/index.css` | **Yok** |
| Mono | JetBrains Mono, Fira Code, monospace fallback | `src/index.css` | **Yok** |
| Spacing tokens | `--space-xs`→`--space-3xl` = 4/8/16/24/32/48/64px | `src/index.css` | **Yok** |
| Radius tokens | 4/6/8/10/14px ve full | `src/index.css` | **Yok** |
| Motion duration | 150/250/350/500ms custom curves | `src/index.css` | **Yok** |

## Dikkat edilen mevcut teknik borç
- `--electric-violet`, `--info`, `--shadow-glow`, `--gradient-card-hover` gibi eski indigo tanımları sıcak editorial sistemle aynı dosyada bulunuyor. Hangi token'ın aktif kullanıldığını kesinleştirmeden silmeyin.
- Meta fontlarının bazıları Chromium'da 8–12px boyutlarına iniyor; okuma hiyerarşisi/200% text/reflow QA gerekir.
- Bileşen CSS Modules içinde bağımsız ölçüler var; tüm sayfalarda tek tip grid otomatik olarak garanti edilmez.
- Dark/light hem semantik durum renkleri hem kendi yüzeyleriyle sınanmalı; CSS semantik renkleri salt görsel seçime indirgememeli.

## Gelecekte açılacak onaylı alanlar — ŞİMDİ BOŞ
### Aşama 3: Color system
Durum: **PL-01 Oxide & Newsprint ONAYLANDI (CD-003, kullanıcı renk seçimini asistana devretti).** Light/dark hex değerleri, önerilen semantic durum renkleri ve WCAG kontrast ölçümleri [COLOR-SYSTEM-OPTIONS.md](./COLOR-SYSTEM-OPTIONS.md) dosyasında. Renk örnekleri [color-palette-reference.svg](./color-palette-reference.svg) dosyasında. **Seçili palet PL-01’dir.**

### Aşama 4: Typography
Durum: **TYPE-02 Expressive Issue, kullanıcı tarafından ONAYLANDI (CD-004).** Serif **Fraunces** (editoryal başlıklar), sans **Inter** (gövde, UI ve formlar), mono **IBM Plex Mono** (kaynak/meta/kod). [TYPOGRAPHY-OPTIONS.md](./TYPOGRAPHY-OPTIONS.md) karşılaştırma ve lisans kanıtlarını içerir. **Font aileleri/rolleri onaylı; font boyutları, gerçek variable axis ayarları, font dağıtımı, grid ve spacing henüz onaysızdır.**

### Aşama 5: Grid & spacing
Durum: **G-01 Editorial Spine ana sistem + G-02 yalnızca öne çıkan editoryal dosyalarda seçici kullanım ONAYLI (CD-005).** Öncelikli container 1280px, 12-column; masaüstü gutter 56px, gap 24px, 7:5 feature, 3-col feed; makale ana ölçü yaklaşık 715px. Mobil hedef gutter 26px @390 / 20px @320, dar ekranda tek akış. **G-02'nin site çapında 1440px genişliği, modüler dağılımı ve G-03 onaylanmadı.** Detaylar [GRID-LAYOUT-SPACING-OPTIONS.md](./GRID-LAYOUT-SPACING-OPTIONS.md). Bu değerler ileriki uygulama aşamasında içerik, zoom ve cihaz davranışına göre doğrulanmalıdır.

### Aşama 6: Components
Durum: **C-02 Inked Folio kullanıcı tarafından ONAYLANDI (CD-006).** [COMPONENT-SYSTEM-OPTIONS.md](./COMPONENT-SYSTEM-OPTIONS.md) içindeki karşılaştırma korunur; C-02 kapak/çerçeve/bölüm/CTA/forma dair karakterdir. **SİTE GENELİ GRID G-01 olarak kalır.** G-02 yalnızca seçilmiş featured dosyaların istisna kompozisyonudur. Durum semantiği, doğrulama kaynağı, son hover/motion ve pixel düzeyi ayrıntılar ayrıca incelenir.

### Aşama 9: Motion
Durum: bekliyor. Damping/curves/transitions/reduced-motion onaysız.

**Kural:** `DESIGN-DECISIONS.md` içindeki kullanıcı onayı olmadan bu bölümlere “approved” değeri girme ve kodu değiştirme.


## 1. ONAYLI — Oxide & Newsprint / temel brand renkleri

| Semantik rol | Light | Dark | Onay kaydı |
| --- | --- | --- | --- |
| background / paper | `#F4EFE6` | `#151B19` | CD-003 |
| elevated reading surface | `#FDFBF6` | `#222A26` | CD-003 |
| primary text / ink | `#1F2420` | `#EFEDE5` | CD-003 |
| secondary text | `#4F5A53` | `#B7BCAF` | CD-003 |
| primary link / button surface | `#A13826` | `#F2AC91` | CD-003 |
| text on primary button | `#FFFFFF` | `#151B19` | CD-003 |
| decorative companion only | `#C8B89E` | *onaysız* | CD-003 |

**Kullanım ilkesi:** Birincil vurgu kontrollü; kaynak doğrulama/bildirim durumları brand vurgu ile karıştırılmaz. Araştırmadaki light ink/paper yaklaşık 13,77:1, secondary/paper 6,28:1, white/accent 6,75:1; dark primary/background 14,90:1, accent/background 9,22:1. Gerçek sayfada mixed state ve image overlay kontrastları henüz ölçülmedi.

**Kapsam dışı:** Error/success/warning/info ve tüm focus/border/hover/disabled state renkleri `COLOR-SYSTEM-OPTIONS.md` içinde şimdilik adaydır; bu kararla *onaylı* duruma geçmediler. Typography ve layout da onaysızdır.

**Uygulama durumu:** Tasarım dokümanına kaydedildi. `src/index.css` ve diğer uygulama kodları Aşama 3'te **değiştirilmedi**.


## 2. ONAYLI — TYPE-02 Expressive Issue temel font aileleri
| Görev | Font | Durum |
| --- | --- | --- |
| Kapak / H1 / editoryal alt başlık | **Fraunces** | CD-004 ONAYLI |
| UI / uzun yazı / form / arama / okuma | **Inter** | CD-004 ONAYLI |
| Kanıt/meta / tarih / kod / komut | **IBM Plex Mono** | CD-004 ONAYLI |

**Kısıt:** Fraunces değişken SOFT/WONK eksenlerinde aşırı oyunbazlık yok; gerçek glif kapsamı, lisans dosyası, WOFF2 subset, font-display, fallback, CLS ve 200% zoom uygulamadan önce kontrol edilmeli. Bu bölüm font ölçüsü ya da sayfa layout'u için açık onay sayılmaz. `src/` henüz değişmedi.


## 3. ONAYLI — C-02 Inked Folio bileşen grameri (CD-006)

- **Masthead/navigation:** Bağımsız basılı dergi hissini taşıyan belirgin ayraç ve editoryal hiyerarşi; gerçek site route, TR/EN, mobile menu, keyboard ve command palette akışları saklı kalır.
- **Cards:** Featured için editoryal kapak/numara/blok vurgusu; standart liste kartı için dengeli içerik önceliği ve kaynak/kanıt bilgisi. Her kartı indiscriminately G-02 geniş kompozisyonuna dönüştürme.
- **Evidence:** Kutucuk/kurallı provenance bilgisi yalnızca gerçekten mevcut sunucu verisine bağlanır; yazar beyanı ile bağımsız doğrulama ayrı tutulur.
- **Actions/Forms/States:** Belirgin birincil CTA ve okunur ikincil outline; label/invalid/helper, empty/loading/error mesajları aynı yayının görsel kimliğini taşır. Bunlar tasarım kurallarıdır, henüz kod uygulanmadı.
- **Grid istisnası:** CD-005 G-02 kullanım sınırına dokunulamaz; varsayılan layout G-01 ve mobil tek akış.
- **Açık alan:** Kesin border/radius/hover/focus/semantic status tokenları, motion, component JSX implementasyonu, Aşama 7 homepage seçenekleri **onaysız**.


## Aşama 7 Homepage Design — ONAY BEKLENİYOR
**H-01 Issue Front / H-02 Discovery Desk / H-03 Curated Edition** seçenekleri [HOMEPAGE-OPTIONS.md](./HOMEPAGE-OPTIONS.md) dosyasında. [homepage-composition-reference.svg](./homepage-composition-reference.svg) yalnızca önerilerin şematik çizimidir. Önceki CD-001..006 onayları geçerlidir; H-01/02/03 ana sayfa tasarımı **henüz seçilmedi**. Bütün mockuplarda G-01 genel grid ve C-02 Inked Folio ana bileşen dili korunur; G-02 yalnızca seçili featured dosyalarda.


## 4. ONAYLI — H-01 Issue Front Ana Sayfa (CD-007)

G-01 ana 7:5 editoryal kompozisyonda büyük yayın karakteri + ulaşılabilir arama ve tek seçilmiş featured Inked Folio kapak. Kategori/format/evidence filtreleri, arama, URL state, 3-kolonlu normal feed ve gerçek kanıt/veri akışları korunur. G-02 **yalnızca selected featured editorial dosya** istisnasıdır. H-02 ve H-03 seçilmedi. Bu onay kodlama veya iç sayfa uygulama izni değildir.

**Aşama 8:** İç sayfaların tasarım alternatifleri **onaysız araştırma**; CD-007 bunlar için örtülü onay sayılmaz.


## Aşama 8 — Inner Pages & Editorial Experience (CD-008 ONAYLI)

`INNER-01 Reading Folio` / `INNER-02 Evidence Marginalia` / `INNER-03 Chaptered Field Guide` karşılaştırmaları: [INNER-PAGES-OPTIONS.md](./INNER-PAGES-OPTIONS.md) ve [inner-pages-composition-reference.svg](./inner-pages-composition-reference.svg). Makale, yazar, kimlik doğrulama, editör, kayıtlı içerik, profile, evidence/knowledge/admin, about/contact/404 dahil 16 iç rota kapsanır. **Hiçbir iç sayfa stili/başlık düzeni/kanıt yerleşimi onaylanmış değildir.** Ana sayfada H-01, genel grid G-01 ve yalnız seçilmiş featured dosyalarda G-02 sınırlaması geçerlidir.


### CD-008 — Onaylı iç sayfa sistem özeti
- **Makale:** INNER-02 kanıt marginalia ile yayına ait doğru provenance/freshness özeti, G-01 ~715px merkez metin, INNER-01 sakin okuyucu kolonunun nefesi ve daha az görsel gürültü.
- **Mobil:** Kenar kaynak notları düşey akışa girer; uzun summary makale başlangıcını engellemez. İçerik ve arama/eylem semantiği korunur.
- **Yazar ve About/Contact/404:** Basın yayını karakteri ama kullanılabilir metin/iyileşme görevleri önde.
- **Auth + Editor:** Form-first mobile, writing-first editor; gerçek loading/invalid/dirty/publish readiness görünür, dekoratif hikâye operasyonun önüne geçmez.
- **Knowledge/Admin:** Gerçek, erişilebilir tablo ve evidence durumları korunur, asılsız verified/role değişiklikleri yoktur.
- **INNER-03:** Yalnız gerçekten adım adım kılavuzlara seçici chapter/numara; varsayılan stil değildir.
- **Uygulama:** Henüz hiçbir JSX/CSS değiştirilmedi. Aşama 9 hareket süreleri ve etkileşimler ayrı karar kapısıdır.
