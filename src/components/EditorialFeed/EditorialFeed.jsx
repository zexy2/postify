import { useTranslation } from 'react-i18next';
import KnowledgeCard from '../KnowledgeCard';
import styles from './EditorialFeed.module.css';
import EvidenceIndex from './EvidenceIndex';

// fx opt-in renders Home's evidence index; other pages keep the card feed.
const EditorialFeed = ({ posts, onBookmarkToggle, bookmarkedIds = [], fx }) => {
  const { i18n } = useTranslation();
  const en = i18n.language?.startsWith('en');
  if (!posts?.length) return null;
  if (fx) return <EvidenceIndex posts={posts} onBookmarkToggle={onBookmarkToggle} bookmarkedIds={bookmarkedIds} />;

  return (
    <div className={styles.feedContainer} data-knowledge-feed="v3">
      {posts.map((post, index) => {
        const variant = index === 0 ? 'featured' : index <= 3 ? 'standard' : 'compact';
        return (
          <KnowledgeCard
            key={post.id}
            post={post}
            variant={variant}
            priorityLabel={index === 0 ? (en ? 'Priority read' : 'Öncelikli okuma') : undefined}
            onBookmarkToggle={onBookmarkToggle}
            isBookmarked={bookmarkedIds.includes(post.id)}
          />
        );
      })}
    </div>
  );
};

export default EditorialFeed;
