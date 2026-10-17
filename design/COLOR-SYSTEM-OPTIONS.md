# Postify — Aşama 3 / Color System Alternatives

**Tarih:** 2026-10-17
**Aktif durum:** **PL-01 Oxide & Newsprint kullanıcı delegasyonuyla ONAYLANDI** (CD-003); bu belgenin diğer iki seçeneği tarihsel alternatif olarak korunur.
**Onaylı girdiler:** CD-001 A+B Creative Direction; CD-002 MOOD-02 Independent Issue **ana** + MOOD-01 Evidence-led Editorial **kaynak, güven ve kullanılabilirlik disiplini**; MOOD-03 yalnızca ilgili teknik açıklayıcılarda seçici.
**Kesin sınır:** Bu dosyada listelenen **hiçbir hex, kategori, light/dark yüzey, on-button rengi, semantik token veya dağılım kullanıcı tarafından onaylanmadı**. `src/`, style dosyaları, bileşenler ve canlı site **değiştirilmez**. Bir sonraki Aşama 4 Typography, Aşama 3 onayı olmadan başlatılmaz.

## 0. Önceden var olan renkler / baseline (yeni seçim değil)

Çalışma branch'indeki light temel: background `#F7F5F0`, text `#1D1B18`, accent `#A64628`. Dark temel: `#11100F`, `#F2EEE7`, accent `#F08A67`. Bunlar daha önce yazılmış `src/index.css` tokenlarıdır; yeni protokolde kullanıcı onayı yoktur. Daha önceki `Hero.module.css` ink `#202721` yeni onaylı marka paleti **değildir**. Legacy indigo/glow tokenları mevcut kaynakta karışık durumda. Sadece kullanıcı onayından ve uygulanacak aşamanın izninden sonra uygun migration değerlendirilir.

## 1. Konseptlerin tekil amacı

MOOD-02'nin bağımsız editoryal etkisini korurken MOOD-01'in kaynak/kanıt, okunabilirlik ve erişilebilirlik ihtiyaçları karşılanmalı. Üç palette aynı tip örnek makale, CTA ve bilgi notu düzeninde karşılaştırıldı. **Örnek kart düzeni ve kullanılan serif/sans örnek fontu renk kararının bir parçası değildir**.

| Rol | PL-01 Oxide & Newsprint | PL-02 Evergreen & Brass | PL-03 Ultramarine & Chalk |
| --- | --- | --- | --- |
| Tema karakteri | Sıcak, insanî, baskı yayını hissi | Sessiz otorite, doğal ve kaliteli | Entelektüel, keskin, teknik |
| Light background | `#F4EFE6` | `#F2F2E9` | `#F1F4F6` |
| Light surface | `#FDFBF6` | `#FFFFFF` | `#FCFDFD` |
| Light primary ink | `#1F2420` | `#172D25` | `#18283B` |
| Light secondary text | `#4F5A53` | `#4C6258` | `#4B5B6A` |
| Light link + primary CTA | `#A13826` | `#205642` | `#174D93` |
| Light CTA text | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| Decorative companion (NOT body text) | `#C8B89E` | `#C7B06A` | `#C47E4C` |
| Dark background | `#151B19` | `#0D2019` | `#101D30` |
| Dark raised surface | `#222A26` | `#17352A` | `#1A2B40` |
| Dark primary ink | `#EFEDE5` | `#EDF3E7` | `#F1F5FA` |
| Dark secondary ink | `#B7BCAF` | `#B7C6B7` | `#BECAD6` |
| Dark link + primary CTA | `#F2AC91` | `#C9DEA5` | `#A6CDF2` |
| Dark CTA text | `#151B19` | `#0D2019` | `#101D30` |

### PL-01 — Oxide & Newsprint
**Sanat yönetimi:** Eskitilmiş dergi değil, özenli güncel bir bağımsız yayın. Mürekkebe yakın koyu griler, nötr/sıcak kâğıt, kontrollü mineral-kiremit aksan. Yazıların “gerçek iş” hissi korunur; CTA güncel ve okunur.
**Avantaj:** A+B hibritine doğal uyum, modern ama sıcak editoryal kimlik, mevcut Postify'dan görece küçük geçiş mesafesi.
**Dezavantaj:** Fazla kiremit kullanılırsa her aksiyonun “uyarı” gibi algılanma riski; sıcak tonlarla aynı doygunlukta uyarı/hata kodu ayrımı zorlaşabilir.
**Kullanım sınırı:** Vurgu küçük ve anlamlı alanlarda, doğrulama durumundan tamamen ayrı semantik renkler.

### PL-02 — Evergreen & Brass
**Sanat yönetimi:** Göz yormayan bilimsel bir quarterly / metodoloji odaklı yayın. Koyu yeşil-mürekkep yazı ve soğukkanlı hafif kırık nötr yüzey; altın görsel ayrım noktası, hiçbir zaman aksiyonun tek sinyali değil.
**Avantaj:** Sakin güven, derin okuma ve ağır bilgi; dark mode çok uyumlu.
**Dezavantaj:** Gereksiz çok yeşil kullanımında finans/çevre yayınına dönüşebilir. “Başarılı” semantik durum yeşiliyle marka yeşilinin karışmamasına özellikle dikkat edilmeli.
**Kullanım sınırı:** Gold/pirinç dekoratif; link gibi davranmamalı; başarı semantiğine farklı şekil/etiket şart.

### PL-03 — Ultramarine & Chalk
**Sanat yönetimi:** Serin, analitik, bağımsız teknik fikir dergisi. Mürekkep mavisi, berrak buzumsu kâğıt, kontrollü amber detay; kod ve mimari anlatıya yakın durur.
**Avantaj:** Teknik kimlik, kontrast disiplinine elverişlilik, görsel kod/diagramlarla koordinasyon.
**Dezavantaj:** Fazla mavi ve kart ile jenerik teknoloji SaaS/blog çizgisine kayabilir; mevcut bağımsız yayın karakterinden uzaklaşabilir.
**Kullanım sınırı:** Doygun mavi yalnızca eylem/link; görsel karakteri SaaS panellerinden değil yayın ritminden gelmeli.

## 2. WCAG 2.2 AA aday eşleşme denetimi

**Hesap:** WCAG relative luminance sRGB dönüşümü ve kontrast oranı `(L_light + 0.05)/(L_dark + 0.05)`. Aşağıdaki oranlar gerçek hesapla bulunmuş **yalnızca belirtilen sabit opak foreground/background çiftlerinin** değerleridir; tüm uygulamanın WCAG uygunluğu değildir. Normal metin için minimum **4.5:1**, büyük metin için **3:1**, anlam taşıyan UI/ikon/focus sınırları için çoğunlukla **3:1**. Yerleşim, kod bloğu, border, disabled/focus, opacity, fotoğraf üstü yazılar ayrıca test edilmelidir.

| Seçenek | Light normal metin / paper | Light ikincil metin / paper | Light CTA metni / CTA | Dark normal / dark bg | Dark link / dark bg | Temel çiftler ≥4.5 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| PL-01 | **13.77:1** | **6.28:1** | **6.75:1** | **14.90:1** | **9.22:1** | Evet |
| PL-02 | **12.97:1** | **5.84:1** | **8.50:1** | **15.01:1** | **11.69:1** | Evet |
| PL-03 | **13.53:1** | **6.33:1** | **8.34:1** | **15.46:1** | **10.19:1** | Evet |

Dark button metni için kullanılması önerilen koyu foreground tokenları da dark CTA yüzeyi karşısında sırasıyla **9.22:1**, **11.69:1**, **10.19:1**. Açık kart yüzeylerinde body + secondary metin eşleşmeleri de her üç adayda 4.5:1 üzerindedir.

**Renk asla tek durum göstergesi olmamalı:** Verified/claimed/unknown, “worked/failed”, freshness ve publish-state ayrı metin/ikon/caption ile görünecek. Gerçek doğrulama iddiaları UI renklendirmesiyle uydurulmayacak.

### Renkten bağımsız semantik sistem ADAYI (henüz onaysız)
Kaynak/kanıt statüsünü markanın CTA rengiyle karıştırmamak için **önerilen sabit role renkleri**:
| Durum | Light foreground | Dark foreground | Light örnek kontrast aralığı / 3 palette paper | Dark örnek aralığı |
| --- | --- | --- | --- | --- |
| Success | `#206344` | `#97E0BA` | 6.26–6.49:1 | 11.03–11.38:1 |
| Warning | `#85551D` | `#F2CC82` | 5.53–5.74:1 | 11.07–11.42:1 |
| Error | `#AA2F35` | `#F5A3AA` | 5.79–6.00:1 | 8.63–8.90:1 |
| Info | `#25538D` | `#A9CCF0` | 6.79–7.04:1 | 10.14–10.46:1 |

Bu renkler **yalnızca text/icon örnekleri**; dekoratif veya yüzey/background eşleşmeleri ayrı test edilir. UI border/focus güçlü adayı light `#646A65` (tüm light paper üzerindeki 4.84–5.01), dark `#A8B3AA` (dark bg üzerindeki 7.81–8.06) — ancak focus ring kalınlığı, bitişik yüzeyler ve işaret boyutu ayrıca incelenmeli.

## 3. Uygulamanın bütün ekranlarına göre renk sorumlulukları

| Ürün yüzeyi | Renk sisteminden beklenen (onaysız hedef) |
| --- | --- |
| Home hero / featured | Editoryal ses yüksek fakat arama/CTA üzerinde kontrast tam; gerekirse fotoğraf üzerinde opak katman |
| Article reading | Göz yormayan body/paper, yeterince belirgin link/citation/code, gerçek kanıt etiketleri |
| Categories / filters / navigation | Active, hover ve keyboard focus yalnızca renkle anlaşılmaz |
| Auth / Create/Edit | Field label/helper/error ayrık; CTA renkleri okunur; validation asla sadece renk |
| Bookmarks / Profile | Empty/loaded/error ve bildirimler markadan bağımsız semantik renkli |
| Knowledge health / Admin | Verification/status semantiği marka vurgusundan ayrı; veri anlamı sahte renkle yüklenmez |
| Mobile / dark | Token çiftleri yeniden doğrulanır; sticky bar/toast/iframe ve sistem screenshot reflow testi gerekir |

## 4. Seçim için kriter matrisi (nitel, tasarım hipotezi)
| Kriter | PL-01 | PL-02 | PL-03 |
| --- | --- | --- | --- |
| Bağımsız yayın karakteri | **Çok güçlü** | Güçlü | Orta-güçlü |
| Evidence-led bilgiye sıcak yaklaşım | **Çok güçlü** | Çok güçlü | Güçlü |
| Uzun okuma / sakinlik | Güçlü | **Çok güçlü** | Çok güçlü |
| Teknik sistem hissi | Orta | Orta-güçlü | **Çok güçlü** |
| Jenerik SaaS estetiğine kayma riski | Düşük-orta | Orta | **Orta-yüksek** |
| Mevcut renk sisteminden geçiş çabası | **Daha düşük** | Orta-yüksek | Yüksek |

**İnceleme önerisi (kullanıcı onayı değil):** Postify'ın en yüksek karakter potansiyeli PL-01; PL-02 ciddi alternatif; PL-03 daha soğuk ve teknik bir yön isteyen ekip için. Fakat mevcut sıcak renk sistemini korumak zorunlu değildir ve “daha düşük geçiş maliyeti” seçimin kriterlerinden yalnızca biridir.

## 5. Görsel örnekler ve kalıcılık

**Bu aşamanın sadece renk farkını yansıtan örnekleri:** `postify-stage3-color-comparison.png` ile `postify-stage3-PL-01.png`, `postify-stage3-PL-02.png`, `postify-stage3-PL-03.png` konuşma artifact'leri. Eşleşme ölçüleri ve bire bir HEX renk kodları burada kayıtlıdır; örnek sayfa kompozisyonu ve tipografi **prototip varsayımı** ve nihai tasarım kararı değildir. Kararlar onaylanana kadar üretime hiçbir görsel varlık eklenmez.

Görsellerin konuşma dışında da erişilebilmesi için yalnızca renk swatch ve hex değerlerinden oluşan ve kaynak telifi içermeyen `design/color-palette-reference.svg` repo içine kaydedilebilir. **Bu bir uygulanmış UI değil, onaylanmamış karşılaştırmadır.**

## 6. Açık onay kapısı

Kullanıcıdan **PL-01 / PL-02 / PL-03** veya örnekleri açıkça belirlenmiş **hibrit** seçimini iste; isterse aksan/zemin özel düzeltmeleri konuş. Onay geldikten sonra seçilen palet ve anlamı `DESIGN-DECISIONS.md` + `DESIGN-SYSTEM.md` içine **onaylı** olarak aktarılabilir. Ancak onay gelmeden Aşama 4 Typography başlatılamaz; UI kodu ve canlı site değiştirilmez.

## 7. Renk seçimi — CD-003
2026-10-17 kullanıcı “Sana bıraktım en modern ve profesyonel duranı seç” diyerek seçimi asistanın yapmasına izin verdi. Asistan **PL-01 Oxide & Newsprint** paletini seçti. Çekirdek light/dark renkleri `DESIGN-SYSTEM.md` içinde onaylıdır; genel semantik uyarı/focus/hover ve komponent durumları bu onayla kesinleşmedi. Font, grid ve uygulama kodu değişmedi.
