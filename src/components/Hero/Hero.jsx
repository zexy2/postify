import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowDown, FiArrowUpRight, FiEdit3, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import EvidenceCover from '../EvidenceCover/EvidenceCover';
import TransitionLink from '../TransitionLink/TransitionLink';
import ProofReceipt from './ProofReceipt';
import HeroHeadline from './HeroHeadline';
import { HeroStamp, RunLine } from './HeroStamp';
import PaperLight from './PaperLight';
import { getPostPresentation } from '../../lib/postPresentation';
import { getCategoryLabel } from '../../lib/categoryLabels';

export default function Hero({
  showSearch = true,
  searchValue = '',
  onSearchChange,
  featuredPost,
  proofRun = null,
  proofVerified = false,
  proofPost = null,
}) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const presentation = featuredPost ? getPostPresentation(featuredPost, i18n.language) : null;
  const sceneRef = useRef(null);
  const [replay, setReplay] = useState(0);
  const replayRun = useCallback(() => setReplay((count) => count + 1), []);

  // Paper light and a few pixels of depth follow the pointer.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !window.matchMedia?.('(pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const move = (event) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = scene.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;
        scene.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
        scene.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
        scene.style.setProperty('--px', (x - 0.5).toFixed(3));
        scene.style.setProperty('--py', (y - 0.5).toFixed(3));
      });
    };
    scene.addEventListener('pointermove', move);
    return () => { scene.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.grain} aria-hidden="true" />

      <div ref={sceneRef} className={styles.scene}>
        <span className={styles.light} aria-hidden="true" />
        <PaperLight sceneRef={sceneRef} />

        <div className={styles.titleFrame}>
          <HeroHeadline
            text={t('home.title')}
            className={styles.title}
            run={proofRun}
            language={i18n.language}
            onActivate={proofRun ? replayRun : undefined}
            stamp={proofRun ? <HeroStamp key={replay} replayed={replay > 0} verified={proofVerified} language={i18n.language} /> : null}
          />
          <div className={styles.runSlot}>
            <RunLine key={replay} replayed={replay > 0} onReplay={replayRun} run={proofRun} verified={proofVerified} language={i18n.language} />
          </div>
        </div>

        <div className={styles.sceneFoot}>
          <div className={styles.copy}>
            <p className={styles.subtitle}>{t('home.subtitle')}</p>
            <div className={styles.heroActions}>
              <a href="#knowledge-feed" className={styles.primaryAction}>
                {isEnglish ? 'Browse the library' : 'Arşive göz at'} <FiArrowDown size={16} aria-hidden="true" />
              </a>
              <Link to="/posts/create" className={styles.secondaryAction}>
                <FiEdit3 size={15} aria-hidden="true" /> {isEnglish ? 'Contribute' : 'Katkı yap'}
              </Link>
            </div>
          </div>
          {featuredPost && (
            <TransitionLink to={`/posts/${featuredPost.slug || featuredPost.id}`} className={styles.featured} data-vt-scope>
              <div className={styles.featuredVisual} data-vt="cover">
                <EvidenceCover post={featuredPost} className={styles.featuredImage} poster={false} />
              </div>
              <div className={styles.featuredContent}>
                <span className={styles.featuredLabel}>
                  {t('home.featured')}
                  {presentation?.typeLabel && <span className={styles.featuredType}>{presentation.typeLabel}</span>}
                </span>
                <strong data-vt="title">{featuredPost.title}</strong>
                <span className={styles.featuredExcerpt}>{presentation?.outcome}</span>
                <span className={styles.featuredMeta}>
                  <span>{getCategoryLabel(featuredPost.category, i18n.language)}</span>
                  <span>{featuredPost.readingTime} {t('common.minutes')}</span>
                  {presentation?.formattedDate && <span>{presentation.dateLabel} {presentation.formattedDate}</span>}
                </span>
              </div>
              <FiArrowUpRight className={styles.arrow} size={22} aria-hidden="true" />
            </TransitionLink>
          )}
        </div>
      </div>

      <div className={styles.inner}>
        {showSearch && (
          <label className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              className={styles.searchInput}
              placeholder={t('home.searchPlaceholder')}
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              aria-label={t('home.searchLabel')}
            />
            <span className={styles.searchHint} aria-hidden="true">{isEnglish ? 'FILTER' : 'FİLTRE'}</span>
          </label>
        )}

        <div className={styles.proof}>
          <ProofReceipt run={proofRun} verified={proofVerified} post={proofPost} language={i18n.language} variant="wide" stamp={false} />
        </div>

      </div>
    </section>
  );
}
