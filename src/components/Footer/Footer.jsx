import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowUp, FiArrowUpRight, FiGithub } from 'react-icons/fi';
import BrandMark from '../BrandMark';
import styles from './Footer.module.css';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const currentYear = new Date().getFullYear();

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
    <footer className={styles.footer} aria-label={isEnglish ? 'Postify footer' : 'Postify alt bilgi'}>
      <div className={styles.shell}>
        <section className={styles.statement} aria-labelledby="footer-statement-title">
          <h2 id="footer-statement-title" className={styles.statementTitle}>
            {isEnglish ? 'Show your work.' : 'İşini göster.'}
          </h2>
          <div className={styles.statementCopy}>
            <p className={styles.statementText}>
              {isEnglish
                ? 'Write down what you tried, where you tried it and what happened. Postify keeps that record next to the claim, and tells readers when it needs checking again.'
                : 'Neyi denediğini, nerede denediğini ve ne olduğunu yaz. Postify bu kaydı iddianın yanında tutar ve yeniden kontrol gerektiğinde okura söyler.'}
            </p>
            <div className={styles.primaryActions}>
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
              <Link key={type} to={`/?type=${type}#knowledge-feed`}>{label}</Link>
            ))}
          </nav>

          <nav className={styles.linkGroup} aria-label={isEnglish ? 'Postify pages' : 'Postify sayfaları'}>
            <span className={styles.groupLabel}>Postify</span>
            <Link to="/goal">{isEnglish ? 'Our goal' : 'Hedefimiz'}</Link>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
            <Link to="/bookmarks">{t('nav.bookmarks')}</Link>
            <Link to="/knowledge">{isEnglish ? 'Knowledge health' : 'Bilgi sağlığı'}</Link>
          </nav>
        </div>

        <div className={styles.bottomBar}>
          <span>© {currentYear} Postify. {t('footer.copyright')}</span>
          <button type="button" onClick={scrollToTop} className={styles.scrollTopButton}>
            <span>{isEnglish ? 'Back to top' : 'Başa dön'}</span>
            <FiArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
