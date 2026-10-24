import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight, FiBookOpen, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useUser, useUserPosts } from '../hooks/usePosts';
import { useBookmarks } from '../hooks/useBookmarks';
import EditorialFeed from '../components/EditorialFeed';
import SEO from '../components/SEO';
import { getPostPresentation, getPostReadingMinutes } from '../lib/postPresentation';
import styles from './UserPage.module.css';

// A compact, truthful issue index. Titles, type and duration come from
// the same published records as the full editorial cards below.
const PublicationLinks = ({ posts, locale, en }) => (
  <ol className={styles.publicationList}>
    {posts.map((post, index) => {
      const presentation = getPostPresentation(post, locale);
      const readingMinutes = getPostReadingMinutes(post);
      return (
        <li key={post.id}>
          <Link to={`/posts/${post.slug || post.id}`} className={styles.publicationLink}>
            <span className={styles.publicationOrdinal} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.publicationDetails}>
              <span className={styles.publicationType}>{presentation.typeLabel}</span>
              <strong>{post.title}</strong>
              {readingMinutes !== null && (
                <small>{readingMinutes} {en ? 'min read' : 'dk okuma'}</small>
              )}
            </span>
            <FiArrowUpRight className={styles.publicationArrow} aria-hidden="true" />
          </Link>
        </li>
      );
    })}
  </ol>
);

const UserPage = () => {
  const { t, i18n } = useTranslation();
  const en = i18n.language?.startsWith('en');
  const { id } = useParams();
  const { data: user, isLoading: userLoading, isError: userError, refetch: refetchUser } = useUser(id);
  const { data: posts = [], isLoading: postsLoading, isError: postsError, refetch: refetchPosts } = useUserPosts(id);
  const { bookmarkedIds, toggle: toggleBookmark } = useBookmarks();

  if (userLoading) {
    return <div className={`container ${styles.routeStatus}`} aria-busy="true"><span className={styles.statusEyebrow}>{en ? 'Author index' : 'Yazar dizini'}</span><p>{t('common.loadingAuthor')}</p></div>;
  }

  if (userError) {
    return (
      <main className={`container ${styles.routeStatus}`}>
        <span className={styles.statusEyebrow}>{en ? 'Author index unavailable' : 'Yazar dizinine ulaşılamıyor'}</span>
        <h1>{en ? 'Author information is temporarily unavailable.' : 'Yazar bilgisi şu anda alınamıyor.'}</h1>
        <p>{en ? 'The profile service could not be reached. Try the request again without losing your place.' : 'Profil servisine ulaşılamadı. Yerini kaybetmeden isteği yeniden deneyebilirsin.'}</p>
        <button type="button" className={styles.statusAction} onClick={() => refetchUser()}>
          {en ? 'Try again' : 'Tekrar dene'}
        </button>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={`container ${styles.routeStatus}`}>
        <span className={styles.statusEyebrow}>{en ? 'Author index miss' : 'Yazar dizini eşleşmedi'}</span>
        <h1>{t('common.authorNotFound')}</h1>
        <p>{t('errors.userNotFound')}</p>
        <Link to="/" className={styles.statusAction}>
          <FiArrowLeft /> {en ? 'Explore useful knowledge' : 'İşe yarayan bilgileri keşfet'}
        </Link>
      </main>
    );
  }

  const totalReadingTime = posts.reduce((total, post) => total + (getPostReadingMinutes(post) || 0), 0);
  const testedCount = posts.filter((post) => post.evidence?.level === 'author-tested' || post.evidenceStatus === 'author-tested').length;
  const roleLabel = user.role === 'editor'
    ? (en ? 'Postify editor' : 'Postify editörü')
    : (en ? 'Knowledge author' : 'Bilgi yazarı');

  return (
    <div className={styles.page}>
      <SEO title={user.name} description={user.bio} />
      <main className={`container ${styles.container}`}>
        <header className={styles.authorHeader}>
          <div className={styles.editionLine} aria-hidden="true">
            <span>POSTIFY <span className={styles.editionMark}>✳</span> AUTHORS</span>
            <span>{en ? 'People behind the ideas' : 'Fikirlerin arkasındaki insanlar'}</span>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.identity}>
              <span className={styles.eyebrow}><FiCheckCircle aria-hidden="true" /> {roleLabel}</span>
              <h1>{user.name}</h1>
              {user.username && <p className={styles.handle}>@{user.username}</p>}
              {user.bio && <p className={styles.bio}>{user.bio}</p>}
              <a className={styles.exploreLink} href="#published-work">
                {en ? 'Explore published work' : 'Yayınlanan yazıları keşfet'}
                <FiArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <div className={styles.portrait} aria-hidden="true">
              <div className={styles.portraitRing} />
              <span className={styles.monogram}>{(user.name || 'P')[0].toUpperCase()}</span>
              <span className={styles.portraitEdition}>P / AUTHOR</span>
            </div>
          </div>
        </header>

        <section className={styles.authorStats} aria-label={en ? 'Author knowledge summary' : 'Yazar bilgi özeti'}>
          <div>
            <FiBookOpen aria-hidden="true" />
            <strong>{posts.length}</strong>
            <span>{en ? 'published records' : 'yayınlanmış içerik'}</span>
          </div>
          <div>
            <FiClock aria-hidden="true" />
            <strong>{totalReadingTime}</strong>
            <span>{en ? 'minutes of reading' : 'dakika okuma'}</span>
          </div>
          <div>
            <FiCheckCircle aria-hidden="true" />
            <strong>{testedCount}</strong>
            <span>{en ? 'author-tested records' : 'yazar testli içerik'}</span>
          </div>
        </section>

        <section id="published-work" className={styles.knowledgeSection}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>{en ? 'Knowledge portfolio' : 'Bilgi portföyü'}</span>
              <h2>{en ? 'Published work' : 'Yayınlanan çalışmalar'}</h2>
            </div>
            <strong>{posts.length}</strong>
          </div>

          {postsLoading ? (
            <p className={styles.inlineStatus}>{t('common.loading')}</p>
          ) : postsError ? (
            <div className={styles.inlineStatus} role="status">
              <span>{en ? 'Published work is temporarily unavailable.' : 'Yayınlanan çalışmalar şu anda alınamıyor.'}</span>
              <button type="button" onClick={() => refetchPosts()}>{en ? 'Try again' : 'Tekrar dene'}</button>
            </div>
          ) : posts.length === 0 ? (
            <p className={styles.empty}>{t('home.noContent')}</p>
          ) : (
            <div className={styles.portfolioLayout}>
              {posts.length >= 3 && (
                <>
                  <aside className={styles.portfolioIndex} aria-label={en ? 'Author publication index' : 'Yazar yayın dizini'}>
                    <div className={styles.portfolioIndexHeading}>
                      <span>{en ? 'Reading index' : 'Okuma dizini'}</span>
                      <strong>{posts.length}</strong>
                    </div>
                    <nav aria-label={en ? 'Browse published work' : 'Yayınlanan çalışmalara göz at'}>
                      <PublicationLinks posts={posts} locale={i18n.language} en={en} />
                    </nav>
                  </aside>
                  <details className={styles.portfolioIndexMobile}>
                    <summary>
                      <span>{en ? 'Browse all publications' : 'Tüm yayınları keşfet'}</span>
                      <strong>{posts.length}</strong>
                    </summary>
                    <nav aria-label={en ? 'Browse published work' : 'Yayınlanan çalışmalara göz at'}>
                      <PublicationLinks posts={posts} locale={i18n.language} en={en} />
                    </nav>
                  </details>
                </>
              )}
              <div className={styles.portfolioFeed}>
                <EditorialFeed
                  posts={posts}
                  bookmarkedIds={bookmarkedIds}
                  onBookmarkToggle={(post) => toggleBookmark(post.id, post)}
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserPage;
