import { useTranslation } from 'react-i18next';
import { useAutoVerification } from '../../hooks/useAutoVerification';
import { getVerificationCheck } from '../../content/verificationManifest';
import styles from './CodeProof.module.css';

const normalize = (value) => String(value || '').replace(/\r\n/g, '\n').trimEnd();

/**
 * Attaches the published execution record to the exact code block it ran.
 * Renders nothing unless the displayed code is byte-identical to the artifact.
 */
export default function CodeProof({ verificationId, code }) {
  const { i18n } = useTranslation();
  const en = i18n.language?.startsWith('en');
  const { run, state } = useAutoVerification(verificationId);
  const check = verificationId ? getVerificationCheck(verificationId) : null;
  if (!run || run.status !== 'passed' || !check || normalize(check.code) !== normalize(code)) return null;

  const current = state.status === 'verified';
  const hashesMatch = Boolean(run.codeSha256) && run.codeSha256 === run.artifactSha256;

  return (
    <aside className={styles.proof} data-current={current || undefined} aria-label={en ? 'Execution record for this code' : 'Bu kodun çalıştırma kaydı'}>
      <svg className={styles.seal} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="17" />
        <path d="M13 20.5l4.6 4.6L27.5 15" />
      </svg>
      <code className={styles.command}><span aria-hidden="true">$ </span>{run.reproduceCommand}</code>
      <span className={styles.result}>{run.actualStdout}</span>
      <span className={styles.meta}>
        Node {run.runtimeVersion}
        {hashesMatch && <>{', '}{en ? 'code matches the executed file' : 'kod çalıştırılan dosyayla aynı'}</>}
      </span>
      <span className={styles.state}>
        {current
          ? (en ? 'Verified on the current runtime' : 'Güncel çalışma ortamında doğrulandı')
          : (en ? 'Passed earlier; runtime changed since' : 'Daha önce geçti; çalışma ortamı değişti')}
      </span>
    </aside>
  );
}
