# Postify — Aşama 7 Homepage Design / Alternatives

**Tarih:** 2026-10-17
**Durum:** **H-01 Issue Front kullanıcı tarafından Aşama 7 için ONAYLANDI (CD-007)**. H-02/H-03 tarihi alternatiflerdir; yalnızca Aşama 8 alternatif araştırmasına geçildi, uygulama kodu değişmedi.

## Onaylı tasarım sınırları

CD-001 A+B editorial + evidence; CD-002 MOOD-02 ana + MOOD-01 kanıt disiplini; CD-003 PL-01 Oxide & Newsprint; CD-004 TYPE-02 Fraunces / Inter / IBM Plex Mono; CD-005 G-01 Editorial Spine genel grid ve **yalnızca seçilmiş featured editoryal dosyalarda G-02 kompozisyonu**; CD-006 C-02 Inked Folio bileşen grameri. **C-02 seçimi G-02 istisna kapsamını genişletmez.**

## Kaynaktaki mevcut HomePage sözleşmesi

İncelenen kaynaklar: `src/pages/HomePage.jsx`, `HomePage.module.css`, `src/components/Hero/Hero.jsx`, `EditorialFeed`, `KnowledgeCard`, `DiscoveryFilterPopover` ve `src/content/fallbackPosts.js`.

Korumamız gerekenler: gerçek featured post, alt metin/görsel ve içerik type/category/outcome/read time/tarih; arama ve Ctrl/⌘K; kategori ve guide/decision/explainer/field note; evidence/freshness/quick-read/sort; URL-backed filter state, reset ve sıfır-sonuç; local knowledge-gap isteği, 9'arlı Load More, bookmark, read-only fallback; TR/EN, light/dark, SEO, keyboard/focus ve erişilebilir menü. Verified/recheck/unknown yalnızca backend/evidence state'ine dayanır; örnek UI gerçek kanıt iddiası değildir.

## H-01 — Issue Front / Kapak Öncelikli

**Kompozisyon:** G-01 7:5 split, solda büyük Fraunces marka tezi + arama, sağda C-02 Inked Folio issue-feature kapağı; altında sade filtreler ve 3-kolonlu feed. Mobil sıralama: marka vaadi → arama → kapak → filtre → feed.

**Avantaj:** Bağımsız dijital dergi hissi en güçlü, featured içerik ilk bakışta önemli. **Risk:** Mobilde manifesto ve kapak arşiv keşfini aşağı itebilir. Kullanım için gerçekten değerli featured dosya gerekir; zorunlu sahte dergi sayısı yok.

## H-02 — Discovery Desk / Keşif Masası

**Kompozisyon:** G-01 7:5, solda teknik soruyu ve aramayı öne alan okunur paper/surface modülü, sağda featured dosya kapağı; altında doğrudan format/filtre ve arşiv. Mobil sıralama: kısa vaat → arama → featured kapak → filtre → feed.

**Avantaj:** Hızlı çözüme yönelme, kaynak/kanıt disiplinini daha iyi ortaya koyma ve mobil ilk eyleme erken erişim. **Risk:** Aramayı fazla kutu/ikonla donatmak sayfayı jenerik SaaS portala çevirebilir.

## H-03 — Curated Edition / Küratörlü Sayı

**Kompozisyon:** Büyük ama öz yayın başlığı; altta seçilmiş 3 yazılık editoryal içindekiler ve tek featured kapak için 7:5; liste sonrasında arama, filtre ve normal G-01 arşiv. Mobil sıra: intro → 3 seçki linki → arama → featured → feed.

**Avantaj:** Güçlü dergi kürasyonu, makale ilişkilerinin görünür olması. **Risk:** Gerçek sayı/kürasyon verisi yoksa örnek `ISSUE 08` üretimde sahte iddia olur; mobilde arama aşağı kayabilir. Yeni data modelinin gerçekten desteklemesi gerekir.

## Karşılaştırma

| Ölçüt | H-01 | H-02 | H-03 |
| --- | --- | --- | --- |
| Dergi kapağı kimliği | En güçlü | Güçlü | Çok güçlü |
| Aramaya ulaşım | İyi | **En güçlü** | Orta |
| Mobil ilk iş | Orta | **En iyi** | Kürasyon uzunluğu riski |
| Kanıt/filtre keşfi | Güçlü | **En görünür** | Orta |
| İçerik operasyonu ihtiyacı | Featured | Featured | Gerçek seçki/issue |
| Öncelikli risk | Büyük hero | Portal/SaaS hissi | Sahte issue kurgusu |

**Profesyonel öneri, onay değil:** H-02 Discovery Desk. Seçildiği takdirde C-02 kapak ve G-02 özel kompozisyon hakkı ancak zaten onaylanmış featured dosyalarında geçerli kalır.

## Browser görselleri ve dürüstlük notu

React/Postify uygulamasına dokunmadan, bağımsız örnek HTML/CSS ile **3 varyant × 1440 / 768 / 390 / 320 = 12 Chromium statik render** yapıldı. 12/12 yatay taşma ve yakalanan JS pageerror yok. Örneklerde 1 H1, bir arama inputu, altı içerik kartı ve görünür buton yüksekliği minimum 44px. Görsel örnekler arama, filtre, bookmark, login, veri yükleme veya kaynak doğrulama **çalışan davranışları değildir**.

**Font kısıtı:** Yerel browser dış ağ erişimi olmadığı için CSS'de onaylı TYPE-02 aileleri tanımlanmış olsa da Fraunces/Inter/IBM Plex Mono webfontları yüklenmedi; fallback kullanıldı. Bu görseller nihai tipografi metriği iddiası değildir.

**Örnek içerik:** Teknik başlıklar depodaki fallback yazılardan uyarlanmış, `ISSUE 08` ve öteki indeksler sadece mockup alanıdır. Gerçek yayın numarası, doğrulanmış kaynak, tarih veya kanıt iddiası yok.

Görseller, bağlantıları bu sohbetten verilen `/mnt/data/postify-stage7-desktop-comparison.jpg`, `/mnt/data/postify-stage7-mobile-comparison.jpg` ve her varyant için `postify-stage7-H-0{1,2,3}-{1440,768,390,320}.png` dosyalarında. `postify-stage7-measurements.json` tarayıcı sonuçlarını saklar. Repo içindeki `design/homepage-composition-reference.svg` yalnızca soyut çizimdir, çalışan ekran değildir.

## Sonraki aşama kapısı

**Aşama 7 ONAYSIZ:** H-01/H-02/H-03 ya da net hibrit kullanıcı tarafından onaylanmalıdır. **Aşama 8 Inner Pages & Editorial Experience** bu onay gelmeden başlamaz. Homepage seçimi de React/CSS kodlama veya push/deploy izni değildir.


## 7. Sonradan gelen onay (CD-007)
2026-10-17, kullanıcı **H-01 Issue Front** ana sayfasını açıkça onayladı. Onay tasarım kurgusuyla sınırlıdır: G-01 genel iskelet ve tek featured dosya için sınırlı G-02. H-02/H-03 alternatif olarak saklanır. Bu sayfadaki “onay bekleniyor” cümleleri ilk sunumun tarihsel kayıtlarıdır; **Aşama 8 Inner Pages alternatifleri şimdi hazırlanabilir, uygulama kodu yazılamaz**.
