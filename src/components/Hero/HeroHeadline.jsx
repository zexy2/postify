import { useEffect, useMemo, useRef } from 'react';
import { getVerificationCheck } from '../../content/verificationManifest';
import styles from './HeroHeadline.module.css';

const words = (text) => String(text).split(/\s+/).filter(Boolean);

const Line = ({ text, className, after = null }) => (
  <>
    {words(text).map((word, index, list) => (
      <span key={`${word}-${index}`}>
        <span className={styles.word} style={{ '--i': index }}>
          <span className={className}>{word}</span>
        </span>
        {index < list.length - 1 ? ' ' : after}
      </span>
    ))}
  </>
);

/**
 * Headline as a claim under test: it rises in outline, a scan line fills it
 * with ink, and a loupe lets the reader see the actual work beneath the words.
 */
export default function HeroHeadline({ text, className = '', run, language, stamp = null, onActivate }) {
  const frameRef = useRef(null);
  const activateRef = useRef(onActivate);
  useEffect(() => { activateRef.current = onActivate; });
  const isEnglish = language?.startsWith('en');
  const check = getVerificationCheck(run?.id || 'node-json-parse-v1');

  // The material under the words is the real record: code, command, output, hash.
  const evidence = useMemo(() => {
    const lines = [
      ...String(check?.code || '').split('\n'),
      `$ ${run?.reproduceCommand || check?.reproduceCommand || ''}`,
      `> ${run?.actualStdout || check?.expectedStdout || ''}`,
      run?.runtimeVersion ? `node ${run.runtimeVersion}  ${run.durationMs} ms` : '',
      run?.codeSha256 ? `sha256 ${run.codeSha256}` : '',
    ].filter(Boolean);
    // One dense sheet of the record, repeated to fill any loupe position.
    return Array.from({ length: 14 }, () => lines.join('   ')).join('   ');
  }, [check, run]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const fine = window.matchMedia?.('(pointer: fine)').matches;

    let raf = 0;
    let sweep = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    const place = () => {
      frame.style.setProperty('--lx', `${current.x}px`);
      frame.style.setProperty('--ly', `${current.y}px`);
    };
    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      place();
      raf = Math.abs(target.x - current.x) > 0.3 || Math.abs(target.y - current.y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };

    // One guided pass across the headline so the reader learns the loupe exists.
    const runSweep = () => {
      cancelAnimationFrame(sweep);
      const box = frame.getBoundingClientRect();
      const start = performance.now();
      const duration = 1500;
      // The pass ends where the stamp lands, so the press reads as its verdict.
      const anchor = frame.querySelector(`.${styles.stampAnchor} > *`)?.getBoundingClientRect();
      const from = { x: box.width * 0.08, y: box.height * 0.3 };
      const to = anchor
        ? { x: anchor.left + anchor.width / 2 - box.left, y: anchor.top + anchor.height / 2 - box.top }
        : { x: box.width * 0.92, y: box.height * 0.68 };
      frame.dataset.lens = 'sweep';
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        current = {
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e - Math.sin(e * Math.PI) * box.height * 0.18,
        };
        target = { ...current };
        place();
        if (t < 1) sweep = requestAnimationFrame(step);
        else if (frame.dataset.lens === 'sweep') delete frame.dataset.lens;
      };
      sweep = requestAnimationFrame(step);
    };
    const intro = window.setTimeout(runSweep, 1150);

    const move = (event) => {
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(sweep);
      const box = frame.getBoundingClientRect();
      target = { x: event.clientX - box.left, y: event.clientY - box.top };
      if (frame.dataset.lens !== 'on') { if (frame.dataset.lens !== 'sweep') current = { ...target }; frame.dataset.lens = 'on'; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => { if (frame.dataset.lens === 'on') delete frame.dataset.lens; };
    const tap = () => {
      runSweep();
      activateRef.current?.();
    };

    if (fine) {
      frame.addEventListener('pointermove', move);
      frame.addEventListener('pointerleave', leave);
    }
    frame.addEventListener('pointerup', tap);
    return () => {
      window.clearTimeout(intro);
      frame.removeEventListener('pointermove', move);
      frame.removeEventListener('pointerleave', leave);
      frame.removeEventListener('pointerup', tap);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sweep);
    };
  }, []);

  return (
    <div ref={frameRef} className={styles.frame}>
      <h1 className={`${className} ${styles.ink}`}>
        <Line text={text} className={styles.wordInner} after={stamp && <span className={styles.stampAnchor} aria-hidden="true">{stamp}</span>} />
      </h1>
      <span className={`${className} ${styles.outline}`} aria-hidden="true"><Line text={text} className={styles.wordInner} /></span>
      <span className={styles.scan} aria-hidden="true" />

      <span className={styles.lens} aria-hidden="true">
        <span className={styles.lensEvidence}>
          {evidence}
        </span>
        <span className={`${className} ${styles.lensOutline}`}><Line text={text} /></span>
      </span>
      <span className={styles.loupe} aria-hidden="true">
        <span>{isEnglish ? 'the work · click to replay' : 'işin kendisi · tıkla, oynat'}</span>
      </span>
    </div>
  );
}
