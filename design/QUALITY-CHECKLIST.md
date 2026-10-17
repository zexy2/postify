# Postify — Quality Checklist & Gates

**Aktif aşama: 3 — renk sistemi alternatifleri hazırlanıyor; palet onayı bekleniyor.** Her durumun güven düzeyi belirtilmelidir: **gözlendi** / **kontrol gerekli** / **erişilemedi** / **onaylanmadı**.

## Audit 0 — doğrulanan asgari kanıt
- [x] Doğru GitHub repository ve ayrı worktree, temiz başlangıç HEAD `30a5a12` doğrulandı.
- [x] 17 rota tanımı, 6 protected redirect, 11 public route ayrımı kod ve Chromium ile kontrol edildi.
- [x] 51 route/viewport gözlemi (390/768/1440); bir H1, sıfır gözlemlenen horizontal overflow, sıfır yakalanan pageerror.
- [x] Ekran görüntüleri (Oracle, repo dışında) kaydedildi; canlı site desktop/mobile ayrıca açıldı.
- [x] Geçerli CSS token ve font stack envanteri; **tasarım seçimi yapılmadı**.
- [x] Public img alt ve form input label için basit DOM taraması (örneklemde eksik yok). **Otomatik WCAG garantisi değil**.
- [x] Live mobile tek-run performance sample: home FCP/LCP ~1100ms, article FCP ~428ms/LCP ~728ms. **Alan metriği değil**.
- [x] Önceki iterasyonda kayıtlı `npm run verify` PASS + 55/55 V3 Chromium E2E PASS var; **Aşama 0 içinde build/test tekrar çalıştırılmadı**.
- [x] Aşama 0'da app, routing, API, style, font veya metadata kodu değiştirilmedi.
- [x] Aşama 0 kullanıcının 2026-10-17 tarihli **Onaylıyorum** yanıtıyla onaylandı.
- [x] Aşama 1 için A/B/C stratejileri, avantaj/risk ve kompozisyon eskizleri belgelendi.
- [x] Aşama 1 **A+B hibrit yaratıcı stratejisi** kullanıcı tarafından açıkça onaylandı (2026-10-17).
- [x] Aşama 2: yedi gerçek yayın sitesi, desktop/mobile kaynak taraması ve sınırlamalar belgelendi.
- [x] Aşama 2: MOOD-01/02/03 alternatifleri, ürün uyumu ve riskleri belgelendi.
- [x] Aşama 2 CD-002 kapsamında MOOD-02 ana, MOOD-01 kanıt/UX, MOOD-03 sınırlı teknik kullanımla onaylandı.
- [ ] Aşama 3 renk seçimi henüz onaylanmadı.

## Bilinçli olarak açık kalan kontroller
- [ ] 200%/400% text resizing/reflow: bütün işlevler için yeniden ekran karşılaştırması.
- [ ] WCAG 2.2 AA: gerçek foreground/background kontrast matrisi (normal 4.5:1; büyük metin 3:1), UI component kontrast 3:1, focus indicator 2.4.11 ve 2.4.13 hedef ayrımı; klavye sırası, bypass, status announcements, aria dialog. **Mevcut uygunluk iddia edilmez.**
- [ ] Meta/tarih/kanıt yazıları 8–12px ölçümlerinin gerçek cihaz/dil/kontrast etkisi.
- [ ] Mobil sticky controls ile toast/banner/focus/keyboard çakışmalarının etkileşim testi.
- [ ] VoiceOver/NVDA/TalkBack gerçek yardımcı teknolojilerle manuel okuma denetimi.
- [ ] Türkçe/İngilizce tam copy ve tarih/sayısal yerelleştirme, uzun metinler.
- [ ] True auth login, signup, OAuth callback, recovery, save/delete bookmark, profile upload, create/edit/publish, admin role moderation; staging/test account gerekir.
- [ ] Empty/loading/error/offline/fallback durumlarının tüm sayfalarda görsel ve semantik kontrolü.
- [ ] Gerçek production LCP/CLS/INP, network throttling, CPU/Android/iOS; birden fazla koşum ve p75 gerçek veri.
- [ ] Responsive: 320/360/390/430/768/1024/1280/1440/1920 ve landscape/zoom.
- [ ] SEO/canonical/JSON-LD/hreflang/PWA/SPA redirect regressions — uygulama sonrası.
- [ ] Uygulamaya başlanacaksa görsel before/after onayı, birim/E2E, performance budget ve user approval gates.

## Gelecek aşamalar için çıkış kapısı
1. Her aşama alternatiflerini, gerekçesini, trade-off'unu ve uygun görsel örneklerini sun.
2. Kullanıcının **açık onay metnini** `DESIGN-DECISIONS.md` içine yaz; aksi halde dur.
3. Onaylı tasarım kararını `DESIGN-SYSTEM.md`'ye taşı; uygulama ve test kanıtını ancak ilgili aşamada ekle.
4. Branch'te yalnızca ilgili kontrollü değişiklikleri commit et; hiçbir onay olmadan push/deploy veya sonraki aşamaya geçme.

**Şimdiki sonraki adım:** MOOD-01/02/03 veya açık hibrit seçimi bekle. Aşama 2 kullanıcı onayı olmadan Aşama 3 renk sistemine geçme.
