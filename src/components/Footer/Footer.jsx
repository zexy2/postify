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

  return (
    <footer className={styles.footer} aria-label={isEnglish ? 'Postify footer' : 'Postify alt bilgi'}>
      <div className={styles.shell}>
        <section className={styles.statement} aria-labelledby="footer-statement-title">
          <div className={styles.statementCopy}>
            <span className={styles.eyebrow}>{isEnglish ? 'THE IDEA BEHIND POSTIFY' : 'POSTIFY’IN ARKASINDAKİ FİKİR'}</span>
            <h2 id="footer-statement-title" className={styles.statementTitle}>
              {isEnglish ? <>Don't just <em>read it.</em><br />Make it work.</> : <>Sadece <em>okuma.</em><br />İşe yarasın.</>}
            </h2>
            <p className={styles.statementText}>
              {isEnglish
                ? 'A home for ideas that can be tested, questioned and used again. That is the whole point.'
                : 'Sınanabilen, sorgulanabilen ve yeniden kullanılabilen fikirler için bir yer. Bütün mesele bu.'}
            </p>
            <div className={styles.primaryActions}>
              <Link to="/goal" className={styles.primaryLink}>
                {isEnglish ? 'Discover our goal' : 'Hedefimizi keşfet'}
                <FiArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/" className={styles.secondaryLink} onClick={handleHomeNavigation}>
                {isEnglish ? 'Explore knowledge' : 'Bilgiyi keşfet'}
              </Link>
            </div>
          </div>
          <div className={styles.footerArtwork} aria-hidden="true">
            <div className={styles.artworkRing}><span>✳</span></div>
            <span className={styles.artworkTop}>POSTIFY / IDEA TO EVIDENCE</span>
            <span className={styles.artworkBottom}>READ → TEST → REPEAT</span>
          </div>
        </section>

        <Link className={styles.signature} to="/goal" aria-label={isEnglish ? 'Discover the Postify goal' : 'Postify hedefini keşfet'}>
          <span>POSTIFY</span><FiArrowUpRight aria-hidden="true" />
        </Link>

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
            <span className={styles.groupLabel}>{isEnglish ? 'READ BY FORMAT' : 'BİÇİME GÖRE OKU'}</span>
            {formatLinks.map(([type, label], index) => (
              <Link key={type} to={`/?type=${type}#knowledge-feed`}>
                <span className={styles.linkIndex} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <nav className={styles.linkGroup} aria-label={isEnglish ? 'Postify pages' : 'Postify sayfaları'}>
            <span className={styles.groupLabel}>POSTIFY</span>
            <Link to="/goal"><span className={styles.linkIndex} aria-hidden="true">01</span><span>{isEnglish ? 'Our goal' : 'Hedefimiz'}</span></Link>
            <Link to="/about"><span className={styles.linkIndex} aria-hidden="true">02</span><span>{t('nav.about')}</span></Link>
            <Link to="/contact"><span className={styles.linkIndex} aria-hidden="true">03</span><span>{t('nav.contact')}</span></Link>
            <Link to="/bookmarks"><span className={styles.linkIndex} aria-hidden="true">04</span><span>{t('nav.bookmarks')}</span></Link>
            <Link to="/knowledge"><span className={styles.linkIndex} aria-hidden="true">05</span><span>{isEnglish ? 'Knowledge health' : 'Bilgi sağlığı'}</span></Link>
          </nav>
        </div>

        <div className={styles.systemLine} aria-label={isEnglish ? 'Postify trust model' : 'Postify güven modeli'}>
          <div>
            <span>01</span>
            <div className={styles.systemCopy}>
              <strong>{isEnglish ? 'Evidence' : 'Kanıt'}</strong>
              <small>{isEnglish ? 'See what supports the claim.' : 'İddianın neye dayandığını gör.'}</small>
            </div>
          </div>
          <div>
            <span>02</span>
            <div className={styles.systemCopy}>
              <strong>{isEnglish ? 'Freshness' : 'Güncellik'}</strong>
              <small>{isEnglish ? 'Know when the context changed.' : 'Bağlamın ne zaman değiştiğini bil.'}</small>
            </div>
          </div>
          <div>
            <span>03</span>
            <div className={styles.systemCopy}>
              <strong>{isEnglish ? 'Reproducibility' : 'Tekrarlanabilirlik'}</strong>
              <small>{isEnglish ? 'Repeat the work, not the promise.' : 'Vaadi değil, uygulamayı tekrar et.'}</small>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span>© {currentYear} Postify · {t('footer.copyright')}</span>
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
