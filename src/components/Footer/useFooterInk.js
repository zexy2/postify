import { useEffect } from 'react';

/**
 * Footer statement ink: --fill tracks how far the footer has risen into view
 * (the heading inks from the bottom up), --mx/--my/--lamp let a fine pointer
 * ink the letters under it, and --page drives the back-to-top progress ring.
 */
export default function useFooterInk(footerRef, titleRef) {
  useEffect(() => {
    const footer = footerRef.current;
    const title = titleRef.current;
    if (!footer || !title) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      footer.style.setProperty('--page', String(max > 0 ? Math.min(1, scrollY / max) : 1));
      if (reduce) return;
      const box = title.getBoundingClientRect();
      // 0 while the title's top enters the bottom edge, 1 once it reaches 40% of the viewport.
      const t = (innerHeight - box.top) / Math.max(1, innerHeight * 0.6 + box.height * 0.4);
      footer.style.setProperty('--fill', Math.max(0, Math.min(1, t)).toFixed(3));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };

    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches && !reduce;
    const move = (event) => {
      const box = title.getBoundingClientRect();
      title.style.setProperty('--mx', `${event.clientX - box.left}px`);
      title.style.setProperty('--my', `${event.clientY - box.top}px`);
      title.setAttribute('data-lamp', '');
    };
    const leave = () => title.removeAttribute('data-lamp');

    measure();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    if (fine) {
      title.addEventListener('pointermove', move);
      title.addEventListener('pointerleave', leave);
    }
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      title.removeEventListener('pointermove', move);
      title.removeEventListener('pointerleave', leave);
    };
  }, [footerRef, titleRef]);
}
