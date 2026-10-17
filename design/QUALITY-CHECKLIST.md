# Postify — Quality Checklist & Gates

**Aktif aşama: 9 — CD-008 ile INNER-02 ana + INNER-01 sakin okuma seçildi; M-01/M-02/M-03 Motion seçenekleri sunuldu, onay bekleniyor.** Her durumun güven düzeyi belirtilmelidir: **gözlendi** / **kontrol gerekli** / **erişilemedi** / **onaylanmadı**.

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
- [x] PL-01/02/03 light/dark ve temel metin/CTA kombinasyonları için matematiksel kontrast hesapları belgelendi.
- [x] Kaynak CSS değiştirilmeden üç exact-hex renk örneği araştırma SVG dosyasına kaydedildi.
- [x] Aşama 3 PL-01 renk kararı CD-003 ile kullanıcı delegasyonu kapsamında onaylandı.
- [x] Aşama 4 Newsreader/DM Sans, Fraunces/Inter ve Literata/IBM Plex Sans kombinasyonları lisans/okunabilirlik/karakter destekleriyle araştırıldı.
- [x] Oracle Chromium specimen TYPE-01/02/03 1100px/390px TR/EN metin, meta ve kod ile karşılaştırıldı; fontlar loaded, örneklerde taşma ve JS hatası yok.
- [x] Aşama 4 TYPE-02 (Fraunces + Inter + IBM Plex Mono) açık kullanıcı onayı CD-004 ile kaydedildi.
- [x] Aşama 5 G-01/02/03 grid ölçü/spacing adayı ve 17 rota için layout sorumlulukları belgelendi.
- [x] Statik prototipte 3 seçenek × 2 sayfa × 4 viewport = 24 Chromium kontrolünde yatay taşma görülmedi (gerçek site QA değildir).
- [x] Aşama 5 **G-01 ana sistem + G-02 yalnızca seçilmiş editoryal dosyalar** CD-005 kullanıcı onayıyla kaydedildi.
- [x] Aşama 6 mevcut component API/rolleri, protected/empty/loading/error/verification durumları envantere bağlandı.
- [x] Aşama 6 C-01/C-02/C-03 karşılaştırmalı bileşen örnekleri Oracle Chromium'da 1440/768/390/320px (12 statik render) görüldü; taşma/pageerror yok ve görünür buttonlar ≥44px.
- [x] Aşama 6 **C-02 Inked Folio** kullanıcı tarafından CD-006 ile açıkça onaylandı; G-01 genel grid ve G-02 seçici istisnası korundu.
- [x] Aşama 7 H-01/H-02/H-03 ana sayfa kompozisyon ve görev hiyerarşileri karşılaştırıldı; arama, filtre, featured, fallback ve evidence davranışları kaynak düzeyinde koruma envanterine alındı.
- [x] Aşama 7 üç statik homepage prototipi 1440/768/390/320 Chromium ile kontrol edildi: 12/12 yatay taşma/pageerror yok. Gerçek uygulama/ekran okuyucu testi değildir; webfontlar fallback kullandı.
- [x] Aşama 7 Homepage Design **H-01 Issue Front** kullanıcı onayı CD-007 ile kaydedildi.
- [x] Aşama 8 tüm 16 iç rota için makale, yazar, auth, editör, kayıt, knowledge/admin, about/contact/404 ve durumlar tasarım koruma tablosuna alındı.
- [x] Aşama 8 üç iç sayfa yaklaşımı (INNER-01/02/03) makale/auth/editör/yazar × 1440/768/390/320 = **48** bağımsız statik Chromium örneğinde incelendi, gözlenen yatay taşma/pageerror sıfır; gerçek app QA değildir.
- [x] Aşama 8 INNER-02 ana + INNER-01 uzun okuma + sınırlı INNER-03 kullanıcı delegasyonuyla CD-008 olarak kararlaştırıldı.
- [x] Aşama 9 M-01/M-02/M-03 alternatifleri, component/state performans ve reduced-motion sınırları karşılaştırıldı.
- [x] Aşama 9 Chrome bağımsız demo 3×2×2 = 12 farklı viewport/motion tercihiyle test edildi; overflow ve JS pageerror yok, Escape sonrası focus return; reduced-motion transition ~0.01ms. Gerçek app testi değildir.
- [ ] Aşama 9 Motion & Interaction Design henüz kullanıcı tarafından onaylanmadı.

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

**Şimdiki sonraki adım:** Kullanıcının M-01/M-02/M-03 veya açıkça tanımlı hibrit seçimini bekle. Aşama 9 onayı olmadan Aşama 10 Responsive & Accessibility başlatma.
