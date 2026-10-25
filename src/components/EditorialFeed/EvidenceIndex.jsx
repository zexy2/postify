import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowUpRight, FiBookmark } from 'react-icons/fi';
import TransitionLink from '../TransitionLink/TransitionLink';
import EvidenceCover from '../EvidenceCover/EvidenceCover';
import EvidenceBadge from '../EvidenceBadge';
import { getEvidenceCopy } from '../../lib/knowledgeEvidence';
import { getPostPresentation, getPostReadingMinutes } from '../../lib/postPresentation';
import { getCategoryLabel } from '../../lib/categoryLabels';
import useIndexPointer from './useIndexPointer';
import styles from './EvidenceIndex.module.css';

/**
 * Home archive as an evidence index: one oversized title per record. Each row
 * inks in and gets its seal pressed as it enters; on fine pointers the record's
 * own cover trails the cursor with inertia while the other rows recede.
 */
const IndexRow = ({ post, variant, priorityLabel, onBookmarkToggle, isBookmarked }) => {
  const { t, i18n } = useTranslation();
  const en = i18n.language?.startsWith('en');
  const presentation = getPostPresentation(post, i18n.language);
  const evidence = getEvidenceCopy(post, i18n.language);
  const minutes = getPostReadingMinutes(post);
  const href = `/posts/${post.slug || post.id}`;
  const level = post.evidence?.level || evidence.level || 'unverified';
  const isFeatured = variant === 'featured';
  const Title = isFeatured ? 'h3' : 'h4';

  return (
    <article
      className={`${styles.row} ${styles[variant]}`}
      data-card-variant={variant}
      data-evidence={level}
      data-fresh={evidence.freshness}
      data-scroll-anchor-key={href}
      data-vt-scope
    >
      <span className={styles.seal} aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle className={styles.sealRing} cx="20" cy="20" r="17" />
          <path className={styles.sealMark} d="M13 20.5l4.6 4.6L27.5 15" />
        </svg>
      </span>

      <div className={styles.dossier}>
        {priorityLabel && <span className={styles.priority}>{priorityLabel}</span>}
        <span className={styles.type}>{presentation.typeLabel}</span>
        <span className={styles.dim}>
          {[post.category && getCategoryLabel(post.category, i18n.language), presentation.formattedDate]
            .filter(Boolean).join(' · ')}
        </span>
        <EvidenceBadge post={post} compact />
        <span className={styles.fresh} data-freshness={evidence.freshness}>
          <span className="sr-only">{en ? 'Freshness' : 'Güncellik'}: </span>
          <strong>{evidence.freshnessLabel}</strong>
          {minutes !== null && <span className={styles.dim}> · {minutes} {t('common.minutes')}</span>}
        </span>
      </div>

      <div className={styles.body}>
        <TransitionLink to={href} className={styles.titleLink}>
          <Title className={styles.title} data-vt="title">{post.title}</Title>
        </TransitionLink>
        {isFeatured && presentation.outcome && <p className={styles.outcome}>{presentation.outcome}</p>}
      </div>

      <div className={styles.actions}>
        <TransitionLink to={href} className={styles.go} aria-label={`${t('common.read')}: ${post.title}`}>
          <FiArrowUpRight size={20} aria-hidden="true" />
        </TransitionLink>
        <button
          type="button"
          className={styles.bookmark}
          data-on={isBookmarked || undefined}
          onClick={() => onBookmarkToggle?.(post)}
          aria-label={isBookmarked ? t('bookmarks.removeFromBookmarks') : t('bookmarks.addToBookmarks')}
        >
          <FiBookmark size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Trailing preview on desktop, inline plate for the lead record on small screens */}
      <span className={styles.preview} data-vt="cover" aria-hidden="true">
        <EvidenceCover post={post} className={styles.previewArt} typeLabel={presentation.typeLabel} />
      </span>
    </article>
  );
};

const EvidenceIndex = ({ posts, onBookmarkToggle, bookmarkedIds = [] }) => {
  const { i18n } = useTranslation();
  const ref = useRef(null);
  const en = i18n.language?.startsWith('en');
  useIndexPointer(ref, posts.length);

  return (
    <div ref={ref} className={styles.index} data-knowledge-feed="v3" data-showcase="true">
      {posts.map((post, index) => (
        <IndexRow
          key={post.id}
          post={post}
          variant={index === 0 ? 'featured' : index <= 3 ? 'standard' : 'compact'}
          priorityLabel={index === 0 ? (en ? 'Priority read' : 'Öncelikli okuma') : undefined}
          onBookmarkToggle={onBookmarkToggle}
          isBookmarked={bookmarkedIds.includes(post.id)}
        />
      ))}
    </div>
  );
};

export default EvidenceIndex;
