# Postify — Aşama 4 / Typography System Alternatifleri

**Tarih:** 2026-10-17
**Durum:** Üç kombinasyon karşılaştırıldı; **TYPE-02 Expressive Issue AŞAMA 4 KULLANICI TARAFINDAN ONAYLANDI** (CD-004).
**Onaylı öncüller:** CD-001 A+B yaratıcı strateji; CD-002 MOOD-02 ana editoryal / MOOD-01 bilgi disiplini; CD-003 **PL-01 Oxide & Newsprint** light/dark çekirdek renkler.
**Kesin sınır:** Bu belgede geçen font aileleri, font size/scale, line-height, letter spacing, font-display politikası, veya font dosyası **henüz onaylı değildir**. CSS, JSX, kullanıcı etkileşimleri, canlı site, diğer repo ve GitHub değişmedi. Aşama 5 Grid & Spacing, kullanıcı Aşama 4 kararını açıkça verene kadar başlamaz.

## 1. Hedef ve okuma kriterleri

**Postify aynı anda iki ayrı deneyimi taşır:**
1. Bağımsız dijital teknoloji yayını: İlk bakışta özgün ve güven veren editoryal başlık; duyarlı, dengeli vurgular.
2. Uygulanabilir rehber: TR ve EN'de uzun okuma, teknik terim, kod parçaları, tarih, kanıt/güncellik statüleri ve formların anlaşılır görünmesi.

Ana metin ve küçük meta içerik **görsel estetik uğruna küçültülmemeli**. Mevcut audit 8–12px metadata riskini saptadı. Tipografi görsel hiyerarşi ile araç kullanılabilirliğini dengeler.

### Değerlendirme ölçütleri
- TR: `İ ı Ğ ğ Ş ş Ç ç Ö ö Ü ü`, uzun Türkçe kelimeler, kesme işaretleri; EN heading/body tutarlılığı.
- Display serif büyük başlıkta; sans uzun UI/body ve formlarda; mono kaynak/tarih/komut/kod etiketlerinde ama 12px altına inmeyen erişilebilir görüntü.
- Longform article: 16–19px gövde başlangıcı, ~1.65–1.8 line-height, paragraflar arasında ritim. **Bunlar test başlangıç değerleri, onaylı ölçü değil.**
- Teknik kodlar ayrı mono ve gerektiğinde yatay kaydırılabilir, gizlenen satır/okunamayan karakter olmamalı.
- 200% zoom, mobil 320–390px, tablet, masaüstü ve dark mode için gerçek içerikle reflow/focus.
- Performans: gerekli font stilleri/subsetleri, font-display swap/optional değerlendirmesi, WOFF2 tercihleri, doğru fallback metrics, CLS/FCP/LCP ölçümü. Harici CDN'e bağlı üretim fontu kararı verilmedi.

## 2. Karşılaştırmalı font eşleşmeleri — ÜÇÜ DE ONAYSIZ

| Aday | Editoryal başlık/serif | Gövde + UI sans | Kaynak/kod mono | Hissiyat |
| --- | --- | --- | --- | --- |
| **TYPE-01 Quiet Authority** | Newsreader | DM Sans | IBM Plex Mono | Modern, sakin ama karakterli yayın |
| **TYPE-02 Expressive Issue** | Fraunces | Inter | IBM Plex Mono | Daha çarpıcı, grafik ve cesur dergi |
| **TYPE-03 Evidence Library** | Literata | IBM Plex Sans | IBM Plex Mono | Metodik, akademik ve teknik otorite |

### TYPE-01 — Quiet Authority
**Serif:** **Newsreader** — dijital uzun okuma için tasarlanmış özgün serif; değişken weight + optical size.
**Sans:** **DM Sans** — çağdaş, düşük kontrastlı geometrik sans; UI/kısa paragraflarda açık.
**Mono:** **IBM Plex Mono** — teknik kod, timestamp, citation/label.

**Güçlü:** MOOD-02 karakteri, MOOD-01 okunabilirliği ve PL-01 sıcak paper tonları dengeli. Başlık modern, zamansız; yazı metninin önüne geçmez.
**Risk:** Newsreader aşırı hafif weight'te zarif ama zayıf kalabilir; font yüklenmezse fallback başlık satır sayısı değişebilir. Üç aile de dikkatli subset/weight seçim ister.
**Tasarım deney varsayımı:** Heading 500; UI 400/600; mono 400/500, longform body 16–18. Font scale ve grid sonraki onayla belirlenir.
**Kullanım:** Home H1/featured, uzun makale, auth/filtre ve kanıt başlıkları.

### TYPE-02 — Expressive Issue
**Serif:** **Fraunces** — vintage Old Style karakteri ile modern variable özellikler; softness ve wonky axes, **aşırı kullanım önerilmiyor**.
**Sans:** **Inter** — bilgi yoğun arayüzlerde tanıdık ve işlevsel; UI güçlü.
**Mono:** **IBM Plex Mono**.

**Güçlü:** Daha sıra dışı makale kapağı ve Awwwards hedefinde yüksek görsel ifade potansiyeli.
**Risk:** Fraunces “wonky/soft” aşırı olursa retro/oyuncu tasarım Postify'ın gerçek kanıt/mühendislik ciddiyetini zayıflatır. Kullanıcı kendi içeriğini yazarken dikkat dağıtabilir.
**Deney koşulu:** Fraunces normal/orta weight, düşük softness ve kontrollü aksları; gösterişli alternates sadece uygun display başlıklarda. Inter metin/giriş formlarında işlevi korur.

### TYPE-03 — Evidence Library
**Serif:** **Literata** — uzun okumaya uygun, opsz destekli; dergi ile teknik referans arasında.
**Sans:** **IBM Plex Sans** — teknoloji yayınında sistematik fakat insani grotestik yazı karakteri.
**Mono:** **IBM Plex Mono**.

**Güçlü:** En bütünlüklü teknik/metodik dil; aynı ailede sans/mono dengesi, kaynak ve kod yoğunluğu, kapsamlı karakter desteği.
**Risk:** Dergi karakterinden fazla kurumsal araştırma arşivine kayabilir; bağımsız editoryal imza TYPE-01'e göre daha az ayırt edici olabilir.

## 3. Gerçek kaynaklar, lisans ve dil

| Font | Doğrulanan kaynak | Lisans / durum |
| --- | --- | --- |
| Newsreader | https://github.com/productiontype/Newsreader | SIL OFL 1.1, değişken serif, Google Fonts Latin Plus (TR için Latin extended) |
| DM Sans | https://github.com/googlefonts/dm-fonts | SIL OFL, Latin Extended, modern variable family (geliştirici deposu 2026'da arşivlenmiş; dağıtım sürümlerini doğrula) |
| Fraunces | https://github.com/undercasetype/Fraunces | SIL OFL 1.1, variable wght/opsz/SOFT/WONK; Latin Extended / Türkçe karakterleri |
| Inter | https://rsms.me/inter/ | Open source OFL, UI/Latin extended; font seçimi durumunda dağıtım sürümü tekrar doğrulanacak |
| Literata | https://github.com/googlefonts/literata | SIL OFL 1.1, literate screen reading; proje deposu 2026'da arşivlenmiş (lisans geçerliliğini değiştirmez) |
| IBM Plex Sans & Mono | https://github.com/IBM/plex ve https://www.ibm.com/design/language/typography/typeface/ | SIL OFL, extended Latin dahil çok dilli kapsam, kurumsal tasarım kaynağı |

**Önemli:** TR glyph kapsaması kod noktalarının dağıtılan final subset/WOFF2 dosyasında olup olmadığına da bağlıdır. Kaynak ailesinin Latin Extended desteği tek başına son build'in doğru fontu yüklediğini garanti etmez.

## 4. Gerçek tarayıcıda statik tipografi karşılaştırması

Oracle Chromium ile **font aileleri gerçekten yüklenmiş** ve **1100×920 desktop ile 390×920 mobile** boyutlarında üç aynı metinli specimen render edildi. Tarayıcıdaki FontFaceSet, Newsreader/DM Sans/Fraunces/Inter/Literata/IBM Plex Sans/IBM Plex Mono'nun ilgili specimen'de loaded durumuna geçtiğini gösterdi. **6/6 görüntüde sayfa genişliğinde yatay taşma veya JS pageerror yoktu.** Bu sonuçlar canlı Postify'a uygulanmış fontların testi değildir; sayfa ve konum, örnek karşılaştırma için sabitlenmiş bir tipografi eskizidir.

Kanıtlar Oracle VM'de (repository dışında):
- `/home/ubuntu/.oracle-dev/visual/postify-stage4/TYPE-01-{1100,390}.png`
- `/home/ubuntu/.oracle-dev/visual/postify-stage4/TYPE-02-{1100,390}.png`
- `/home/ubuntu/.oracle-dev/visual/postify-stage4/TYPE-03-{1100,390}.png`
- `/home/ubuntu/.oracle-dev/visual/postify-stage4/stage4-type-comparison.jpg`
- `/home/ubuntu/.oracle-dev/visual/postify-stage4/typography-metrics.json`

**Görsel kaynak açıklaması:** Aynı PL-01 ana renkleri, aynı örnek editoryal yazı düzeni, örnek İngilizce ve Türkçe başlık/copy/mono kod parçası kullanıldı. “Bilgi yalnızca okunmaz. Kullanılır.” örnek başlığı ve English sample başlığı, marka sloganı olarak onaylanmadı. Kompozisyon, spacing ve font büyüklükleri de onaylanmış site kararı değildir. Açık lisanslı font dosyaları araştırma için tarayıcı tarafından çekildi; hiçbir font dosyası repository'ye commit edilmedi veya kullanıcıya gönderilmedi.

## 5. Seçim matrisi — öneri, karar değil

| Karakter/kriter | TYPE-01 | TYPE-02 | TYPE-03 |
| --- | --- | --- | --- |
| Modern ve karakterli bağımsız yayın | **Çok güçlü** | Çok güçlü fakat daha gösterişli | Güçlü |
| Uzun teknik makale ve okunabilirlik | **Çok güçlü** | Güçlü, UI ayrı | **Çok güçlü** |
| Kanıt/metadata + kod uyumu | Güçlü | Güçlü | **Çok güçlü** |
| TR/EN ve diakritik desteği (aile seviyesinde) | Güçlü | Güçlü | Güçlü |
| Jenerik teknoloji SaaS riski | Düşük | Orta (Inter arayüzü) | Düşük |
| Fazla dikkat çekme/klişeleşme riski | Düşük | **Orta-yüksek** | Düşük |
| Son build'de subset/loading işçiliği | Orta | Orta-yüksek (variable axes) | Orta |

**Tasarım yönetmeni önerim:** **TYPE-01 Quiet Authority**. PL-01'e, MOOD-02 bağımsız editoryal kimliğe ve MOOD-01 bilgi güvenine en dengeli eşleşme. Bu, kullanıcı onayı DEĞİLDİR; TYPE-02/TYPE-03 seçenekleri açık.

## 6. Sonraki karar ve sınır

Kullanıcıdan **TYPE-01 / TYPE-02 / TYPE-03** veya açıkça tarif ettiği font karma eşleşmesini seçmesi/tercihi asistana devretmesi istenecek. Onay gelince font aileleri ve kullanım mantığı `DESIGN-DECISIONS.md` ve `DESIGN-SYSTEM.md` içinde **ONAYLI** yapılacak; hemen kod yazılmayacak. Ondan sonra **yalnızca Aşama 5 Grid, Layout & Spacing** alternatifleri açılabilir. Font yüzleri, lisans dosyaları ve final ölçümler ileriki uygulama aşamasında performans/reflow testleriyle tekrar kontrol edilecek.


## 7. Sonradan gelen açık kullanıcı onayı — CD-004
2026-10-17 kullanıcı TYPE-02 Expressive Issue seçimini açıkça onayladı: **Fraunces + Inter + IBM Plex Mono**. TYPE-01 / TYPE-03 referans olarak arşivlendi. Yukarıdaki önceki “ONAYSIZ” ifadeleri tarihsel teklif durumunu gösterir ve bu son onay tarafından geçersiz kılınır. Font aileleri ve rolleri [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) bölüm 2'de onaylıdır. **Boyut, spacing, grid, motion, axis detayları, font paketleme ve uygulama kodu henüz onaylanmadı/değiştirilmedi**.
