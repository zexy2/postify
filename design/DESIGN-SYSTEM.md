# Postify — Design System Approval Registry

**Durum: KISMEN ONAYLI — Aşama 3 PL-01 renkleri ve Aşama 4 TYPE-02 font aileleri ONAYLI; grid, component, motion ve ölçekler ONAYSIZ.**
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
Durum: **alternatif araştırması aktif, onay bekleniyor.** Columns, measure, gutters, baseline rhythm, responsive rules henüz onaysız.

### Aşama 6: Components
Durum: bekliyor. Buttons, cards, forms, nav, status components, interaction states onaysız.

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
