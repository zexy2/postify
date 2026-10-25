import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowUp, FiArrowUpRight, FiGithub } from 'react-icons/fi';
import BrandMark from '../BrandMark';
import styles from './Footer.module.css';
import useFooterInk from './useFooterInk';

// Label rolls up on hover and returns in the verified colour; the copy is decorative.
const Roll = ({ children }) => (
  <>
    <span className={styles.roll} data-label={children}><span>{children}</span></span>
    <FiArrowUpRight className={styles.rowArrow} aria-hidden="true" />
  </>
);

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const titleRef = useRef(null);
  useFooterInk(footerRef, titleRef);
  const statement = isEnglish ? 'Show your work.' : 'İşini göster.';
  const sealRing = isEnglish ? 'YOUR RECORD · YOUR RECORD · ' : 'SENİN KAYDIN · SENİN KAYDIN · ';

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const handleHomeNavigation = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  };

  const formatLinks = [
    ['guide', isEnglish ? 'Guides' : 'Rehberler'],
    ['decision', isEnglish ? 'Decisions' : 'Karar notları'],
    ['explainer', isEnglish ? 'Explainers' : 'Açıklayıcılar'],
    ['fieldNote', isEnglish ? 'Field notes' : 'Saha notları'],
  ];

  const trustModel = [
    [isEnglish ? 'Evidence' : 'Kanıt', isEnglish ? 'See what supports the claim.' : 'İddianın neye dayandığını gör.'],
    [isEnglish ? 'Freshness' : 'Güncellik', isEnglish ? 'Know when the context changed.' : 'Bağlamın ne zaman değiştiğini bil.'],
    [isEnglish ? 'Reproducibility' : 'Tekrarlanabilirlik', isEnglish ? 'Repeat the work, not the promise.' : 'Vaadi değil, uygulamayı tekrar et.'],
  ];

  return (
    <footer ref={footerRef} className={styles.footer} aria-label={isEnglish ? 'Postify footer' : 'Postify alt bilgi'}>
      <div className={styles.shell}>
        <section className={styles.statement} aria-labelledby="footer-statement-title">
          {/* Outline sits underneath; the real heading is the ink that scroll and pointer reveal */}
          <h2 id="footer-statement-title" ref={titleRef} className={styles.statementTitle} style={{ '--chars': statement.length }}>
            <span className={styles.titleOutline} aria-hidden="true">{statement}</span>
            <span className={styles.titleInk}>{statement}</span>
            <span className={styles.titleLamp} aria-hidden="true">{statement}</span>
          </h2>
          <div className={styles.statementCopy}>
            <p className={styles.statementText}>
              {isEnglish
                ? 'Write down what you tried, where you tried it and what happened. Postify keeps that record next to the claim, and tells readers when it needs checking again.'
                : 'Neyi denediğini, nerede denediğini ve ne olduğunu yaz. Postify bu kaydı iddianın yanında tutar ve yeniden kontrol gerektiğinde okura söyler.'}
            </p>
            <div className={styles.primaryActions}>
              <svg className={styles.seal} viewBox="0 0 120 120" aria-hidden="true">
                <defs><path id="footer-seal-path" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" /></defs>
                <circle className={styles.sealRim} cx="60" cy="60" r="56" />
                <circle className={styles.sealCore} cx="60" cy="60" r="33" />
                <text className={styles.sealText}><textPath href="#footer-seal-path">{sealRing}</textPath></text>
                <path className={styles.sealMark} d="M45 61l10 10 21-23" />
              </svg>
              <Link to="/posts/create" className={styles.primaryLink}>
                {isEnglish ? 'Publish a record' : 'Kayıt yayımla'}
                <FiArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/" className={styles.secondaryLink} onClick={handleHomeNavigation}>
                {isEnglish ? 'Explore knowledge' : 'Bilgiyi keşfet'}
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.systemLine} aria-label={isEnglish ? 'Postify trust model' : 'Postify güven modeli'}>
          {trustModel.map(([title, copy]) => (
            <div key={title} className={styles.systemCopy}>
              <span className={styles.node} aria-hidden="true" />
              <strong>{title}</strong>
              <small>{copy}</small>
            </div>
          ))}
        </div>

        <div className={styles.indexGrid}>
          <div className={styles.brandBlock}>
            <Link to="/" className={styles.brandLink} aria-label="Postify home" onClick={handleHomeNavigation}>
              <BrandMark size="md" />
              <span>Postify</span>
            </Link>
            <p>{t('footer.description')}</p>
            <a
              href="https://github.com/zexy2/postify"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              <FiGithub aria-hidden="true" />
              <span>GitHub</span>
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <nav className={styles.linkGroup} aria-label={isEnglish ? 'Content formats' : 'İçerik biçimleri'}>
            <span className={styles.groupLabel}>{isEnglish ? 'Read by format' : 'Biçime göre oku'}</span>
            {formatLinks.map(([type, label]) => (
              <Link key={type} to={`/?type=${type}#knowledge-feed`}><Roll>{label}</Roll></Link>
            ))}
          </nav>

          <nav className={styles.linkGroup} aria-label={isEnglish ? 'Postify pages' : 'Postify sayfaları'}>
            <span className={styles.groupLabel}>Postify</span>
            <Link to="/goal"><Roll>{isEnglish ? 'Our goal' : 'Hedefimiz'}</Roll></Link>
            <Link to="/about"><Roll>{t('nav.about')}</Roll></Link>
            <Link to="/contact"><Roll>{t('nav.contact')}</Roll></Link>
            <Link to="/bookmarks"><Roll>{t('nav.bookmarks')}</Roll></Link>
            <Link to="/knowledge"><Roll>{isEnglish ? 'Knowledge health' : 'Bilgi sağlığı'}</Roll></Link>
          </nav>
        </div>

        <div className={styles.bottomBar}>
          <span>© {currentYear} Postify. {t('footer.copyright')}</span>
          <button type="button" onClick={scrollToTop} className={styles.scrollTopButton}>
            <span>{isEnglish ? 'Back to top' : 'Başa dön'}</span>
            <span className={styles.progress} aria-hidden="true">
              <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" pathLength="1" /></svg>
              <FiArrowUp />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
