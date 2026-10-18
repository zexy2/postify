import { useEffect, useLayoutEffect, useRef } from 'react';

const readAbsoluteTop = (selector) => {
  const element = document.querySelector(selector);
  if (!element) return null;
  return element.getBoundingClientRect().top + window.scrollY;
};

/**
 * Keep a reader's position as cached articles are replaced by live content.
 * Observe actual layout changes instead of reading geometry on every frame
 * throughout a potentially indefinite offline/fallback session.
 * Browsers without ResizeObserver retain the original polling fallback.
 */

export function useScrollAnchorTransition({ active, selector }) {
  const anchorRef = useRef({ active, absoluteTop: null });

  useLayoutEffect(() => {
    // No viewport anchoring is needed while the reader is at the top. Avoid
    // forcing a synchronous layout during the initial home React commit;
    // observer/scroll tracking captures the position when scrolling begins.
    if (window.scrollY <= 1) {
      anchorRef.current = { active, absoluteTop: null };
      return;
    }
    const absoluteTop = readAbsoluteTop(selector);
    if (absoluteTop === null) return;

    const previous = anchorRef.current;
    if (previous.active && !active && previous.absoluteTop !== null && window.scrollY > 1) {
      const delta = absoluteTop - previous.absoluteTop;
      if (Math.abs(delta) > 0.5) {
        window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
      }
    }

    anchorRef.current = { active, absoluteTop };
  }, [active, selector]);

  useEffect(() => {
    if (!active) return undefined;

    let frame = 0;
    const measure = () => {
      // No need to preserve the viewport when the reader is at the top.
      if (window.scrollY <= 1) return;
      const absoluteTop = readAbsoluteTop(selector);
      if (absoluteTop !== null) anchorRef.current = { active: true, absoluteTop };
    };

    if (typeof ResizeObserver === 'function') {
      const anchor = document.querySelector(selector);
      const observer = new ResizeObserver(() => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(measure);
      });
      const seen = new Set();
      const watch = (node) => {
        if (node && !seen.has(node)) {
          observer.observe(node);
          seen.add(node);
        }
      };
      watch(document.body);
      watch(anchor?.parentElement);
      watch(anchor);
      // Resizing a prior sibling moves the feed even if the feed itself
      // remains unchanged: observe all preceding editorial sections.
      for (let sibling = anchor?.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
        watch(sibling);
      }
      measure();

      const onScroll = () => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(measure);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      document.fonts?.addEventListener?.('loadingdone', onScroll);
      return () => {
        observer.disconnect();
        window.cancelAnimationFrame(frame);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        document.fonts?.removeEventListener?.('loadingdone', onScroll);
      };
    }

    // Older browsers preserve the original requestAnimationFrame behavior.
    const track = () => {
      measure();
      frame = window.requestAnimationFrame(track);
    };
    track();
    return () => window.cancelAnimationFrame(frame);
  }, [active, selector]);
}

export default useScrollAnchorTransition;
