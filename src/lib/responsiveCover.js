/**
 * Built-in editorial covers have responsive copies. Never synthesize a
 * srcSet for remote/customer-uploaded URLs (which have no such files).
 */
const LOCAL_COVER_PATH = /^\/images\/posts\/(ai-muhendisligi|edge-mimarileri|frontend-performansi|gelistirici-akisi|teknik-yazarlik|urun-tasarimi|urun-telemetrisi|web-standartlari)\.webp$/;

export function getResponsiveCoverSrcSet(src) {
  const match = typeof src === 'string' && LOCAL_COVER_PATH.exec(src);
  if (!match) return undefined;
  const path = `/images/posts/responsive/${match[1]}`;
  return `${path}-480.webp 480w, ${path}-800.webp 800w, ${src} 1200w`;
}
