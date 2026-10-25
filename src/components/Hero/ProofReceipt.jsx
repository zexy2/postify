import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiRotateCcw } from 'react-icons/fi';
import { getVerificationCheck } from '../../content/verificationManifest';
import styles from './ProofReceipt.module.css';

const shortHash = (hash) => (hash ? `${hash.slice(0, 8)}…${hash.slice(-6)}` : '—');

/**
 * Replays a real, checked-in verification run as a test report.
 * Every value comes from the published run artifact; nothing is simulated.
 */
export default function ProofReceipt({ run, verified, post, language, variant = 'card', stamp = true }) {
  const isEnglish = language?.startsWith('en');
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [take, setTake] = useState(0);

  // Print the record when it scrolls into view, not while it is off-screen.
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setPlaying(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setPlaying(true); observer.disconnect(); }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [run]);

  if (!run) return null;

  const check = getVerificationCheck(run.id);
  const codeLines = String(check?.code || '').split('\n');
  const hashesMatch = Boolean(run.codeSha256) && run.codeSha256 === run.artifactSha256;
  const stdoutMatches = run.actualStdout === run.expectedStdout;
  const verifiedAt = run.verifiedAt
    ? new Intl.DateTimeFormat(isEnglish ? 'en-GB' : 'tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(run.verifiedAt))
    : null;
  const postHref = post ? `/posts/${post.slug || post.id}` : null;
  let step = 0;
  const next = () => ({ '--step': step++ });

  return (
    <figure
      ref={ref}
      key={take}
      className={styles.receipt}
      data-variant={variant}
      data-playing={playing ? 'true' : undefined}
      aria-label={isEnglish ? 'Latest verification record' : 'Son doğrulama kaydı'}
    >
      <header className={styles.head} style={next()}>
        <span>{isEnglish ? 'Verification record' : 'Doğrulama kaydı'}</span>
        <code>{run.id}</code>
      </header>

      {post && (
        <div className={styles.claim} style={next()}>
          <span className={styles.key}>{isEnglish ? 'Claim' : 'İddia'}</span>
          {postHref ? <Link to={postHref}>{post.title}</Link> : <p>{post.title}</p>}
        </div>
      )}

      <pre className={styles.code} data-stamp-landing aria-label={isEnglish ? 'Executed code' : 'Çalıştırılan kod'}>
        {codeLines.map((line, index) => (
          <span key={index} className={styles.codeLine} style={next()}>
            <span className={styles.lineNo} aria-hidden="true">{index + 1}</span>
            <code>{line || ' '}</code>
          </span>
        ))}
      </pre>

      <div className={styles.run} style={next()}>
        <code className={styles.command}><span aria-hidden="true">$ </span>{run.reproduceCommand}</code>
        <code className={stdoutMatches ? styles.pass : styles.fail}>{run.actualStdout || '—'}</code>
      </div>

      <dl className={styles.facts}>
        <div style={next()}>
          <dt>{isEnglish ? 'Expected output' : 'Beklenen çıktı'}</dt>
          <dd>{run.expectedStdout} {stdoutMatches ? '=' : '≠'} {run.actualStdout}</dd>
        </div>
        <div style={next()}>
          <dt>{isEnglish ? 'Code hash' : 'Kod özeti'}</dt>
          <dd>
            <code>{shortHash(run.codeSha256)}</code>
            <span className={hashesMatch ? styles.match : styles.mismatch}>
              {hashesMatch ? (isEnglish ? 'matches artifact' : 'dosyayla aynı') : (isEnglish ? 'differs' : 'farklı')}
            </span>
          </dd>
        </div>
        <div style={next()}>
          <dt>Runtime</dt>
          <dd>Node {run.runtimeVersion}, {run.durationMs} ms</dd>
        </div>
        {verifiedAt && (
          <div style={next()}>
            <dt>{isEnglish ? 'Executed' : 'Çalıştırıldı'}</dt>
            <dd><time dateTime={run.verifiedAt}>{verifiedAt}</time></dd>
          </div>
        )}
      </dl>

      {stamp && (
      <div
        className={`${styles.stamp} ${verified ? styles.stampVerified : styles.stampRecheck}`}
        style={next()}
        role="status"
      >
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="proof-stamp-ring" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
          </defs>
          <circle cx="60" cy="60" r="56" />
          <circle cx="60" cy="60" r="34" />
          <text>
            <textPath href="#proof-stamp-ring" startOffset="0">
              {verified
                ? (isEnglish ? 'POSTIFY VERIFIED · REPRODUCIBLE · ' : 'POSTIFY DOĞRULADI · TEKRARLANABİLİR · ')
                : (isEnglish ? 'RECHECK REQUIRED · RUNTIME CHANGED · ' : 'YENİDEN KONTROL · ÇALIŞMA ORTAMI DEĞİŞTİ · ')}
            </textPath>
          </text>
          {verified
            ? <path className={styles.stampMark} d="M46 61l10 10 19-22" />
            : <path className={styles.stampMark} d="M60 44v20M60 74v2" />}
        </svg>
        <span className="sr-only">{verified ? 'Postify verified' : (isEnglish ? 'Recheck required' : 'Yeniden kontrol gerekli')}</span>
      </div>
      )}

      <button type="button" className={styles.replay} onClick={() => { setTake((value) => value + 1); setPlaying(true); }}>
        <FiRotateCcw size={14} aria-hidden="true" />
        {isEnglish ? 'Replay recorded run' : 'Kaydı tekrar oynat'}
      </button>
    </figure>
  );
}
