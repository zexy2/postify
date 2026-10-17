# Postify — Aşama 9 / Motion & Interaction Design Alternatifleri

**Tarih:** 2026-10-17
**Aktif aşama:** **Aşama 9 ONAYLANDI: M-02 genel, M-01 görev ekranlarında; selected featured-only özel hareket (CD-009).** Diğer seçenekler tarihsel alternatiflerdir.
**Uygulama durumu:** Postify uygulama kaynak koduna, mevcut CSS animasyonlarına, API, route, font varlıklarına, servislere, GitHub push'a ve deploy'a **dokunulmadı**. Yalnızca `design/` araştırma notları, bağımsız statik demo ve karşılaştırma görselleri.

## 0. Yetkili tasarım girdileri ve sınırlar

- CD-001 A+B Living Field Manual + Independent Review.
- CD-002 MOOD-02 Independent Issue ana, MOOD-01 güven/kanıt disiplini, MOOD-03 teknik illüstrasyon yalnız uygun içerikte.
- CD-003 PL-01 Oxide & Newsprint renkleri.
- CD-004 TYPE-02 Fraunces display, Inter UI/longform, IBM Plex Mono metadata/code.
- CD-005 G-01 Editorial Spine site geneli, G-02 Modular Broadsheet yalnız **seçilmiş featured editoryal dosya kapaklarında**.
- CD-006 C-02 Inked Folio ortak component grameri.
- CD-007 H-01 Issue Front homepage.
- CD-008 Aşama 8 kullanıcı delegasyonu: **INNER-02 Evidence Marginalia ana + INNER-01 sakin okuma + INNER-03 sadece adım adım teknik rehberler**.
- Bu aşamada Aşama 9 motion aileleri, interaction transitions ve reduced-motion davranışları **kullanıcı onayına sunulur**. Önceki delegasyon Aşama 9'u otomatik onaylamaz.

**Tasarım prensibi:** En modern deneyim, çok hareketli deneyim değildir. Yüksek kaliteli motion, yalnızca **neyin değiştiğini**, **nereye gidildiğini** ve **işlemin sonuçlanıp sonuçlanmadığını** açıklaştırır. Uzun yazı okuyan kullanıcıyı durdurmaz.

## 1. Mevcut kaynak davranışından risk haritası (yeni karar değil)

Postify'da hareket ayrı CSS Modules içinde dağınık:
- `src/index.css` transition duration tokenları, bazı opacity/color geçişleri.
- `Header.module.css` mobile menu/hamburger, nav focus/hover; `components/ui/sheet.module.css` panel açılış animasyonları.
- `Hero.module.css` featured image yaklaşık 550ms transform ve kart hover, primary CTA.
- `KnowledgeCard.module.css` card transform, box-shadow, image filter, read arrow; reduced-motion override.
- `CommandPalette.module.css` modal 180ms; `confirm-dialog.module.css` 160/180ms.
- `ReadingProgress.module.css` yaklaşık 50ms width; `SystemStatus.module.css` infinite progress alternate 1.25s; `RichTextEditor.module.css` AI-loading dot pulse; reduced-motion uygulamaları var.
- Mevcut görsel durumlar ve başlangıç animasyonları farklı kurallarda olduğu için ileride tek token/interaction policy eşleştirmesi gerekli. **Bu aşamada hiçbir kod standardize edilmedi.**

## 2. Üç farklı hareket stratejisi — HİÇBİRİ ONAYLI DEĞİL

| Özellik | M-01 Quiet Precision | M-02 Editorial Rhythm | M-03 Kinetic Issue |
| --- | --- | --- | --- |
| Ana yaklaşım | En az hareket, metne öncelik | Editoryal ritim, kontrollü tepki | Dinamik yayın kapağı, belirgin sahne |
| Hover / link | 120–150ms renk/underline; kart yerinde | 140–180ms kontrast/underline, 1–3px kontrollü lift | 240–300ms, 4–8px yükselme ve kademeli görünüm |
| Drawer/command | 150–190ms | 220–260ms | 380–450ms |
| Featured image/cover | Statik; hover sadece renk | 260–340ms seçici ve sınırlı editorial wipe | 450–600ms belirgin wipe + kademeli kart hareketi |
| Stagger | Yok | Çok sınırlı, yalnız seçilmiş editoryal öğelerde 30–45ms | 70–100ms, geniş alanlara yayılabilir |
| Reading progress | Durum göstergesi; scroll ile doğrudan güncelle | Aynı; gereksiz animasyon yok | Aynı; gerçek okuma durumu gizlenemez |
| Modal/confirm/error | Öncelik: hemen anlaşılır | Öncelik: hemen anlaşılır | Ağır kapanma gerçek görevlerde risk |
| Temel artı | En sakin ve güvenilir okuma | **Profesyonel dinamizm / okuma dengesi** | En yüksek demo enerjisi |
| Temel risk | Fazla nötr/statik hissedebilir | Her yere motion uygularsan yorar | Kullanıcıyı bekletir, CLS/INP ve sahne gürültüsü riski |

### M-01 — Quiet Precision
- Tipografik ayraç, arama/filtre state ve source indicator **anında anlam kazanır**; yalnız hover ve kısa overlay değişimi.
- 120–150ms renk/underline; menü, modal/drawer ~180ms; featured cover için sweep/stagger yok.
- **Avantaj:** Uzun okuma ve düşük CPU/motion sensitivity, yüksek kontrol duygusu.
- **Dezavantaj:** C-02 Inked Folio kapağının premium “dijital yayın” hissi biraz statik kalabilir.
- **İç sayfalarda:** Article, editor, auth ve admin için çoğu zaman yeterlidir.

### M-02 — Editorial Rhythm
- Önce **anlamlı durum feedback'i** (buton/aktif filtre/link); ikinci sırada **hafif sayfa hareketi**.
- Örnek parametreler **yalnız aday**: link/card ~160ms; drawer ~250ms; **yalnız seçilmiş featured kapakta** 300–320ms kısa reveal/wipe; hover kart 1–3px; varsa içerik sequence 30–45ms'den fazla değil.
- **Her ekranda reveal yok.** Article metni, inputlar, evidence status, publish-ready mesajı ve TOC **kullanıcıyı bekletmeden** erişilir. G-02 istisnası hâlâ yalnız selected featured içindir.
- **Etkileşim:** Focus-visible sabit ve güçlü; mouse/touch/focus aynı anlamı iletir; toast hemen okunabilir, async işlemde progress/success/error gerçeği gösterir.
- **Avantaj:** TYPE-02 başlıklarına, H-01 issue kapağına ve C-02 bileşenlerine modern ama kontrollü hareket.
- **Dezavantaj:** Her tasarımcı mikro-etkileşim eklerse motion bütçesi dağılır. Merkezi politikaya ihtiyaç var.

### M-03 — Kinetic Issue
- Kapakta güçlü renk wipe, yaklaşık 500ms; geniş hover lift ve kademeli kart görünümü; menü yaklaşık 420ms.
- **Avantaj:** İlk bakışta daha sahneli ve etkileyici bir dijital yayın.
- **Risk:** Kullanıcıya geç yanıt hissi, düşük güçlü cihazlarda sorun, kanıt durumunu görsel efektin arkasına gizleme; gereksiz parallax etkisine kayma.
- **Sınır:** WebGL, scroll-jacking, sonsuz dekoratif döngü **hiçbir alternatifte önerilmez**. M-03'ün aşırı motion'ı kullanıcı tarafından açıkça onaylansa dahi WCAG/performans kapılarında reddedilebilir.

## 3. WCAG 2.2 AA, semantik etkileşim ve motion erişilebilirliği

**Tüm alternatiflerde zorunlu:**
1. `prefers-reduced-motion: reduce` için dekoratif animasyon ve geçişleri kaldır; layout ve içerik erişimi aynı kalsın. Tamamen işlevsel loading/progress için statik metin veya gerçek indikatör seç.
2. Modal/menü: Escape kapanışı, **focus return**, uygun tab sıra/focus trap, screen-reader label/aria-expanded ve focus görünürlüğü. Bir demonstrasyonda Escape çalışması **gerçek app erişilebilirlik doğrulaması değildir**.
3. Scroll-triggered reveal, forced pause, parallax, auto-play decor, text letter-by-letter giriş, opacity:0 içerik saklama **varsayılan değildir**. Uzun makale, CSS olmadan da okunur.
4. İnteraktif geribildirim yalnız renk veya hover değil; underlined link/shape/status message/keyboard focus.
5. `transform` ve `opacity` gibi compositor dostu animasyonlar tercih edilir; ağır `filter`, büyük blur ve layout reflow animasyonundan kaçın. Gereksiz `will-change` kullanımını sınırlı tut.
6. Fixed/sticky header, mobile drawer, virtual keyboard, zoom, iOS/Android touch, focus visibility ve 44px hedeflerinde gerçek tarayıcı ve AT kontrolü gerekir.
7. Async submit, auth, bookmark, publish, comments ve role mutation işlevleri motion yüzünden gecikmez, gerçekleşmemiş işlemleri başarıyla sonuçlanmış gibi göstermez.
8. Aşama 10'da 200%/400% zoom, dark/light ve prefers-reduced-motion matrisi; Aşama 11'de gerçek performans LCP/CLS/INP testleri yapılmalı. Bu aşama **WCAG sertifikası vermez**.

## 4. Gerçek Chromium'da bağımsız motion prototipi ve test sonucu

Oracle Chrome/CDP üzerinde Postify repo **dışında** üç ayrı HTML specimen oluşturuldu. Her örnek aynı PL-01/TYPE-02 isimleri/G-01 kompozisyonu/C-02 featured cover + üç standart kart ile çalışıyor. Bazı fontlar fallback gösterebilir; final font metrikleri veya gerçek Postify visual QA iddiası yok.

**Test matrisi:** 3 alternatif × 2 viewport (**1440**, **390**) × 2 motion preference (**normal**, **reduced**) = **12** Chromium koşumu. Her testte:
- Açılışta `scrollWidth <= viewport`; gözlenen yatay taşma **0**.
- Basit menü tetikleyicisi tıklandı, `aria-expanded` açıldı, ilk düğmeye fokus taşındı, Escape ile menü kapandı ve fokus tetikleyiciye geri geldi.
- Yakalanan `pageerror` **0**.
- Reduced motion açıkken animasyon/transition süreleri örneklerde hesaplanan **0.01 ms**'e düştü.
- Normalde M-01 hover 130ms/drawer 180ms; M-02 hover 160ms/drawer 250ms; M-03 hover 260ms/drawer 420ms gözlendi.
- Bu **mock menü etkileşimidir**, production menü keyboard focus-trap veya Supabase auth testi değildir.

**Remote Oracle kanıt yolları:** `/home/ubuntu/.oracle-dev/visual/postify-stage9/M-0{1,2,3}.html`, `M-0{1,2,3}-{1440,390}[-reduced].png`, `motion-test-results.json`; script `motion-specimens.cjs`. Bu dosyalar repo dışında; source uygulamaya bağlı değil.

**Kullanıcıya verilen storyboard araştırma dosyaları (yerel):** `/mnt/data/postify-stage9-motion-comparison.png`; 3 kısa GIF `postify-stage9-M-01.gif`, `...-M-02.gif`, `...-M-03.gif`. GIF'ler yalnızca hover ve editorial cover hareketinin **kavramsal eskizidir**, gerçek tarayıcı kodu veya ürün animasyonu değildir. Sahte “verified” işareti bulunmaz.

## 5. Sanat yönetmeni değerlendirmesi ve önerisi

**Öneri (onay değil): M-02 Editorial Rhythm.** “Olabilecek en modern görünüm” beklentisi, yüksek görsel ustalık ve amaçlı hareketle daha iyi karşılanır. M-01'den kanıt, form, editor, reading ve admin gibi üretken işlerde **neredeyse anlık tepki disiplini** alınabilir. M-03 gösterişli olsa da C-02 Inked Folio ve H-01 Issue Front zaten güçlü olduğundan tüm siteye ek hareket gereksizdir.

Kullanıcı isterse M-02'yi seçerken “article ve auth M-01 kadar sakin, sadece featured story M-02” gibi açık kapsam tanımı kullanabilir. Bu hibrit ancak kullanıcı seçimiyle kesinleşir. **M-03 otomatik olarak özellik listesine girmez.**

## 6. Karar kapısı — Aşama 9 BEKLENİYOR

Kullanıcının **M-01 / M-02 / M-03 veya açık kapsamlı hibrit** onayı beklenir. Kullanıcı kararından sonra ilgili motion token ve interaction kuralları `DESIGN-DECISIONS.md` ve `DESIGN-SYSTEM.md` dosyalarına onaylı kaydedilebilir. **Aşama 10 Responsive & Accessibility** bu açık onay olmadan başlamaz. Uygulama kodu ve üretim servisleri kullanıcı açıkça yetkilendirmedikçe **değiştirilmeyecek**.


## 7. Açık kullanıcı kararı — CD-009
2026-10-17 **M-02 Editorial Rhythm** onaylandı, makale/auth/editör/admin alanlarında M-01 sakin/hızlı etkileşim şartıyla. Özel hareket yalnızca seçili featured editoryal kapaklarda. Bu karar M-03 ve site çapında kinetik motion izni değildir; `prefers-reduced-motion` mutlaka desteklenir. Aşama 10 Responsive & Accessibility araştırmasına geçilebilir, uygulama kodu değiştirilmez.
