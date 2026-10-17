# Postify — Aşama 10 / Responsive & Accessibility

**Tarih:** 2026-10-17
**Durum:** **Aşama 10 CD-010 kullanıcı onayı alındı: R-01 genel + R-02 yalnız makale/kanıt + R-03 yalnız auth/editör/admin/knowledge; WCAG 2.2 AA zorunlu.** Aşağıdaki karşılaştırma tarihi araştırma olarak korunur.
**Sınır:** Yalnızca gerçek uygulamada salt okunur denetim, tasarım seçenekleri ve belgeler. JSX/CSS, servis, veri, push veya deploy değişmedi. Aşama 11 başlatılmadı.

## Önceki bağlayıcı kararlar

CD-001 A+B; CD-002 MOOD-02 ana / MOOD-01 kanıt; CD-003 Oxide & Newsprint; CD-004 Fraunces + Inter + IBM Plex Mono; CD-005 site çapında G-01, yalnız selected featured editorial cover içinde G-02; CD-006 C-02 Inked Folio; CD-007 H-01 Issue Front; CD-008 INNER-02 Evidence Marginalia + INNER-01 uzun okuma, teknik rehberlerde sınırlı INNER-03; **CD-009 M-02 Editorial Rhythm genel, makale/auth/editör/admin için M-01 sakinliği ve yalnız featured cover için özel motion**.

**WCAG 2.2 AA bütün seçeneklerde zorunlu tasarım hedefidir; erişilebilirliği azaltmak bir seçim seçeneği değildir.** R-01/02/03 sadece responsive bilgi ve kontrol düzeninin nasıl çözüleceğiyle ilgilidir.

## 1. Mevcut, henüz yeniden tasarlanmamış uygulamanın gözlemleri

İzole worktree kodunu değiştirmeden, yerel Vite preview ve Oracle Chromium ile denetlendi. Kanıtlar repo dışında `/home/ubuntu/.oracle-dev/visual/postify-stage10/`.

- Hızlı **17 rota × 320/390/640/768/1440px = 85** gezinti: yatay overflow ve yakalanan JS `pageerror` yok. Ancak ilk `DOMContentLoaded+170ms` ölçümü bazı loading ekranlarını kapsar; **son ekran erişilebilirliği** için yeterli değildir.
- Yüklenmesi beklendikten sonraki **10 rota × 320/390/1440px = 30** derin örneklemde: yatay overflow **0**, JS pageerror **0**, görünür `img` alt yokluğu **0**, görünebilir form label yokluğu **0**, duplicate HTML ID **0**, görünür H1 sayısı **1**.
- **12 CSS px altı görsel metinler** 30/30 derin örnekte; marka mikro başlıkları, kaynak/güncellik, makale formatı ve form açıklamaları. Kontrast ve metin büyütme altında ayrıca kontrol gerekli. Bu otomatik olarak WCAG ihlali demek değildir.
- **24px altı anchor geometrileri** 30 örneğin **6'sında** görüldü (özellikle desktop `Oku`, `Devamını Oku`, login/register inline links ve makale section links). WCAG 2.2 AA `2.5.8` kuralı **24px veya yeterli spacing/inline istisnaları** içerir; her linki ihlal sayma. Öncelikli mobil etkileşimlerde 44px iyi UX hedefidir.
- **Makale anchor accessible-name adayları:** Üç article viewport'unda basit `innerText/aria-label/title/img alt` sezgisince isim bulunmayan TOC, download ve kaynak bağlantıları. AXTree, görünürlük ve gerçek AT kontrolünden önce ihlal kararı verilemez; otomatik heuristic bazı bağlantıları yanlış raporlayabilir.
- **Yazar örnek rotasında** üç genişlikte **2 main landmark** görüldü. `/users/sample-author` geçersiz/placeholder ID olabilir; gerçek public author ile yeniden inceleme gerekir.
- 6 protected rota (create/edit/bookmarks/admin/knowledge/profile) yetkisizken `/auth/login`'e yönlendi. **Gerçek giriş, editör, admin ve knowledge state'leri test edilmedi.**
- Klavye örneği: `/` filtre paneli 390/1440'da açılıp Escape ile kapandı, `aria-expanded` değişti ve odak açan düğmeye geri döndü. Beş örnekte skip link vardı; ilk 12 Tab'da gizli odak tespit edilmedi. Tam modal/focus-trap ve ekran okuyucu denetimi değildir.

**Kanıt dosyaları:** `existing-app-viewport-audit.json`, `deep-app-viewport-audit.json`, `deep-app-audit-summary.json`, `keyboard-theme-samples.json` ve seçilmiş screenshotlar aynı Oracle klasöründe. Bunlar kaydedilmiş mevcut uygulamaya aittir, yeni tasarım uygulanmış değildir.

### Onaylı renk sistemi kontrast hesabı (uygulanmış CSS değil)

| Token çifti | Oran | Yorum |
| --- | ---: | --- |
| Light ink `#1F2420` / paper `#F4EFE6` | **13,77:1** | Normal metin AA eşiği 4,5'i geçer |
| Light secondary `#4F5A53` / paper | **6,28:1** | 4,5'i geçer |
| White / accent `#A13826` | **6,75:1** | 4,5'i geçer |
| Dark ink `#EFEDE5` / dark bg `#151B19` | **14,90:1** | 4,5'i geçer |
| Dark secondary `#B7BCAF` / dark bg | **9,00:1** | 4,5'i geçer |
| Dark button foreground `#151B19` / `#F2AC91` | **9,22:1** | 4,5'i geçer |
| **Decorative rule** `#C8B89E` / light paper | **1,70:1** | Dekoratif olabilir; anlamlı input-border/focus veya aktif state'in tek işareti **olamaz** |

Bu oranlar yalnızca belirtilen opak renk çiftlerinin hesabıdır. Gerçek light/dark bileşenler, overlay, hover, disabled, error ve focus ayrıca test edilmeli. İşlevsel UI non-text contrast hedefi ≥3:1 (WCAG 1.4.11).

## 2. Responsive sunum alternatifleri — HİÇBİRİ ONAYLI DEĞİL

### R-01 — Editorial Reflow (site çapında içerik önceliği)
Desktop G-01 12-col, ~715px article; tablette kontrollü kırılım; 430/390/360/320 mobilde **tek sütun**, 20–26px civarı dış gutter. H-01 yayın vaadi ve arama ile featured kapak, ardından kategori/feed; *ilk gerçek içeriği* uzun dekorla aşağı itme. Article: H1 → kısa doğru kaynak özeti → metin → detaylı evidence; TOC ve bağlantılar mobile akışa girer. Auth form-first, editör writing-first, admin gerçek semantik tablo + klavyeyle erişilebilir kontrollü yatay scroll.

**Artı:** En tutarlı ve düşük riskli omurga, G-01 kararına doğrudan uyum. **Risk:** Mobil uzunluk artabilir; kaynak özetlerinin yüksekliği ve sticky çakışmaları izlenmeli.

### R-02 — Adaptive Marginalia (bağlama göre kaynak rayı)
R-01 içerik reflow temeli üzerinde **yalnız makale/evidence gibi gerekçeli rotalarda** geniş desktop TOC+provenance rayı. Tablet/mobilde kısa durum özeti **her zaman görünür**; uzun detay `details/summary` veya erişilebilir disclosure içinde, klavye ve ekran okuyucuyla açılır, kesin bilgi saklanmaz.

**Artı:** INNER-02 Evidence Marginalia düşüncesi gerçek alana doğru uyarlanır. **Risk:** Sticky TOC, mobil bottom bar, toast, soft keyboard, zoom ve focus obscured çakışmaları; açık/kapalı/geri dönüş QA artar.

### R-03 — Task-first Adaptive Workbench (korumalı üretkenlik rotaları)
Genel R-01 yayını bozmadan yalnız **auth/editor/admin/knowledge** rotalarında iş odaklı responsive yoğunluk: mobil auth form ilk; editörde yazı tuvali ve taslak/autosave/publish readiness görünür; knowledge/admin tabloları yatay scroll ve gerçek role/status semantiğiyle kullanılabilir. Yan araçlar genişte ayrılır, dar ekranda açıkça etiketli panel olur.

**Artı:** Özel kullanıcı görevlerinde az kaybolan kontrol, daha iyi form/yazı akışı. **Risk:** Daha çok varyant/durum; gerçek staging hesabı olmadan tamamlanmış UI testi yapılamaz.

### Karşılaştırma

| Tasarım kriteri | R-01 | R-02 | R-03 |
| --- | --- | --- | --- |
| Genel mobil yayın akışı | **En güçlü** | R-01 tabanına bağlı | R-01 tabanına bağlı |
| Article kaynak görünürlüğü | Güçlü | **En güçlü** | Orta |
| Auth/editor/admin üretkenliği | Güçlü | Orta | **En güçlü** |
| Focus/sticky/zoom karmaşıklığı | Daha düşük | Yüksek | Yüksek |
| Bakım ve test maliyeti | **En düşük** | Orta | Yüksek |

**Öneri, onay değil:** **R-01 ana responsive kuralı + R-02 yalnız article/evidence için kontrollü + R-03 yalnız ilgili protected iş ekranlarında**. Bunlar CD-005 G-02 istisnasını genişletmez. Her üç çözümde erişilebilirlik kuralları aynı derecede zorunludur.

## 3. Her tasarım için değişmez erişilebilirlik kabul kriterleri

- **WCAG 2.2 AA:** 1.4.3 normal metin 4.5:1, büyük metin 3:1; 1.4.11 anlamlı nontext UI 3:1. `1.4.4` 200% text resize, `1.4.10` 320 CSS px reflow (anlamlı iki boyutlu içerik istisnaları), `1.4.12` text spacing.
- Klavye: 2.1.1/2.1.2, bypass/skip 2.4.1, sıralama 2.4.3, focus görünür 2.4.7, **2.4.11 Focus Not Obscured (Minimum)**. **2.4.13 Focus Appearance** WCAG 2.2 **AAA**'dır; gönüllü kaliteli tasarım hedefi olabilir, AA zorunluluğu gibi kaydedilmez.
- **2.5.8 Target Size AA** min 24×24 veya istisna/yeterli spacing; önemli touch hedeflerinde 44×44 önerilir.
- 1.3.1/1.3.2 doğru semantik ve anlam sırası; 3.3.1/3.3.2 etiket/hata tanımı; 4.1.2/4.1.3 name/role/value ve status announcements.
- Responsive: 320/360/390/430/768/1024/1280/1440/1920, landscape, **gerçek browser 200/400% zoom** (sırf 320px viewport testi gerçek zoom yerine geçmez), TR/EN, dark/light, keyboard ve soft keyboard.
- Motion CD-009 ve `prefers-reduced-motion`: dekoratif motion kaldırılır; focus ve içerik aynı kalır. **2.3.3 Animation from Interactions AAA** gönüllü ek hedeftir.
- Auth editor admin için güvenli staging hesabı/fixture; Apple VoiceOver/Android TalkBack/NVDA manuel denetimi. Bunların hiçbiri **bu aşamada tamamlandı** diye iddia edilmez.

## 4. Öncelikli tasarım/teknik riskler

| Öncelik | Gözlem veya kalan test |
| --- | --- |
| P1 | 8–12px metinler, Türkçe uzun sözcükler ve zoom; okunur metadata sistemi |
| P1 | Makale TOC/download/source bağlantı adları AXTree ve AT ile teyit |
| P1 | Author placeholder görünümündeki çift main landmark açıklığa kavuşturulsun |
| P1 | Gerçek işlevsel border/focus durumları için yeterli kontrast; dekoratif çizgiyi state yerine kullanma |
| P1 | Mobil sticky article actions, toast, keyboard, focus overlap; render ve etkileşim senaryoları |
| P1 | Protected auth/editor/admin/knowledge gerçek state güvenli test hesabıyla ayrı |
| P2 | H-01 büyük kapak mobile ilk gerçek görevi ertelemesin |
| P2 | Gerçek font WOFF2/fallback, CLS/LCP/INP ve 200/400% browser zoom |

## 5. Karar kapısı

**Aşama 10 kullanıcı onayı henüz yok.** Kullanıcı R-01/R-02/R-03 veya açıkça sınırlandırılmış hibriti seçmeli. Karar `DESIGN-DECISIONS.md` ve `DESIGN-SYSTEM.md` içine ancak açık onayla işlenebilir. **Aşama 11 Final QA & Visual Polish kullanıcı Aşama 10'u onaylamadan başlamaz.** Her aşama belgesi uygulama kodu yetkisi sayılmaz.


## 6. Sonraki kullanıcı kararı: CD-010 (2026-10-17)
Kullanıcı **R-01 sitewide**, **R-02 sadece makale/evidence** ve **R-03 sadece auth/editor/admin/knowledge** politikasını açıkça onayladı; **WCAG 2.2 AA bütün ekranlarda vazgeçilmez**. Bu çalışma bir uygunluk sertifikası veya uygulama izni değildir. Sadece Aşama 11 Final QA & Visual Polish kalite planı açıldı. Önceki seçenekler tarihsel kayıttır.
