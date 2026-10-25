import { useTranslation } from 'react-i18next';
import KnowledgeCard from '../KnowledgeCard';
import styles from './EditorialFeed.module.css';

// fx opt-in keeps the immersive discovery design exclusive to Home.
const EditorialFeed = ({ posts, onBookmarkToggle, bookmarkedIds = [], fx }) => {
  const { i18n } = useTranslation();
  if (!posts?.length) return null;
  const en = i18n.language?.startsWith('en');

  return (
    <div className={styles.feedContainer} data-knowledge-feed="v3" data-showcase={fx}>
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
