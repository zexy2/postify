# Postify — Aşama 6 / Component Design System Karşılaştırması

**Tarih:** 2026-10-17
**Durum:** **C-01 / C-02 / C-03 bileşen tasarım alternatifleri hazır; kullanıcı Aşama 6 onayı BEKLENİYOR.**
**Onaylı önceki kararlar:**
- CD-001 A+B yaşayan saha rehberi + bağımsız dijital dergi.
- CD-002 MOOD-02 ana editoryal ifade + MOOD-01 kanıt, okunabilirlik ve kullanılabilirlik; MOOD-03 sadece içerikle gerekçelendirilen teknik görseller.
- CD-003 **PL-01 Oxide & Newsprint** light/dark marka renkleri.
- CD-004 **TYPE-02 Fraunces (display), Inter (UI/body), IBM Plex Mono (meta/code)** font aileleri/rolleri.
- CD-005 **G-01 Editorial Spine** site genelinde; **G-02** yalnızca öne çıkan editoryal yayın dosyalarında sınırlı kompozisyon istisnası.

**Çalışma sınırı:** Bu dosyada **hiçbir kart formu, bileşen görünümü, button varyantı, doğrulama rozeti stili, durum rengi, shadow, border, animasyon veya etkileşim kararı kullanıcı tarafından onaylanmış sayılmaz.** Uygulama `src/` CSS/JS ve gerçek kullanıcı verileri **değişmedi**. Aşama 7 Homepage Design, Aşama 6 açık kullanıcı onayı olmadan başlamaz.

## 1. Ürün için gerçek bileşen ihtiyaçları

Mevcut `src/components/` ve sayfa stillerindeki çalışan bileşenlerin işlevleri korunacak, yerine sahte UI yerleştirilmeyecek:

| Bileşen ailesi | Mevcut envanter / kontrat | Tasarımın çözmesi gereken sorun |
| --- | --- | --- |
| Publishing chrome | `Header`, `BrandMark`, `CategoryNav`, `LanguageSwitcher`, `Footer`, `CommandPalette` | Dergi karakteri ile mobil keşif/klavye navigasyonunu birleştirmek; hamburger görünürlüğü, açık/kapalı/active/focus |
| Knowledge cards | `KnowledgeCard` featured/standard/compact; `EditorialFeed`, `Hero` | Bir makalenin bilgi türü, bağlamı, sonuç, okunma süresi, güncellik ve kaynak ayrımını okunabilir hale getirmek; featured/feed tekrarını önlemek |
| Evidence & trust | `EvidenceBadge`, `KnowledgeEvidencePanel`, `LocalEvidenceActions`, `CommunityEvidenceDetails`, `VerificationRunbook`, `CorrectionSuggestionPanel` | **Postify verified**, yazar beyanı, stale/re-check ve unknown durumlarını yanlış kesinliğe düşmeden açıkça ayırt etmek |
| Navigation & actions | Link, CTA, bookmark toggle, copy/share, filter, load-more, safe destructive confirm | Primary/secondary/ghost/text; active/busy/disabled/hover/focus, klavye semantiği |
| Data entry | Auth login/register/recovery, Create/Edit Tiptap, account/profile forms | Label, helper, invalid/error, success, pending, autosave/dirty, image upload progress, safe submission |
| System states | `SystemStatus`, `ErrorBoundary`, empty bookmark/feed, skeleton/loading, service fallback, toast | Boş/yükleniyor/bağlantı yok/hata durumunda açıklayıcı başlık, alternatif eylem ve doğru ARIA live kullanımı |
| High-density workbench | Admin users/posts, Knowledge health, verification/correction queue | Semantik tablo, klavye ile yatay kaydırma, durum etiketleri, danger actions; ürün genelini SaaS paneline çevirmemek |

**İçerik kaynağı güvenlik kuralı:** Bir card/rozet makaleyi `Postify verified` diye gösteremez; yalnızca mevcut evidence/autoVerification durum makinesi bu kararı verebilir. `data-level`, `data-freshness` ve gerçek sunucu kanıtı korunur. “Unknown” bir başarısızlık veya doğrulanma iddiası değildir. Örnek prototiplerdeki değerler **uydurulmuş UI yer tutucularıdır**, gerçek kanıt değildir.

## 2. Üç görsel bileşen dili — HEPSİ ONAYSIZ

### C-01 — Editorial Grammar / Editoryal Gramer

**Metafor:** Basılı yayının kenar çizgisi, metin, boşluk, alt çizgi ve güvenilir metadata. Bileşenler bir derginin doğal dizgisi gibi davranır; kutular sadece semantik açıklık gerekiyorsa vardır.

**Örnek karar taslağı (kesinleşmedi):**
- **KnowledgeCard:** Dolgusuz kâğıt yüzey, net üst/bölüm ayırıcı çizgiler, ölçülü serif başlık, Inter outcome, IBM Plex Mono kaynak/tarih. Featured daha geniş ve farklı kompozisyon alabilir, standart kart metinsel olarak sakin.
- **Evidence:** İnce kural/ayraç ve 3 parçalı gerçek kaynak/doğrulama/güncellik satırı. Bütün rozetler metin + uygun ikonla desteklenir; gösterişli stamp yok.
- **Buttons/links:** Belirgin marka aksanı sadece gerçek birincil eylemde; secondary outline, metin linki altı çizgili, focus görünür.
- **Forms:** Sol hizalı etiket, yüksek kontrast input, okunaklı validasyon; form gerekirse kompozisyondan önce gelir.
- **Empty/error/loading:** Geniş reklam kutuları değil, tipografik durum başlığı + açıklayıcı alternatif + role=status/alert.
- **Mobile:** Kartlar tek sütun, kanıt alanları akış içinde, 44px civarı temel hit area (taslak hedef), yatay taşma yok.

**Artı:** CD-005 G-01 düzen sistemine ve MOOD-01 evidence disiplinine doğal uyum; uzun okuma, sakin meta ayrımı; tüm 17 sayfaya kolay ölçekleme.
**Eksi/risk:** Yalnızca çizgi ve metin kullanımı aşırı yayılırsa kartların içerik önceliği silikleşir, editoryal etki monotonlaşır.

### C-02 — Inked Folio / Baskı Dosyası

**Metafor:** Issue cover, yoğun mürekkep blokları, sayı numaraları ve belirgin basılı dosya çerçeveleri. Yayın karakteri güçlü ve özellikle kapak/featured içeriklerde ayırt edici.

**Örnek karar taslağı:**
- **KnowledgeCard:** Daha belirgin kâğıt çerçevesi, grafik bölüm bandı, önemli makalelerde büyük indeks ve kapak alanı. Onaylı G-02 istisnası sadece gerçekten featured dosyalarda kullanılır.
- **Evidence:** Kutu içine alınmış provenance bilgileri ama asla “verified stamp”i gerçekten kanıtlı olmayan içerikte kullanma.
- **Buttons/forms:** Tok dikdörtgen aksiyonlar; secondary kalın outline; form aynı ruhu taşırken label/helper işlevi kaybolmaz.
- **Navigation:** Basılı dergi masthead estetiği, masaüstünde güçlü yatay ayraç; mobil menü görünür.
- **States:** Kırmızı/turuncu her uyarının tek işareti olmaz; mesaj ve action görünür.

**Artı:** En güçlü bağımsız yayın kimliği ve akılda kalıcı featured imza, Fraunces ile uyum.
**Eksi/risk:** Çok fazla framed card ve kiremit blok sayfa gürültüsünü artırabilir; auth, admin ve knowledge paneline zorlandığında kullanılabilirliği azaltır. Kullanılan ek yüzey/çizgi görsel performans ve bakım maliyeti getirir.

### C-03 — Research Instruments / Araştırma Araçları

**Metafor:** Titiz kaynak kayıtları, dokümantasyon ekranı, ayrıştırılmış veri hücreleri; iddia/kanıt/ortam/tarih durumlarını küçük kontrollü panellerde düzenler.

**Örnek karar taslağı:**
- **KnowledgeCard:** Kenarlıklı bilgi panelleri, daha sık metadata ve teknik indeks.
- **Evidence:** Kaynak/doğrulama/güncellik ayrı hücreler, taranabilir tablolar; verinin gerçekten var olmasına bağlı.
- **Buttons/forms:** Nötr çalışma araçları; filtre ve form doğrulama alanları net sınırlar taşır.
- **States:** Sistem loading/error/unknown çevresinde güçlü durum grameri; semantik ve erişilebilir olmak zorunda.
- **Mobile:** Tablo/kanıt hücreleri alt alta yerleşir; veri kaybolmaz, dikey büyüme kontrol edilir.

**Artı:** Editör, admin, evidence ve knowledge health iş akışlarında en yüksek yapısal netlik.
**Eksi/risk:** Bütün ana sayfa kartlarına uygulanırsa ürün jenerik SaaS/dashboard'a dönüşebilir; fazla çerçeve ve metadata uzun okuma hissini öldürebilir.

## 3. Aynı sistem, çoklu durum — tasarım/erişilebilirlik denetim matrisi

Her üç önerinin kabulü için **tüm ilgili bileşenlerde** aşağıdaki durumlar ayrı doğrulanmalıdır. Farklar renk/ikon kadar metin ve ekran okuyucu anlamını da kapsar.

| Bileşen | Durumlar | Korunması gereken davranış ve kriter |
| --- | --- | --- |
| Links / buttons | default, hover, active, focus-visible, disabled, loading | 44px hedef hit-area (yerleşim kılavuzu; WCAG eşikleri yerine geçmez), klavye fokus halkası, yalnızca renk ile active bilgisi verme, disabled nedeni görünür |
| Knowledge card | featured, standard, compact, hover, saved, unknown, stale, no image | Gerçek href, slugs, headline-level, type/outcome/read time, evidence badge, empty/source fallback ve responsive reflow |
| Search and filters | collapsed, expanded, applied, zero result, keyboard shortcuts, reset | Focus kaybı yok, filtre silme/geri dönüş, ekran okuyucu güncellemeleri, hızlı erişim |
| Auth and editor fields | idle, helper, invalid, submitting, success, draft-dirty, autosaving, failed | Doğru label, aria-invalid/aria-describedby, status announcements, submit lock, veri kaybı yok |
| Evidence | independent verified, author claim, current/stale, recheck-required, freshness unknown | Yanıltıcı veri/renk yok; `getEvidenceCopy`/`useAutoVerification` iş kuralları korunur |
| Confirmation/dialog | open/close, escape, destructive, focus restore | Dialog focus trap, accessible title, niyet net, güvenli iptal |
| Loading / error / empty | loading, empty, offline fallback, delayed, fatal | Spinner değil açıklayıcı metin, retry veya geri dönüş, aria-live uygun seviye; rezerv alan CLS önlemi |
| Admin/knowledge tables | populated, empty, overflow, keyboard focus, permission denied | Tabloda gerçek semantik; mobil yatay scroll bölgesinde kimlik sütunu/legend; hassas işlem yalnızca yetkili akışta |

### Renk onay sınırı
Açık `#F4EFE6` ve `#FDFBF6` yüzey, koyu `#1F2420`, ikincil `#4F5A53`, interaktif `#A13826` ile başlandı. **Warning/error/success/info, border-hover/focus ring ve disabled renkleri henüz CD-003 kapsamında onaylı semantik tokenlar değildir.** Bu aşamanın görsel prototipi kritik hata durumlarında yalnızca **geçici, açıkça etiketli** brand vurgu ve metin gösterir. Semantik renk sistemi gerekirse uygulama öncesinde açıkça ayrıca onaylanacak; yeni renk kararını sessizce almamak gerekir.

### Hareket onay sınırı
Kart hover, button transition, toast motion, drawer reveal, responsive scroll ve loading indikatörünün animasyon süreleri **Aşama 9** kapsamıdır. Aşama 6'da yalnızca görsel hiyerarşi ve görünür etkileşim state'leri ele alınmıştır. `prefers-reduced-motion` korunur; otomatik hareket uygulanmaz.

## 4. Gerçek Chromium'da referans specimen denemesi

**Kodu etkilemeyen süreç:** Postify `src/` içine hiçbir JSX, CSS, font, asset eklenmeden Oracle sunucusunda `/home/ubuntu/.oracle-dev/visual/postify-stage6/component-specimens.cjs` ile **3 bağımsız statik HTML prototip** üretildi.

**Prototip içerik aileleri:** Navigasyon, hero/featured, standard list cards, kaynak/doğrulama açıklaması, primary/secondary/disabled action, arama ve geçersiz e-posta, loading/empty/error örnekleri. Türkçe örnek yazı başlıkları ve kaynak değerleri **gerçek Postify makalesi değildir**; verified statüsü uydurulmadı ve örnekler açıkça etiketlendi.

**Görünüm kapsamı:** Chromium CDP/Playwright, 1440, 768, 390, 320px; **3 × 4 = 12** static specimen render. Tarayıcıda `Fraunces` ve ilgili diğer font yüzleri yüklendi. **12/12 örnekte** horizontal overflow ve pageerror yakalanmadı; görünür düğme örnekleri en az 44px yüksekliğindeydi. Örnek inputlar label taşıyor. Mobil menü tetikleyicisi görsel prototip olarak eklenmiş olup gerçek responsive nav işlevi **bu aşamada test edilmedi**. Bunlar **üretim uygulaması veya gerçek yetkilendirilmiş kullanıcı etkileşim testleri değildir**; tam WCAG 2.2 AA sertifikası olarak sunulamaz.

**Oracle üzerinde saklanan çıktı:**
- `/home/ubuntu/.oracle-dev/visual/postify-stage6/C-0{1,2,3}.html` — üç bağımsız yerel UI specimen'i.
- `/home/ubuntu/.oracle-dev/visual/postify-stage6/C-0{1,2,3}-{1440,768,390,320}.png` — 12 Chromium görüntüsü.
- `/home/ubuntu/.oracle-dev/visual/postify-stage6/component-{desktop,mobile}-comparison.jpg` — boyutlandırılmış karşılaştırma kolajı (ilk derleme; yeni mobile menü örneği HTML'de ek olarak mevcut).
- `/home/ubuntu/.oracle-dev/visual/postify-stage6/component-state-matrix.json` — ölçümlerin ve gözlemlerin kayıtları.
- Repo `design/component-system-reference.svg` — yalnızca stil dilinin vektörel araştırma özeti; uygulama asset'i değildir.

**Bilinçli sınırlama:** Gerçek i18n string, kod kopyalama, bookmark toggling, Supabase auth, keyboard menu, form submit, doğrulama servisleri ve admin rol değişimi **çalışan app davranışı olarak sınanmadı**. Devamındaki implementation + E2E aşamaları gerektirir.

## 5. Karşılaştırma

| Ölçüt | C-01 Editorial Grammar | C-02 Inked Folio | C-03 Research Instruments |
| --- | --- | --- | --- |
| G-01 bütün siteye uygulanabilirlik | **Çok yüksek** | Orta | Orta-yüksek |
| G-02 özel editoryal kapak | Yüksek | **Çok yüksek** | Düşük |
| MOOD-01 kanıt/güncellik açıklığı | **Çok yüksek** | Orta-yüksek | **Çok yüksek** |
| Bağımsız premium yayın karakteri | **Yüksek** | **Çok yüksek** | Orta |
| Login/editor/admin boş ve hata durumları | **Yüksek** | Orta | Yüksek, ama panel yoğunluğu artabilir |
| Gereksiz UI çerçevesi riski | **En düşük** | **Yüksek** | **En yüksek** |
| Uygulama ve bakım karmaşıklığı | Düşük-orta | Orta-yüksek | Orta |

**Öneri (ONAY DEĞİL):** **C-01 Editorial Grammar** bütün sitede ortak bileşen dili olarak, **C-02 Inked Folio** sadece CD-005'te izin verilen featured dosyalarda tanımlı istisna olarak, **C-03 Research Instruments** sadece evidence/admin/knowledge yoğunluğunun zorunlu olduğu yerlerde kontrollü küçük işlevsel paneller olarak değerlendirilebilir. Bu kompozit yaklaşım otomatik kullanıcı onayı anlamına gelmez; kullanıcı C-01/02/03 veya sınırları açık hibriti seçmelidir.

## 6. Stage 6 kullanıcı karar kapısı

Kullanıcı **C-01 / C-02 / C-03 / belirlenmiş hibrit** seçeneklerinden birini onaylamalı. Bu kararda seçilen kart/navigasyon/kanıt/form/durum grameri `DESIGN-DECISIONS.md` ve `DESIGN-SYSTEM.md` içine açıkça işlenir. **Aşama 7 Homepage Design** ancak Aşama 6 kullanıcı onayından sonra başlar. Tasarım sisteminin bu aşamada seçilmesi bile JSX/CSS kodlama izni değildir. Aşama 9 hareket ve Aşama 10 responsive/a11y testleri ayrıca onay kapılarıdır.
