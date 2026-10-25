import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import EvidenceCover from '../components/EvidenceCover/EvidenceCover';
import SEO from '../components/SEO';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const trustModel = [
    {
      key: '01',
      title: isEn ? 'Outcome first' : 'Önce sonuç',
      text: isEn
        ? 'A useful record should tell you what it helps you accomplish before asking for your attention.'
        : 'Faydalı bir kayıt, senden zaman istemeden önce neyi başarmana yardım edeceğini söylemeli.',
    },
    {
      key: '02',
      title: isEn ? 'Evidence attached' : 'Kanıt yanında',
      text: isEn
        ? 'Test context, verification steps and community results stay close to the claim instead of hiding behind confidence language.'
        : 'Test bağlamı, doğrulama adımları ve topluluk sonuçları iddianın yanında kalır; güven veren süslü ifadelerin arkasına saklanmaz.',
    },
    {
      key: '03',
      title: isEn ? 'Freshness visible' : 'Güncellik görünür',
      text: isEn
        ? 'Dates and runtime context make it possible to see when practical guidance may need another check.'
        : 'Tarih ve çalışma ortamı bağlamı, pratik bir bilginin ne zaman yeniden kontrol edilmesi gerektiğini görünür kılar.',
    },
    {
      key: '04',
      title: isEn ? 'Reproducible by design' : 'Tekrarlanabilir tasarım',
      text: isEn
        ? 'Good guidance leaves enough structure for another reader to try the same path and report what happened.'
        : 'İyi rehberlik, başka bir okuyucunun aynı yolu deneyip sonucunu bildirebilmesi için yeterli yapı bırakır.',
    },
  ];

  const formats = [
    ['guide', isEn ? 'Guide' : 'Rehber', isEn ? 'A concrete path to a result.' : 'Somut bir sonuca giden uygulanabilir yol.'],
    ['decision', isEn ? 'Decision' : 'Karar notu', isEn ? 'Trade-offs and the conditions behind a choice.' : 'Bir seçimin koşulları, ödünleri ve gerekçesi.'],
    ['explainer', isEn ? 'Explainer' : 'Açıklayıcı', isEn ? 'A dense concept made reusable.' : 'Yoğun bir kavramı yeniden kullanılabilir hale getiren anlatı.'],
    ['fieldNote', isEn ? 'Field note' : 'Saha notu', isEn ? 'What actually happened in real work.' : 'Gerçek işte ne olduğunun kısa ve dürüst kaydı.'],
  ];

  return (
    <div className={styles.page}>
      <SEO title={t('about.title')} description={t('about.description')} />
      <div className={styles.container}>
        <header className={`${styles.hero} paper-sheet paper-sheet--bleed`}>
          <div className={styles.heroBody}>
            <div className={styles.heroCopy}>
                            <h1 className="ink-title">{isEn ? 'Useful knowledge should survive contact with reality.' : 'Faydalı bilgi gerçekle karşılaştığında ayakta kalmalı.'}</h1>
              <p>{t('about.description')}</p>
              <a className={styles.heroLink} href="#trust-model-title">
                {isEn ? 'Explore our principles' : 'İlkelerimizi keşfet'} <FiArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </header>

        <section className={styles.statement} aria-labelledby="about-statement-title">
          <div>
            <span className={styles.eyebrow}>{isEn ? 'The job' : 'Asıl iş'}</span>
            <h2 id="about-statement-title">
              {isEn
                ? 'Find what can help, judge whether it fits, then use it.'
                : 'İşe yarayacak bilgiyi bul, sana uyup uymadığını değerlendir, sonra kullan.'}
            </h2>
            <p>
              {isEn
                ? 'Postify is not trying to make another endless content feed. It organizes practical knowledge around the signals that matter when you are about to act.'
                : 'Postify bir sonsuz içerik akışı daha üretmeye çalışmıyor. Pratik bilgiyi, harekete geçmeden önce gerçekten ihtiyaç duyduğun sinyaller etrafında düzenliyor.'}
            </p>
          </div>
        </section>

        <section className={styles.model} aria-labelledby="trust-model-title">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>{isEn ? 'Trust model' : 'Güven modeli'}</span>
              <h2 id="trust-model-title">{isEn ? 'No magic score. Inspectable signals.' : 'Sihirli puan yok. İncelenebilir sinyaller var.'}</h2>
            </div>
          </div>
          <div className={styles.modelRows}>
            {trustModel.map((item) => (
              <article key={item.key} className={styles.modelRow}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.formats} aria-labelledby="formats-title">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>{isEn ? 'Formats' : 'Biçimler'}</span>
              <h2 id="formats-title">{isEn ? 'The shape follows the problem.' : 'Biçimi problemi belirler.'}</h2>
            </div>
          </div>
          <div className={styles.formatGrid}>
            {formats.map(([type, title, text]) => (
              <article key={title} className={styles.formatItem}>
                <div className={styles.formatFigure}>
                  <EvidenceCover post={{ slug: `about-${type}`, contentType: type, readingTime: 6 }} state="unverified" poster={false} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <span className={styles.eyebrow}>{isEn ? 'Next' : 'Sonraki adım'}</span>
            <h2>{isEn ? 'Read something you can use.' : 'Kullanabileceğin bir şey oku.'}</h2>
          </div>
          <div className={styles.ctaActions}>
            <Link to="/">{isEn ? 'Explore knowledge' : 'Bilgiyi keşfet'} <FiArrowRight aria-hidden="true" /></Link>
            <Link to="/posts/create" className={styles.secondary}>{isEn ? 'Write a useful record' : 'Faydalı bir kayıt yaz'}</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
