import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const NARROW = '(max-width: 980px)';

// On narrow article pages the reading tools sit inline at the foot of the
// header; notices move under the masthead so they never cover those tools.
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
  const top = narrow && onArticle;

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
