import { useId } from 'react';
import { getPostType, getPostReadingMinutes } from '../../lib/postPresentation';
import { getKnowledgeEvidence } from '../../lib/knowledgeEvidence';
import { useAutoVerification } from '../../hooks/useAutoVerification';
import styles from './EvidenceCover.module.css';

// Deterministic PRNG seeded from the post identity: the same post always
// draws the same figure, different posts never share one.
const seeded = (key) => {
  let h = 2166136261;
  for (const ch of String(key)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

const W = 400;
const H = 300;
const pad = 36;

// Guide: a staircase of steps toward the outcome.
const guidePath = (rand) => {
  const steps = 4 + Math.floor(rand() * 3);
  const dx = (W - pad * 2 - 40) / steps;
  const dy = (H - pad * 2 - 70) / steps;
  let x = pad;
  let y = H - pad - 46;
  const points = [[x, y]];
  const nodes = [];
  for (let i = 0; i < steps; i += 1) {
    x += dx * (0.8 + rand() * 0.4);
    points.push([x, y]);
    nodes.push([x, y]);
    y -= dy * (0.75 + rand() * 0.5);
    points.push([x, y]);
  }
  return { main: [points], ghosts: [], nodes, end: points[points.length - 1] };
};

// Decision: options fan out; one survives, the rest end where they were ruled out.
const decisionPath = (rand) => {
  const origin = [pad, H / 2 + 6];
  const fork = [pad + 70 + rand() * 30, H / 2 + 6];
  const count = 3 + Math.floor(rand() * 2);
  const chosen = Math.floor(rand() * count);
  const ghosts = [];
  let main = null;
  let end = null;
  for (let i = 0; i < count; i += 1) {
    const ty = pad + 18 + (i * (H - pad * 2 - 70)) / (count - 1);
    const reach = i === chosen ? W - pad - 22 : fork[0] + 80 + rand() * 120;
    const mid = [fork[0] + (reach - fork[0]) * 0.45, ty];
    const line = [fork, mid, [reach, ty]];
    if (i === chosen) { main = [[origin, ...line]]; end = [reach, ty]; } else ghosts.push(line);
  }
  return { main, ghosts, nodes: [fork], end };
};

// Explainer: one central concept, satellites joined to it.
const explainerPath = (rand) => {
  const center = [W * 0.44 + rand() * 30, H * 0.44];
  const count = 5 + Math.floor(rand() * 3);
  const ghosts = [];
  const nodes = [];
  let end = null;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 + rand() * 0.5;
    const r = 70 + rand() * 46;
    const p = [center[0] + Math.cos(angle) * r * 1.35, center[1] + Math.sin(angle) * r * 0.8];
    if (i === 0) end = p;
    ghosts.push([center, p]);
    nodes.push(p);
  }
  return { main: [[center, end]], ghosts: ghosts.slice(1), nodes, end, hub: center };
};

// Field note: a measured trace over time with the incident that taught the lesson.
const fieldPath = (rand) => {
  const n = 22;
  const points = [];
  const spike = 8 + Math.floor(rand() * 8);
  for (let i = 0; i <= n; i += 1) {
    const x = pad + (i * (W - pad * 2 - 20)) / n;
    const base = H * 0.52 + Math.sin(i * 0.7 + rand()) * 12 + (rand() - 0.5) * 14;
    const y = i === spike ? pad + 46 : i === spike + 1 ? H * 0.64 : base - (i > spike ? (i - spike) * 2.2 : 0);
    points.push([x, y]);
  }
  return { main: [points], ghosts: [], nodes: [points[spike]], end: points[points.length - 1] };
};

const builders = { guide: guidePath, decision: decisionPath, explainer: explainerPath, fieldNote: fieldPath };
const toD = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

const stateOf = (post, override, auto) => {
  if (override) return override;
  if (auto === 'verified') return 'verified';
  if (auto === 'recheck-required') return 'recheck';
  const level = post.evidence?.level || 'unverified';
  if (getKnowledgeEvidence(post).freshness === 'stale') return 'recheck';
  if (level === 'postify-verified') return 'verified';
  if (level === 'author-tested') return 'tested';
  return 'unverified';
};

/**
 * Generated cover drawn from a post's own record: shape = content type,
 * terminal mark = evidence state, ruler = reading minutes.
 */
export default function EvidenceCover({ post, state: stateOverride, className = '', label, typeLabel, poster = true }) {
  const uid = useId().replace(/:/g, '');
  const { state: autoState } = useAutoVerification(post.autoVerificationId);
  const type = getPostType(post);
  const rand = seeded(post.slug || post.id || post.title);
  const figure = (builders[type] || fieldPath)(rand);
  const state = stateOf(post, stateOverride, autoState?.status);
  const minutes = Math.min(getPostReadingMinutes(post) || 5, 20);
  const [ex, ey] = figure.end;

  return (
    <svg
      className={`${styles.cover} ${className}`}
      data-state={state}
      data-type={type}
      data-poster={poster || undefined}
      viewBox={`0 0 ${W} ${H}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={`g${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" className={styles.grid} />
        </pattern>
      </defs>
      <rect width={W} height={H} className={styles.paper} />
      <rect width={W} height={H} fill={`url(#g${uid})`} />

      {figure.ghosts.map((line, i) => <path key={`g${i}`} d={toD(line)} className={styles.ghost} />)}
      {figure.main.map((line, i) => <path key={`m${i}`} d={toD(line)} className={styles.trace} pathLength="1" />)}
      {figure.hub && <circle cx={figure.hub[0]} cy={figure.hub[1]} r="9" className={styles.hub} />}
      {figure.nodes.map(([x, y], i) => <circle key={`n${i}`} cx={x} cy={y} r="3.5" className={styles.node} style={{ '--i': i }} />)}

      <g transform={`translate(${ex} ${ey})`}>
        <g className={styles.terminal}>
          <circle r="17" className={styles.terminalRing} />
          {state === 'verified' && <path d="M-7 0l5 5 9-10" className={styles.terminalMark} />}
          {state === 'tested' && <path d="M-6 0l4 4 8-9" className={styles.terminalMark} />}
          {state === 'recheck' && <path d="M0 -8v9M0 6v1" className={styles.terminalMark} />}
        </g>
      </g>

      {poster && typeLabel && <text className={styles.posterLabel} x={pad - 14} y={H - 30}>{typeLabel}</text>}
      {poster && <text className={styles.posterMinutes} x={W - pad + 14} y={pad + 18} textAnchor="end">{minutes}′</text>}

      <g className={styles.ruler} transform={`translate(${pad} ${H - 18})`}>
        {Array.from({ length: 20 }, (_, i) => (
          <line key={i} x1={i * 12} x2={i * 12} y1={i % 5 === 0 ? -8 : -4} y2="0" data-on={i < minutes ? 'true' : undefined} style={{ '--i': i }} />
        ))}
      </g>
    </svg>
  );
}
