import { useTranslation } from 'react-i18next';
import styles from './CategoryNav.module.css';
import { getCategoryLabel } from '../../lib/categoryLabels';

const CategoryNav = ({ categories, activeCategory, onChange, counts = {} }) => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const topics = [{ value: 'all', label: isEnglish ? 'All topics' : 'Tüm konular' }, ...categories.map((category) => ({
    value: category,
    label: getCategoryLabel(category, i18n.language),
  }))];

  return (
    <nav className={styles.nav} aria-label={t('home.categoriesLabel')}>
      <label className={styles.label} htmlFor="postify-topic-select">
        {isEnglish ? 'Topic' : 'Konu'}
      </label>
      <div className={styles.topicIndex} data-topic-index>
        <span className={styles.indexHeading} aria-hidden="true">{isEnglish ? 'Explore by subject' : 'Konulara göre keşfet'}</span>
        <div className={styles.indexList}>
          {topics.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`${styles.indexItem} ${activeCategory === value ? styles.active : ''}`}
              aria-pressed={activeCategory === value}
              onClick={() => onChange(value)}
            >
              <span className={styles.indexName}>{label}</span>
              <span className={styles.indexCount} aria-label={isEnglish ? `${counts[value] || 0} entries` : `${counts[value] || 0} içerik`}>{counts[value] || 0}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.selectWrap}>
        <select
          id="postify-topic-select"
          className={styles.select}
          value={activeCategory}
          onChange={(event) => onChange(event.target.value)}
          aria-label={isEnglish ? 'Topics' : 'Konular'}
        >
          {topics.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">⌄</span>
      </div>
    </nav>
  );
};

export default CategoryNav;
