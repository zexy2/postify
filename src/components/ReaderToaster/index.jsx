import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const NARROW = '(max-width: 980px)';

// On narrow article pages the reading tools sit inline in the page, so where
// they land on screen depends on the article and the scroll position. Notices
// take whichever edge of the viewport the tools are not on.
export default function ReaderToaster() {
  const { pathname } = useLocation();
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(NARROW).matches);

  useEffect(() => {
    const query = window.matchMedia?.(NARROW);
    if (!query) return undefined;
    const update = () => setNarrow(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const onArticle = /^\/posts\/(?!create$)[^/]+$/.test(pathname);
  const avoid = narrow && onArticle;
  const [toolsHigh, setToolsHigh] = useState(true);

  useEffect(() => {
    if (!avoid) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const tools = document.querySelector('[data-mobile-article-tools]');
      if (!tools) return;
      const box = tools.getBoundingClientRect();
      setToolsHigh(box.top + box.height / 2 < window.innerHeight / 2);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // The article mounts after the route change; measure again once it exists.
    const late = window.setTimeout(measure, 400);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(late);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [avoid, pathname]);

  const top = avoid && !toolsHigh;

  return (
    <Toaster
      position={top ? 'top-center' : 'bottom-right'}
      containerStyle={top
        ? { top: 'calc(var(--header-height) + 12px)' }
        : { bottom: 'var(--toast-bottom-offset, 1rem)' }}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: 'min(420px, calc(100vw - 2rem))',
          padding: '12px 14px',
        },
        success: { iconTheme: { primary: 'var(--primary)', secondary: 'var(--primary-contrast)' } },
        error: { iconTheme: { primary: 'var(--error)', secondary: 'var(--primary-contrast)' } },
      }}
    />
  );
}
