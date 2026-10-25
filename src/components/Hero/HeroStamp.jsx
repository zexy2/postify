import { useEffect, useId, useState } from 'react';
import { FiRotateCcw } from 'react-icons/fi';
import styles from './HeroStamp.module.css';

// Fixed splatter so every render (and every visual baseline) is identical.
const SPLATTER = [
  [-14, 36, 4.2], [-22, 52, 1.8], [168, 58, 3.4], [176, 74, 1.6], [140, 170, 3.8],
  [-4, 146, 2.2], [92, 184, 1.9],
];

/** A rubber stamp that presses real ink texture onto the page. */
export function HeroStamp({ verified, language, replayed = false }) {
  const uid = useId().replace(/:/g, '');
  const en = language?.startsWith('en');
  const ring = verified
    ? (en ? 'VERIFIED · REPRODUCIBLE · ' : 'DOĞRULANDI · TEKRARLANIR · ')
    : (en ? 'RECHECK · RUNTIME CHANGED · ' : 'YENİDEN KONTROL · ORTAM DEĞİŞTİ · ');

  return (
    <div className={styles.stamp} data-verified={verified || undefined} aria-hidden="true" style={replayed ? { '--press': '1560ms' } : undefined}>
      <svg viewBox="-40 -40 240 240" aria-hidden="true">
        <defs>
          {/* Rough rubber edge + uneven ink coverage */}
          <filter id={`ink${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="3" seed="3" result="blot" />
            <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.05" result="coverage" />
            <feComposite in="rough" in2="coverage" operator="in" />
          </filter>
          <path id={`ring${uid}`} d="M80 80m-59 0a59 59 0 1 1 118 0a59 59 0 1 1-118 0" />
        </defs>
        <g filter={`url(#ink${uid})`} className={styles.inked}>
          <circle cx="80" cy="80" r="76" className={styles.outer} />
          <circle cx="80" cy="80" r="46" className={styles.inner} />
          <text className={styles.ringText}><textPath href={`#ring${uid}`}>{ring}</textPath></text>
          {verified
            ? <path d="M60 82l14 14 28-32" className={styles.mark} />
            : <path d="M80 56v28M80 100v2" className={styles.mark} />}
          <g className={styles.splatter}>
            {SPLATTER.map(([x, y, r], index) => <circle key={index} cx={x} cy={y} r={r} style={{ '--d': `${index * 22}ms` }} />)}
          </g>
        </g>
      </svg>
    </div>
  );
}

const ageParts = (ms, en) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const units = en ? ['d', 'h', 'm', 's'] : ['g', 'sa', 'dk', 'sn'];
  const values = [Math.floor(total / 86400), Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60];
  const first = values.findIndex((value, index) => value > 0 || index === 3);
  return values.slice(first).map((value, index) => `${index ? String(value).padStart(2, '0') : value} ${units[first + index]}`).join(' ');
};

/** Real age of the published run, ticking once a second. */
function RunAge({ at, en }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const time = Date.parse(at);
  if (!Number.isFinite(time)) return null;
  return (
    <time className={styles.age} dateTime={at}>
      {en ? `ran ${ageParts(now - time, en)} ago` : `${ageParts(now - time, en)} önce çalıştı`}
    </time>
  );
}

/** One-line run of the published record, typed after the headline is verified. */
export function RunLine({ run, verified, language, onReplay, replayed = false }) {
  const en = language?.startsWith('en');
  if (!run) return null;
  const command = run.reproduceCommand || '';
  const hashesMatch = Boolean(run.codeSha256) && run.codeSha256 === run.artifactSha256;
  return (
    <div className={styles.run} data-verified={verified || undefined} style={replayed ? { '--t0': '-950ms' } : undefined}>
      <code className={styles.command} style={{ '--n': command.length + 2 }}>
        <span aria-hidden="true">$ </span>{command}
      </code>
      <span className={styles.out}>{run.actualStdout}</span>
      <span className={styles.caret} aria-hidden="true" />
      <span className={styles.facts}>
        <span>Node {run.runtimeVersion}</span>
        <span>{run.durationMs} ms</span>
        {hashesMatch && <span>{en ? 'hash matches' : 'hash eşleşti'}</span>}
        <RunAge at={run.verifiedAt} en={en} />
      </span>
      {onReplay && (
        <button type="button" className={styles.replay} onClick={onReplay} aria-label={en ? 'Replay the recorded run' : 'Kayıtlı çalıştırmayı tekrar oynat'}>
          <FiRotateCcw size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
