# Postify — Design System Approval Registry

**Durum: HENÜZ ONAYLANMIŞ DESIGN SYSTEM YOK.**
Bu sayfada yalnızca **mevcut koddan tespit edilmiş** değerlerin audit envanteri bulunur; bunlar yeni tasarım için bağlayıcı değildir.

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
Durum: **PL-01 / PL-02 / PL-03 sunuldu, onay bekliyor.** Light/dark hex değerleri, önerilen semantic durum renkleri ve WCAG kontrast ölçümleri [COLOR-SYSTEM-OPTIONS.md](./COLOR-SYSTEM-OPTIONS.md) dosyasında. Renk örnekleri [color-palette-reference.svg](./color-palette-reference.svg) dosyasında. **Henüz seçilmiş palet yok.**

### Aşama 4: Typography
Durum: bekliyor. Font families, lisans, variable font/performance, scale, editorial body ölçüleri ve dil desteği onaysız.

### Aşama 5: Grid & spacing
Durum: bekliyor. Columns, measure, gutters, baseline rhythm, responsive rules onaysız.

### Aşama 6: Components
Durum: bekliyor. Buttons, cards, forms, nav, status components, interaction states onaysız.

### Aşama 9: Motion
Durum: bekliyor. Damping/curves/transitions/reduced-motion onaysız.

**Kural:** `DESIGN-DECISIONS.md` içindeki kullanıcı onayı olmadan bu bölümlere “approved” değeri girme ve kodu değiştirme.
