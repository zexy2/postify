import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiEdit3, FiX } from 'react-icons/fi';
import { useResolveCorrection } from '../../hooks/useCorrections';
import styles from './KnowledgeDashboardPage.module.css';

const safeHttp = (value) => { try { const url=new URL(value); return ['http:','https:'].includes(url.protocol) ? url : null; } catch { return null; } };

export default function AuthorCorrectionQueue({ corrections = [], posts = [] }) {
  const { i18n } = useTranslation();
  const en = i18n.language?.startsWith('en');
  const resolve = useResolveCorrection();
  const byId = new Map(posts.map((post) => [String(post.id), post]));

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}><h2>{en ? 'Suggested corrections' : 'Düzeltme önerileri'}</h2><span>{corrections.length}</span></div>
      {corrections.length === 0 ? <p className={styles.emptyHint}>{en ? 'No pending correction proposals.' : 'Bekleyen düzeltme önerisi yok.'}</p> : (
        <div className={styles.correctionQueue}>{corrections.map((item) => {
          const post = byId.get(String(item.post_id));
          return <article key={item.id} className={styles.correctionItem}>
            <div className={styles.correctionMeta}><span>{item.kind}</span><time dateTime={item.created_at}>{new Intl.DateTimeFormat(en?'en-US':'tr-TR',{dateStyle:'medium'}).format(new Date(item.created_at))}</time></div>
            <h3>{item.summary}</h3>
            <p>{item.proposed_change}</p>
            {item.environment && <small>{en ? 'Environment' : 'Ortam'}: {item.environment}</small>}
            {Array.isArray(item.source_urls) && item.source_urls.length > 0 && <ul className={styles.correctionSources}>{item.source_urls.map((source)=>{const url=safeHttp(source);return url?<li key={source}><a href={url.href} target="_blank" rel="noopener noreferrer">{url.hostname.replace(/^www\./,'')}</a></li>:null;})}</ul>}
            <div className={styles.correctionActions}>
              {post && <Link to={`/posts/${post.id}/edit`}><FiEdit3 />{en ? 'Review in editor' : 'Editörde incele'}</Link>}
              <button type="button" disabled={resolve.isPending} onClick={()=>resolve.mutate({suggestionId:item.id,decision:'accepted',note:en?'Accepted for the next reviewed revision.':'Sonraki incelenmiş revizyon için kabul edildi.'})}><FiCheck />{en ? 'Accept for revision' : 'Revizyon için kabul et'}</button>
              <button type="button" disabled={resolve.isPending} onClick={()=>resolve.mutate({suggestionId:item.id,decision:'rejected',note:en?'Rejected after author review.':'Yazar incelemesi sonrası reddedildi.'})}><FiX />{en ? 'Reject' : 'Reddet'}</button>
            </div>
            <small>{en ? 'Accepting does not edit the article automatically; use the editor to create the actual revision.' : 'Kabul etmek yazıyı otomatik değiştirmez; gerçek revizyonu editörden yap.'}</small>
          </article>;
        })}</div>
      )}
    </section>
  );
}
