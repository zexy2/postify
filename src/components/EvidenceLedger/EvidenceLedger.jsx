import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getEvidenceCopy } from '../../lib/knowledgeEvidence';
import { useAutoVerification } from '../../hooks/useAutoVerification';
import styles from './EvidenceLedger.module.css';

const formatDate = (value, locale) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
};

/**
 * The article's margin note: what this text claims to be, how it was tested,
 * and how far the reader has come. Sticky beside the body on wide screens.
 */
export default function EvidenceLedger({ post, articleRef, children = null }) {
  const { i18n } = useTranslation();
  const en = i18n.language?.startsWith('en');
  const locale = en ? 'en-US' : 'tr-TR';
  const evidence = getEvidenceCopy(post, i18n.language);
  const { run, state } = useAutoVerification(post.autoVerificationId);
  const progressRef = useRef(null);

  const verified = state.status === 'verified';
  const recheck = state.status === 'recheck-required';
  const mark = verified ? 'verified' : recheck ? 'recheck' : evidence.freshness === 'stale' ? 'recheck' : evidence.level;
  const levelLabel = verified ? 'Postify verified' : recheck ? (en ? 'Re-check required' : 'Yeniden kontrol') : evidence.levelLabel;
  const freshnessLabel = verified ? (en ? 'Runtime current' : 'Ortam güncel')
    : recheck ? (en ? 'Runtime changed' : 'Ortam değişti') : evidence.freshnessLabel;
  const testedAt = formatDate(run?.verifiedAt || evidence.testedAt, locale);
  const environment = run ? [`${run.runtime || 'Node'} ${run.runtimeVersion}`] : evidence.environment.slice(0, 3);

  // Reading progress through the article body, drawn as the ledger's spine.
  useEffect(() => {
    const article = articleRef?.current;
    const bar = progressRef.current;
    if (!article || !bar) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = article.getBoundingClientRect();
      const total = Math.max(1, box.height - window.innerHeight * 0.6);
      const value = Math.min(1, Math.max(0, -box.top / total));
      bar.style.setProperty('--read', value.toFixed(3));
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      cancelAnimationFrame(raf);
    };
  }, [articleRef]);

  return (
    <aside className={styles.ledger} data-mark={mark} aria-label={en ? 'Evidence ledger' : 'Kanıt defteri'}>
      <div className={styles.head}>
        <svg className={styles.seal} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="21" />
          <circle cx="24" cy="24" r="15" />
          {mark === 'verified' || mark === 'author-tested'
            ? <path d="M16.5 24.5l5 5 10-11" />
            : mark === 'recheck'
              ? <><path d="M24 15.5v10" /><path d="M24 31.5v.5" /></>
              : <path d="M17 24h14" />}
        </svg>
        <div>
          <span className={styles.kicker}>{en ? 'Evidence' : 'Kanıt'}</span>
          <strong className={styles.level}>{levelLabel}</strong>
        </div>
      </div>

      <dl className={styles.facts}>
        <div><dt>{en ? 'Freshness' : 'Güncellik'}</dt><dd>{freshnessLabel}</dd></div>
        {testedAt && <div><dt>{en ? 'Tested' : 'Test'}</dt><dd>{testedAt}</dd></div>}
        {environment.length > 0 && <div><dt>{en ? 'Environment' : 'Ortam'}</dt><dd>{environment.join(', ')}</dd></div>}
        {run?.status && <div><dt>{en ? 'Last run' : 'Son çalıştırma'}</dt><dd className={styles.pass}>{run.status === 'passed' ? 'PASS' : run.status.toUpperCase()}</dd></div>}
      </dl>

      <a className={styles.jump} href="#article-evidence">{en ? 'See how it was tested' : 'Nasıl test edildiğini gör'} ↓</a>

      {children}

      <div ref={progressRef} className={styles.progress} aria-hidden="true">
        <span className={styles.progressLabel}>{en ? 'Read' : 'Okundu'}</span>
        <span className={styles.progressTrack}><span /></span>
      </div>
    </aside>
  );
}
