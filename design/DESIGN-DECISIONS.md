# Postify — Design Decision Ledger

**Aktif protokol:** Kullanıcı talebi, 2026-10-17.
**Aktif aşama:** 0 / Current Product Audit — rapor hazır, **onay bekleniyor**.
**Sonraki aşama:** 1 / Brand Personality & Creative Strategy — **başlanmadı**.

## Süreç kararları — kullanıcı açık talimatı
| Kayıt | Karar | Durum | Kapsam |
| --- | --- | --- | --- |
| PROCESS-001 | 0–11 sıralı tasarım aşaması ve her aşama sonunda açık kullanıcı onayı | **Kullanıcı tarafından belirlenmiş kural** | Tüm gelecekteki çalışmalar |
| PROCESS-002 | İlk turda yalnızca audit; uygulama koduna dokunma; tasarım alternatiflerini erkenden seçme | **Kullanıcı tarafından belirlenmiş kural** | Aşama 0 |
| PROCESS-003 | `design/` altındaki altı belge kalıcı hafıza; sürüm kontrollü | **Kullanıcı tarafından belirlenmiş kural** | Tüm aşamalar |
| PROCESS-004 | Ayrı Git branch/worktree, test ve görsel QA, mevcut akış/SEO/auth koruma | **Kullanıcı tarafından belirlenmiş kural** | Uygulamaya geçilen aşamalar |

## Mevcut tasarım ile onaylı kararın ayrımı
| Referans | Gözlemlenen mevcut durum | Kullanıcı onayı | Politika |
| --- | --- | --- | --- |
| `ec6e368` | Ana sayfa editoryal kapak, tema ve bazı ortak CSS iyileştirmeleri | **Yeni protokol kapsamında verilmedi** | Korunan mevcut Git çalışma durumu; onaylı brand direction sayılamaz |
| `30a5a12` | Auth, admin tablosu, bookmarks boş durumu, knowledge panel CSS/UX | **Yeni protokol kapsamında verilmedi** | Korunan mevcut Git çalışma durumu; nihai sistem onayı sayılamaz |
| Eski `project/premium-editorial-design-system.md` | Önceki çalışma dönemi tasarım notu | **Yeni protokole göre yeniden değerlendirilmesi gerekli** | `design/DESIGN-SYSTEM.md` içinde onaysız audit baseline; yeni seçim yapılmadı |

## Tasarım onay kayıtları
| Aşama | Status | Önerilen seçenekler | Kullanıcının seçimi | Tarih |
| --- | --- | --- | --- | --- |
| 0 Current Product Audit | **Onay bekliyor** | Denetim raporu | Henüz yok | 2026-10-17 |
| 1 Brand Personality & Creative Strategy | Başlanmadı | Henüz yok | — | — |
| 2 Reference Research & Moodboards | Başlanmadı | Henüz yok | — | — |
| 3 Color System | Başlanmadı | Henüz yok | — | — |
| 4 Typography System | Başlanmadı | Henüz yok | — | — |
| 5 Grid, Layout & Spacing | Başlanmadı | Henüz yok | — | — |
| 6 Component Design System | Başlanmadı | Henüz yok | — | — |
| 7 Homepage Design | Başlanmadı | Henüz yok | — | — |
| 8 Inner Pages & Editorial Experience | Başlanmadı | Henüz yok | — | — |
| 9 Motion & Interaction Design | Başlanmadı | Henüz yok | — | — |
| 10 Responsive & Accessibility | Başlanmadı | Henüz yok | — | — |
| 11 Final QA & Visual Polish | Başlanmadı | Henüz yok | — | — |

## Stage 0 değişiklik defteri
2026-10-17 — `design/` raporları yazıldı. **Uygulama, component, CSS, route, service, test ve build artifact kodu değişmedi.** Aşama 1'e geçilmedi. Git commit yalnızca doküman dosyalarını içermelidir; push/deploy yok.

## Gelecek onay değişikliği formatı
Her görsel karar için ID, aşama, alternatifler, önizleme referansı, gerekçe, artı/eksi, etkilenen sayfalar, erişilebilirlik/performans etkisi, kullanıcıdan gelen açık onay metni/tarihi, ilgili commit ve gerekirse geri alma notu yazılır. **Cevap verilmemesi onay sayılmaz.**
