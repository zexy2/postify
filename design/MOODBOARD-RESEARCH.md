# Postify — Stage 02 / Reference Research & Moodboard Explorations

**Araştırma tarihi:** 2026-10-17
**Aktif aşama:** **2 — Referans Araştırması ve Moodboards.**
**Durum:** Üç araştırma/moodboard alternatifi sunuldu; **Aşama 2 kullanıcı onayı BEKLENİYOR**.
**Onaylı strateji:** CD-001 — **A+B hibriti:** The Living Field Manual (pratik, test edilebilir ve kaynaklı bilgi) + The Independent Review (bağımsız, karakter sahibi editoryal yayın).
**Kesin sınır:** Bu belge **Renk Sistemi (Aşama 3), Tipografi (Aşama 4), Grid (Aşama 5), Bileşenler (Aşama 6) veya UI kodu** hakkında hiçbir bağlayıcı seçim değildir.

## 1. Araştırma yöntemi ve kanıt standardı

- Kaynakları **gerçek yayın sitelerinin mevcut sayfalarından** seçtik. Her kaynağın ana sayfası Oracle Chromium CDP üzerinden **1440 × 900 ve 390 × 900** boyutlarında **17 Ekim 2026** tarihinde açılıp ekran görüntüsü alındı; HTTP durumları her iki boyutta 200 olarak görüldü. Analiz, kaynakların site metinleriyle de karşılaştırıldı.
- Görseller izinsiz kopyalanıp üretim varlığına dönüştürülmedi. **Ham referans ekran görüntüleri ve üç açıklamalı kompozit araştırma moodboard'u Oracle içindeki** `/home/ubuntu/.oracle-dev/visual/postify-stage2/` **klasöründe** bulunur; public Github source içine telifli ekran görüntüsü commit edilmez.
- `source-snapshots.json` metadata, URL, ekran genişliği, kaynak başlıkları ve yerel kanıt yollarını içerir. `moodboard-01.jpg`, `moodboard-02.jpg`, `moodboard-03.jpg` arşivlenmiş **gözlemsel** moodboard karşılaştırmalarıdır (nihai Postify UI tasarımı değil).
- Ayrı olarak üretilen üç-panelli **kavramsal taslak** (konuşma içi `a_wide_clean_editorial_moodboard_ux_design_presen.png`): üç alternatifin anlatım eskizi; **gerçek kaynak ekran görüntüsü değildir**, kapaktaki metin/görseller, teknik iddialar, verified etiketleri ve yazar adları örnektir, gerçek içerik/doğrulama sayılmaz.
- Site tasarımları 2026-10-17 anlık gözlemleridir, zamanla değişebilir. Erişilebilirlik veya performansları hakkında özel teknik test yapılmadı; gözlemlenen düzenler otomatik olarak WCAG uygun değildir.

## 2. Kaynakların gerçek inceleme listesi

| Kod | Gerçek kaynak | Tarayıcıda görülen | Postify için alınabilecek ilke | TaşınMAYACAK şey | A+B bağı |
| --- | --- | --- | --- | --- | --- |
| R-01 | [A List Apart](https://alistapart.com/) | Büyük yayın başlığı, uzun metin odaklı listeleme, yazar/yorum ve tarih hiyerarşisi; yoğun görsel reklamı yerine metin | Okuma önceliği, içerik indeksinin sakinliği, başlık özgüllüğü | Eski tasarımın birebir tiplendirmesi, küçük metadata, fazla çıplak metin | **A güçlü**, B orta |
| R-02 | [Our World in Data](https://ourworldindata.org/) ve [source transparency](https://ourworldindata.org/redesigning-our-interactive-data-visualizations) | Araştırma/özet/konu araması ve veri kaynaklarını ayrı gösteren yapı; araçların kaynak paylaşımı ve indirilebilirliği açık | Kanıt/kaynak/güncellik ve yöntem bilgisine hızlı erişim; yeniden kullanılabilir kaynak sunumu | Postify'ı veri dashboard'una çevirmek, grafik yoğunluğunu makalelere zorlamak | **A çok güçlü**, B düşük |
| R-03 | [Maggie Appleton](https://maggieappleton.com/) | Görsel essay/notes/garden ayrımı, güçlü yazar tonu ve sakin giriş, konu eşleştirme | Teknik konulara insani, elden geçirilmiş anlatım; notun gelişme durumu; düşünceyi açıklayan çizim | Kişisel günlük kimliği, her makaleye çizim yükü, kanıtı yazar üslubuyla karıştırmak | A+B orta |
| R-04 | [Quanta Magazine](https://www.quantamagazine.org/) | Büyük bilime özgü kapak imgesi, güçlü başlık ve editoryal kategori ayrımı; gerçek siteye 1440/390 erişildi | Makaleyi ayrı bir yayın olarak değerli hissettiren hikâye hiyerarşisi, kaliteli konu görselleri | İddiaların kanıtını görselin altında gizleyen yoğun kapaklar; pahalı stok görsel bağımlılığı | **B çok güçlü**, A orta |
| R-05 | [Works in Progress](https://worksinprogress.co/) | Baskı dergisine benzer issue/spotlight ayrımı, bağımsız yayın başlığı, hikâye/konu/yazar dizini | Editoryal issue ritmi ve kürasyon; ayırt edici makale açılışları | Postify'ın tüm içeriğini sayılı magazine issue modeline zorlamak; derin archive navigasyonunu şişirmek | **B çok güçlü**, A orta |
| R-06 | [The Pudding](https://pudding.cool/) | Zengin görsel essay arşivi, her konu için ayrı anlatı düzeni ve etkileşim anlayışı | Görsel anlatının gerçekten karmaşık fikir açıklaması; açıklayıcı diyagram/örnekler | Her makaleye deneysel scroll animasyonu, veri şovu, performans açısından ağır içerik üretimi | B güçlü, A amaçlı |
| R-07 | [Stripe Press](https://press.stripe.com/) | Yayın/kitap nesnesine güçlü kimlik; ancak Oracle'daki ilk viewport kaydı çok koyu/az içerikli render gösterdi | Editoryal objenin “değerli eser” hissi; seçicilik ve kitabın kendi konsepti | 3D/WebGL/immersive kitap demo'larını Postify kullanıcı akışına taşımak. İlk görünüm ekran görüntüsü **layout örneği olarak yetersiz** | B ikincil |

**Önemli:** R-07 gerçek site doğrulandı ancak Chromium'un ilk görünümünde yeterli içeriği yakalayamadık; bu nedenle üç kaynaklı temel moodboard'lardan dışarıda bırakıldı ve yalnızca yayın kimliği için **ikincil kavramsal referans** olarak tutuldu.

## 3. Üç moodboard — aynı onaylı A+B stratejisinin farklı ifade dengeleri

### Board 01 — Evidence-led Editorial / Kanıt Öncelikli Editoryal
**Araştırma görseli (Oracle):** `/home/ubuntu/.oracle-dev/visual/postify-stage2/moodboard-01.jpg`
**Gerçek referanslar:** R-01 A List Apart, R-02 Our World in Data, R-03 Maggie Appleton.

**Okuma:** Bir editoryal yayın estetiği, fakat kaynak/deney/son güncelleme bilgisi çekici görüntüden geri kalmıyor. *Saha defteri* A gövdesi ağırlıklı, B yalnızca anlatı kalitesini güçlendirir.

**Bilgi hiyerarşisi eskizi (onaysız, kesin grid değil):**
1. Ne çözüyor? / Kime yarar? / Güncel mi?
2. Editörün seçtiği bir problem ve gerçek uygulanabilir sonuç.
3. Konu/format indeksi + kaynak/sınırlama işaretleri.
4. Makalede problem → uygulama → kanıt → güncelleme yeri net.
5. Mobilde ilk ekranda hızlı çözüm ve erişilebilir arama; süslü hero içerikleri gölgelememeli.

**Güçlü:** Güven ve okunabilirlik; sistemin yazar ve kaynak alanlarıyla hemen çalışır.
**Zayıf:** Fazla sade/teknik kalabilir; Postify bir ürün dokümantasyonu gibi hissedilebilir.
**Dikkat:** Aşırı rozet, mikro-yazı, sonsuz kontrol paneli oluşturma.
**Postify geçerli sayfalar:** Home arama/indeks, Article bilgi özeti/evidence, Author, Knowledge health.

### Board 02 — Independent Issue / Bağımsız Yayın Dosyası
**Araştırma görseli (Oracle):** `/home/ubuntu/.oracle-dev/visual/postify-stage2/moodboard-02.jpg`
**Gerçek referanslar:** R-05 Works in Progress, R-04 Quanta Magazine, R-01 A List Apart.

**Okuma:** Hikâyesi ve karakteri olan bir yayına giriş hissi. B'nin anlatı/sanat yönetimi başta, fakat teknik içerikte A'nın sonuç/kanıt alanı otomatik koruma altında.

**Bilgi hiyerarşisi eskizi:**
1. Dikkat çeken bir *güncel yayın dosyası/feature* (her içerik için ayrı kapak zorunlu değil).
2. Girişte doğrudan “neden okunmalı” ve doğrulama/güncellik notu.
3. Biri öne çıkarılan, diğerleri erişilebilir özetli arşiv/konu dizisi.
4. Makale bir başlık/özet/okuma alanı olarak nefes alır; kaynaklar, test ortamı ve sınırlamalar açık.
5. Mobilde büyük başlık yararlı ilk içeriğin önüne geçmez; görseller lazy/fit.

**Güçlü:** Özgün premium dijital yayın kimliği ve hatırlanabilir kompozisyon.
**Zayıf:** Hero fotoğrafına bağımlılık, bulunabilirlik/kanıt ikinci plana düşebilir.
**Dikkat:** “Awwwards demo site” için görsel şov; zorunlu hareket, WebGL veya anlamsız parallax yok.
**Postify geçerli sayfalar:** Home featured, Article first fold, About, editorial article collections.

### Board 03 — Illustrated Field Stories / Çizimli Teknik Hikâyeler
**Araştırma görseli (Oracle):** `/home/ubuntu/.oracle-dev/visual/postify-stage2/moodboard-03.jpg`
**Gerçek referanslar:** R-03 Maggie Appleton, R-06 The Pudding, R-02 Our World in Data.

**Okuma:** Metin, diyagram ve kanıt beraber düşünülür; kavram açıklamalarında görsel eğiticidir, süs değildir. A'nın öğreticiliği ve B'nin karakter sahibi hikâyesi eşit ifade bulur.

**Bilgi hiyerarşisi eskizi:**
1. Teknik sorun sorusu → görselle açıklanabilir tek fikir.
2. Basit diyagram ve adım odaklı anlatı; kod örnekleri asıl metnin yerini almaz.
3. Kaynaklar ve gerçek deneylerden ayrışan örnek illüstrasyon.
4. Uzun anlatılar az, anlamlı infografiklerle desteklenir.
5. Mobilde düşük çözünürlüklü harita/taşma olmamalı; tüm diyagramların metin alternatifi ve reduced-motion statik hali olmalı.

**Güçlü:** Karmaşık konularda anlaşılırlık ve benzersiz ifade.
**Zayıf:** Her yazı için doğru grafik/diyagram üretmek pahalı; yanlış teknik diyagram, güvene zarar verir.
**Dikkat:** Hergün jenerik teknoloji illüstrasyonu veya gereksiz görsel gösteri değil.
**Postify geçerli sayfalar:** Explainer ve Guide yazıları, mimari anlatımlar, kaynak bağımlılıkları.

## 4. Özet karşılaştırma (tasarım değerlendirme, ölçülmüş kullanıcı testi değil)

| Alan | 01 Evidence-led Editorial | 02 Independent Issue | 03 Illustrated Field Stories |
| --- | --- | --- | --- |
| Postify'ın uygulanabilir bilgi hedefi | **Çok güçlü** | Güçlü | **Çok güçlü**, doğru diyagram varsa |
| Güven/kanıt görünürlüğü | **En kuvvetli** | Özellikle korunmalı | Çok güçlü olabilir |
| İlk bakışta editoryal karakter | Orta-yüksek | **En kuvvetli** | Çok kuvvetli |
| Uzun yazı okuma | **Kuvvetli** | **Kuvvetli** | İçeriğe göre değişken |
| Yüksek hacimli makale arşivi ölçeği | Yüksek | Yüksek | İçerik üretim maliyeti yüksek |
| Görsel içerik üretim ihtiyacı | Düşük | Orta-yüksek | **Yüksek** |
| Temel risk | Jenerik docs görünümü | Görsel dergi makaleye engel | İllüstrasyon/animasyon maliyeti |

**Tartışmaya açık yönlendirici görüş, karar değil:** 02'nin editoryal karakterini 01'in doğrulama/erişilebilirlik disipliniyle sürdürmek A+B hibritine yakın durur. 03'ün çizimli açıklama yaklaşımı yalnızca buna uygun içeriklerde ikincil/opsiyonel olabilir. **Kullanıcı onayı olmadan hiçbir birleşim veya seçenek kesinleştirilmez.**

## 5. Tüm seçeneklerde kaçınılacaklar
- İlgisiz lifestyle/travel/health/stock içerik görselleri; ilk önce üretilen hatalı moodboard bu yüzden reddedildi.
- Gerçek olmayan “verified/tested” iddiaları, yanlış yazar bilgisi, gösteriş için sahte kanıt rozetleri.
- Çoğaltılmış hero metinleri, kullanıcı görevini saklayan splash ekranları, şablon SaaS/dashboard dili.
- Metinden daha ilginç olmaya çalışan illüstrasyon/animasyon ve performansı gereksiz düşüren WebGL/parallax.
- Yetersiz kontrast ve mikro-tipografi; mobil overflow, 200% zoom'da kesilme.
- Referans sayfalardan kod, logo, görsel, font, renk paleti ya da kompozisyonun birebir kopyalanması.
- Referans screenshot'larının izin kontrolü olmadan kalıcı repo/production içine kopyalanması.

## 6. Onay kapısı — Aşama 2

**Karar BEKLENİYOR.** Kullanıcıdan:
- **01 — Evidence-led Editorial**, veya
- **02 — Independent Issue**, veya
- **03 — Illustrated Field Stories**, veya
- A+B içinde açıkça tarif ettiği alt denge/hibridi

seçmesini iste. Seçim sonrası referansların hangi soyut ilkelerinin Postify'a taşınacağı ve kaçınılacak olanlar `DESIGN-DECISIONS.md` içinde onay metniyle kaydedilir. **Aşama 3 Color System'e yalnızca Stage 2 açık onayından sonra geçilir.** Şimdi **herhangi bir renk, font, grid, tasarım bileşeni, animasyon kararı ya da uygulama kodu yok**.
