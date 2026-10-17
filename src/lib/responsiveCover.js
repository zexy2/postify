/**
 * Built-in editorial covers have responsive copies. Never synthesize a
 * srcSet for remote/customer-uploaded URLs (which have no such files).
 */
const LOCAL_COVERS = new Set([
  'ai-muhendisligi',
  'edge-mimarileri',
  'frontend-performansi',
  'gelistirici-akisi',
  'teknik-yazarlik',
  'urun-tasarimi',
  'urun-telemetrisi',
  'web-standartlari',
]);

export function getResponsiveCoverSrcSet(src) {
  if (typeof src !== 'string') return undefined;
  const match = /^\/images\/posts\/([a-z0-9-]+)\.webp$/.exec(src);
  if (!match || !LOCAL_COVERS.has(match[1])) return undefined;

  const stem = match[1];
  return [
    `/images/posts/responsive/${stem}-480.webp 480w`,
    `/images/posts/responsive/${stem}-800.webp 800w`,
    `${src} 1200w`,
  ].join(', ');
}
