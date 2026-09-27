import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle, FiCheck, FiEdit3, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useKnowledgeBackendStatus } from '../hooks/useKnowledge';
import { useCorrections, useSubmitCorrection, useWithdrawCorrection } from '../hooks/useCorrections';
import styles from './CorrectionSuggestionPanel.module.css';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const initialForm = { kind: 'technical', summary: '', proposedChange: '', environment: '', sources: '' };

export default function CorrectionSuggestionPanel({ post }) {
  const { i18n } = useTranslation();
  const en = i18n.language?.startsWith('en');
  const { user, isAuthenticated } = useAuth();
  const backend = useKnowledgeBackendStatus();
  const persistedPost = Boolean(post?.id && UUID_RE.test(String(post.id)) && !post.isFallback);
  const isAuthor = Boolean(user?.id && String(user.id) === String(post?.authorId || post?.author?.id));
  const correctionsReady = backend.data?.ready === true && backend.data?.features?.corrections === true;
  const canLoad = correctionsReady && persistedPost && isAuthenticated;
  const corrections = useCorrections(post?.id, { enabled: canLoad });
  const submit = useSubmitCorrection(post?.id);
  const withdraw = useWithdrawCorrection(post?.id);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const ownCorrections = useMemo(() => (corrections.data || []).filter((item) => String(item.user_id) === String(user?.id)), [corrections.data, user?.id]);
  const pending = ownCorrections.find((item) => item.status === 'pending');
  const latestResolved = ownCorrections.find((item) => item.status !== 'pending');

  if (!correctionsReady || !persistedPost || isAuthor) return null;

  const setField = (name) => (event) => setForm((current) => ({ ...current, [name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await submit.mutateAsync({
        kind: form.kind,
        summary: form.summary,
        proposedChange: form.proposedChange,
        environment: form.environment,
        sourceUrls: form.sources.split(/\n+/).map((item) => item.trim()).filter(Boolean),
      });
      setForm(initialForm);
      setOpen(false);
      setMessage(en ? 'Correction sent privately to the author.' : 'Düzeltme önerisi yazara özel olarak gönderildi.');
    } catch (error) {
      setMessage(error?.message || (en ? 'Correction could not be sent.' : 'Düzeltme önerisi gönderilemedi.'));
    }
  };

  if (!isAuthenticated) {
    return (
      <section className={styles.panel} aria-labelledby="correction-panel-title">
        <span className={styles.eyebrow}>{en ? 'Correction channel' : 'Düzeltme kanalı'}</span>
        <h2 id="correction-panel-title">{en ? 'Found something stale or wrong?' : 'Eski ya da yanlış bir şey mi buldun?'}</h2>
        <p>{en ? 'Sign in to send a private, structured correction proposal to the author.' : 'Yazara özel, yapılandırılmış bir düzeltme önerisi göndermek için giriş yap.'}</p>
        <Link className={styles.primaryAction} to="/auth/login">{en ? 'Sign in to suggest a correction' : 'Düzeltme önermek için giriş yap'}</Link>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="correction-panel-title">
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{en ? 'Correction channel' : 'Düzeltme kanalı'}</span>
          <h2 id="correction-panel-title">{en ? 'Suggest a precise correction' : 'Net bir düzeltme öner'}</h2>
          <p>{en ? 'This is private between you and the author. It does not edit the article automatically.' : 'Bu öneri yalnız sen ve yazar arasında görünür; yazıyı otomatik değiştirmez.'}</p>
        </div>
        {!pending && <button type="button" className={styles.primaryAction} onClick={() => setOpen((value) => !value)}><FiEdit3 />{open ? (en ? 'Close' : 'Kapat') : (en ? 'Suggest correction' : 'Düzeltme öner')}</button>}
      </div>

      {message && <p className={styles.message} role="status">{message}</p>}

      {pending && (
        <div className={styles.pending}>
          <FiAlertCircle aria-hidden="true" />
          <div><strong>{en ? 'One proposal is awaiting author review.' : 'Bir önerin yazar incelemesini bekliyor.'}</strong><p>{pending.summary}</p></div>
          <button type="button" disabled={withdraw.isPending} onClick={() => withdraw.mutate(pending.id)}><FiX />{en ? 'Withdraw' : 'Geri çek'}</button>
        </div>
      )}

      {latestResolved && (
        <p className={styles.resolution} data-status={latestResolved.status}><FiCheck aria-hidden="true" />{en ? 'Latest proposal' : 'Son öneri'}: <strong>{latestResolved.status}</strong>{latestResolved.resolution_note ? ` — ${latestResolved.resolution_note}` : ''}</p>
      )}

      {open && !pending && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>{en ? 'Type' : 'Tür'}<select value={form.kind} onChange={setField('kind')}><option value="technical">{en ? 'Technical accuracy' : 'Teknik doğruluk'}</option><option value="version">{en ? 'Version / environment' : 'Sürüm / ortam'}</option><option value="source">{en ? 'Source / citation' : 'Kaynak'}</option><option value="clarity">{en ? 'Clarity' : 'Anlatım'}</option><option value="other">{en ? 'Other' : 'Diğer'}</option></select></label>
          <label>{en ? 'What is wrong?' : 'Sorun ne?'}<input value={form.summary} onChange={setField('summary')} minLength={8} maxLength={280} required placeholder={en ? 'Example: Node 20 note is stale' : 'Örn: Node 20 notu artık eski'} /></label>
          <label>{en ? 'Proposed change' : 'Önerilen değişiklik'}<textarea value={form.proposedChange} onChange={setField('proposedChange')} minLength={16} maxLength={4000} required rows={5} placeholder={en ? 'Describe the exact change the author should review.' : 'Yazarın incelemesi gereken net değişikliği yaz.'} /></label>
          <label>{en ? 'Environment / version (optional)' : 'Ortam / sürüm (opsiyonel)'}<input value={form.environment} onChange={setField('environment')} maxLength={500} placeholder="Node 22 · macOS 15" /></label>
          <label>{en ? 'Sources — one URL per line (optional)' : 'Kaynaklar — satır başına bir URL (opsiyonel)'}<textarea value={form.sources} onChange={setField('sources')} rows={3} placeholder="https://..." /></label>
          <div className={styles.formActions}><button type="button" onClick={() => setOpen(false)}>{en ? 'Cancel' : 'Vazgeç'}</button><button type="submit" className={styles.primaryAction} disabled={submit.isPending}>{submit.isPending ? (en ? 'Sending…' : 'Gönderiliyor…') : (en ? 'Send private proposal' : 'Özel öneriyi gönder')}</button></div>
        </form>
      )}
    </section>
  );
}
