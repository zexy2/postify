# Postify — Aşama 5 / Grid, Layout & Spacing Alternatifleri

**Tarih:** 2026-10-17
**Durum:** **G-01 / G-02 / G-03 alternatifleri hazır; kullanıcı Aşama 5 onayı BEKLENİYOR.**
**Onaylı kararlar:** CD-001 A+B yaratıcı strateji; CD-002 MOOD-02 ana dergi karakteri ve MOOD-01 güven/kaynak disiplini; CD-003 PL-01 Oxide & Newsprint; CD-004 **TYPE-02 Fraunces + Inter + IBM Plex Mono**.
**Sınır:** Aşağıdaki hiçbir max-width, gutter, grid column, article measure, spacing token veya breakpoint **kullanıcı tarafından onaylanmamıştır**. `src/` ve uygulama kodu değişmedi. Aşama 6 Component Design System **başlatılmadı**.

## 1. Tasarım problemi ve mevcut durum

Stage 0 audit, global `--container-max: 1220px`, `--container-narrow: 740px` ve mevcut yedi spacing tokenını (4/8/16/24/32/48/64px) tespit etti. Home, Hero, PostDetail, Admin ve auth CSS Modules birbirinden bağımsız responsive kırılımları ve grid tanımları içeriyor. MOOD-02'nin görsel ifade gücüyle, MOOD-01'in arama/kanıt/okuma disiplini aynı sistemde buluşmalı. Uzun teknik yazı ölçüsü, kaynak rayı ve mobil öncelik, sadece ana sayfa vitrini kadar değerlidir.

**Bu aşamada tasarlanacak şey:** Grid stratejisi, sütun sayısı, viewport gutter, içerik/container ölçüsü, uzun yazı genişliği, makale destek rayı ve spacing ritmi. **Tasarlanmayacak şey:** Kartın son görsel formu, buton/hover, yeniden yazılmış içerik, nihai type scale, renk değişimi, gerçek application behavior.

## 2. Üç alternatif — biri bile ONAYLI DEĞİL

| Parametre | G-01 — Editorial Spine | G-02 — Modular Broadsheet | G-03 — Reading Sanctuary |
| --- | --- | --- | --- |
| Metafor | Editoryal omurga, kontrollü asimetri | Bağımsız gazete/dergi sayfası | Sessiz ve odaklı okuma stüdyosu |
| Masaüstü grid önerisi | 12 kolon, tutarlı omurga | 12 kolon, daha değişken modüller | 8 kolon, merkez hizalı |
| Maksimum dış container (öneri) | 1280px | 1440px | 1160px |
| Masaüstü yatay gutter | 56px | 64px | 70px |
| Masaüstü içerik gap | 24px | 20px | 32px |
| Ana sayfa hero / feature | 7:5 dengeli asimetri | 8:4 güçlü sayfa kesiti | Merkezde tek odak, büyük negatif alan |
| Listeleme | 3 sütun; ilk yazıya kontrollü vurgu | 3 farklı ölçülü kolon / modüler ritim | 2 eşit sütun; daha rahat tarama |
| Makale merkez okuma ölçüsü (örnek) | ~715px | ~740px | ~710px |
| Makale yanal açıklama | Sol TOC 170px + sağ kaynak rayı 210px | Sol TOC 120px + sağ kaynak/kanıt 270px | Öncelikle tek sütun; TOC ve kaynaklar akışta |
| Kırılım kurgusu (örnek) | 850px altında tek akış | 850px altında tek akış | 850px altında tek akış |
| 390px mobil dış gutter (örnek) | 26px | 26px | 26px |
| 320px mobil dış gutter (örnek) | 20px | 20px | 20px |

Not: Kolon oranları **kavramsal**; CSS Grid'deki 7:5/8:4 fr karşılaştırması kesin 12-col implementasyon eşlemesi değildir. İçerik max-width, okuma ölçüsü ve sticky ray geometrisi uygulama aşamasında ihtiyaç ve durumlarla kalibre edilir.

### G-01 — Editorial Spine / Dengeli editoryal omurga
- **Kompozisyon:** Güçlü, ölçülü asimetri. Büyük başlığa eşlik eden yararlı arama; öne çıkan yazı 7:5; düzenli içerik indeksi.
- **Uzun makale:** Ortalama 700–720px okunabilir gövde; solda bölüm içeriği, sağda kanıt/kaynak, merkeze metinsel öncelik.
- **Spacing hipotezi:** Temel 8px ritim; sık aralık 4/8/12/16; daha büyük adımlar 24/32/48/64/96. Grid gap 24.
- **Mobil:** Önce amaç/arama/featured; kartlar tek sütun; TOC ve kaynak notları makale akışına taşınır; içerik gizlenmez.
- **Avantaj:** MOOD-02 ile MOOD-01'i dengeler; tekrarlanabilir sistem ve tüm 17 rotaya taşınma potansiyeli yüksek.
- **Risk:** Tekdüzelik; her yazının aynı 7:5 kapak/3 sütun kullanması yaratıcı yayını standart şablona yaklaştırabilir.
- **Tasarım niyeti:** Editoryal varyasyon gerekecekse, bütün sistemin yönünü değiştirmeden sınırlı bölüm genişletmeleri önerilebilir (ayrı karar gerekir).

### G-02 — Modular Broadsheet / Modern modüler gazete
- **Kompozisyon:** 1440px içindeki geniş page band; 8:4 ana hikâye; ikincil içerik kartlarında farklı kolon ağırlıkları ve editorial dividers.
- **Uzun makale:** ~740px merkez; solda küçük TOC, sağda daha görünür kanıt/provenance rayı.
- **Spacing hipotezi:** 8px taban üstünde sık bölüm gap 20, vurgulu editoryal bölümlerde 32/48/72/96. Grid gap 20. Başlık/kapak ritmi daha cesur.
- **Mobil:** Kolon sırasını semantik DOM sırasına indir; kapak etkisi arama ya da kanıtı ekran dışına itmemeli.
- **Avantaj:** En çarpıcı bağımsız dijital yayın karakteri, güncel featured makaleyi önemli hissettirme.
- **Risk:** 17 sayfaya ve yükleme/empty/error durumlarına tutarlı aktarımda en yüksek tasarım/bakım maliyeti. Düzensiz görsel ağırlık keşfi yavaşlatabilir.

### G-03 — Reading Sanctuary / Sakin okuma çerçevesi
- **Kompozisyon:** 1160px dar max, merkez hizalı hero, büyük whitespace, iki sütunlu sade arşiv.
- **Uzun makale:** ~710px merkez; kaynak ve TOC ayrı yanal sabit raylar yerine metinsel akış içinde.
- **Spacing hipotezi:** Daha geniş boşluk ritmi 8/16/24/36/56/80/112; editoryal katman başına artırılmış blok aralıkları. Grid gap 32.
- **Mobil:** Çok sakin ve lineer okuma; az kaydırılabilir modül, konu/kanıt asla gizlenmez.
- **Avantaj:** Uzun okuma, metin odaklanması, sakinlik ve responsive sadelik çok güçlü.
- **Risk:** MOOD-02'nin ayırt edici bağımsız dergi kompozisyonu azalabilir; girişte içerik keşfi ve kanıt “aşağıda” algısı yaratabilir.

## 3. Gerçek tarayıcı prototip çalışması (UYGULAMA DEĞİL)

Sadece düzenlerin karşılaştırılması amacıyla React/Postify kaynaklarını hiç değiştirmeden, repository dışında **bağımsız statik HTML/CSS düzen prototipleri** oluşturuldu. Her seçenekte aynı placeholder teknik metin, aynı onaylı PL-01 renk değerleri ve aynı TYPE-02 ailesi adları kullanıldı. Bu nedenle **renk, tipografi kimliği ve içerik farkı değil; boşluklar, grid oranı ve içerik yerleşimi** karşılaştırıldı.

Tarayıcı: Chromium/Playwright, viewport **1440, 768, 390 ve 320px**. Her üç varyant için Home + Article = **3×2×4 = 24** statik görüntü/kontrol. Görünür sayfa genişliğini aşan horizontal scroll **24/24 kontrolde tespit edilmedi**. Masaüstü article content genişliği sırasıyla **715 / 740 / 710px**, mobil 390'da yaklaşık **338px** ve 320'de yaklaşık **280px** ölçüldü. Bu **statik geometrinin ön koşul** kontrolüdür; gerçek Postify bileşenleri, oturum, ekran okuyucu, 200% zoom, touch/focus ve responsive states için kabul testi değildir.

**Font dürüstlüğü:** Önceki Stage4 Oracle Chromium deneyinde TYPE-02 font aileleri gerçekten yüklenmişti. Bu Aşama 5 geometri önizlemesi, yerel Chromium'da `Fraunces` varsa kullanacak biçimde adlandırıldı, mevcut değilse serif fallback'e düşebilir. Dolayısıyla bu görseller **Fraunces'ın son piksel/metriklerinin garanti edilmiş örneği değildir**. Uygulama aşamasında gerçek font WOFF2 ile yeniden doğrulama gerekir.

**Karşılaştırma artefaktları (konuşma sandbox dosyaları):**
- `postify-stage5-home-desktop-comparison-cropped.png`
- `postify-stage5-home-mobile-comparison.png`
- `postify-stage5-article-desktop-comparison-cropped.png`
- `postify-stage5-article-mobile-comparison.png`
- `postify-stage5-layout-metrics.json` (24 render'lık ölçüm tablosu)
- İsteğe bağlı her varyant için ayrı `postify-stage5-G-0{1,2,3}-{home,article}-{1440,768,390,320}.png`.

Bu dış görsel prototiplerin hiçbiri uygulama bundle'ına, gerçek kullanıcı içeriğine veya production ortamına taşınmadı. Kalıcı kaynak kodunda `design/grid-layout-reference.svg` yalnızca **etiketli soyut plan** gösterir.

## 4. Uygulamanın 17 rotasına kapsam politikası (öneri)

| Route ailesi | Yerleşim sorumluluğu |
| --- | --- |
| Home / discovery | İlk 1 viewport'ta amaç, ara, featured ilişkisi açık; filtreler bütünsel akışta; featured/feed sıralama tekrar etmemeli |
| Article | Okuma ölçüsü, heading hiyerarşisi, kaynak/kanıt erişimi, code/table overflow ve TOC focus güvenli |
| Author / About / Contact | Aynı dış gutter ve tipografik akslar, fakat içerik ihtiyacına göre farklı iç measure |
| Login / Register / Recovery | Form küçük ekranda ilk görev; dekoratif uzun hikâye sonradan |
| Create / Edit | Yardımcı preview/format kontrolleri editorü sıkıştırmaz, taslak kaybı yok |
| Bookmarks / Profile | Empty/populated/loading için aynı dış aks, viewportta anlamsız boşluk yok |
| Knowledge / Admin | Tablolar ve durum panelleri desktopta genişleyebilir; mobilde yatay tablo kontrollü ve keyboard scroll erişilebilir |
| 404 / error / fallback | Eylem/kurtarma okunur ve erişilebilir; dar ekran büyük başlık yükü yok |
| Global navigation / toasts | Sticky header, mobile drawer, footer, bottom action tools ve bildirimlerde içerik gizlenmez |

**Layout tokenları, kullanıcının kararından sonra onaylanacak ve o aşamada bile yalnızca tasarım belgelerine kaydedilecektir.** Bileşen tasarımı (Aşama 6) ve sayfa kodu değiştirmek için ayrıca süreç onayı gereklidir.

## 5. Karar matrisi (öznel değerlendirme, ölçülmüş kullanıcı testi değil)

| Ölçüt | G-01 | G-02 | G-03 |
| --- | --- | --- | --- |
| MOOD-02 bağımsız dergi imzası | **Yüksek** | **En yüksek** | Orta |
| MOOD-01 kaynak ve uygulama UX | **Çok güçlü** | Güçlü ama dikkat ister | Güçlü |
| Teknik uzun okuma odağı | Çok güçlü | Güçlü | **En yüksek** |
| Tüm rotalara tutarlı taşınma | **En kolay** | Daha karmaşık | Kolay |
| Mobilde ilk içeriğe ulaşma | **Dengeli** | İyi, hero disiplinine bağlı | Daha fazla başlangıç boşluğu riski |
| Görsel bakım/veri durum karmaşıklığı | **Orta-düşük** | **Yüksek** | Düşük |
| Temel başarısızlık | Şablonlaşma | Kaotik dergi ve taşan bölümler | Sıradan, çok sakin arşiv |

**Tasarım yönetmeni önerisi (onay değil):** G-01 Editorial Spine ana sistem; G-02'nin daha cesur “feature story” vurgusu yalnızca içerik değeri gerçekten yüksek makale dosyaları için seçici uygulanabilir. Bu hibrit ayrıca kullanıcı tarafından tanımlanıp onaylanmalıdır; **kendiliğinden kesinleşmez**.

## 6. Aşama 5 karar kapısı

Kullanıcının **G-01 / G-02 / G-03** veya sınırları belirlenmiş hibriti açıkça onaylaması bekleniyor. Rakamlar ve örnek düzenler şu anda öneridir. Onayla birlikte seçilen grid/geometri/spacing prensipleri `DESIGN-DECISIONS.md` ve `DESIGN-SYSTEM.md` içine **approved** olarak taşınır, diğer iki alternatif tarihsel kayıt olarak korunur. **Aşama 6 Component Design System ancak bu açık onayla başlayabilir.** JSX/CSS/site deploy/GitHub push yapılmadı.
