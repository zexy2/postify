import { forwardRef } from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';

const preloaders = {
  post: () => import('../../pages/PostDetailPage'),
};

const canTransition = () => typeof document !== 'undefined'
  && typeof document.startViewTransition === 'function'
  && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * A Link that morphs the clicked record's title and cover into the next page
 * with the native View Transitions API. Falls back to a plain navigation.
 */
const TransitionLink = forwardRef(({ to, preload = 'post', onClick, ...props }, ref) => {
  const navigate = useNavigate();

  const handleClick = async (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!canTransition()) return;
    event.preventDefault();

    const scope = event.currentTarget.closest('[data-vt-scope]') || event.currentTarget;
    const named = [
      [scope.querySelector('[data-vt="title"]'), 'post-title'],
      [scope.querySelector('[data-vt="cover"]'), 'post-cover'],
    ].filter(([element]) => element);

    // Fetch the destination chunk first so the snapshot never captures a loader.
    try { await preloaders[preload]?.(); } catch { /* navigate anyway */ }

    named.forEach(([element, name]) => { element.style.viewTransitionName = name; });
    const transition = document.startViewTransition(() => {
      named.forEach(([element]) => { element.style.viewTransitionName = ''; });
      flushSync(() => navigate(to));
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    transition.finished.finally(() => {
      named.forEach(([element]) => { element.style.viewTransitionName = ''; });
    });
  };

  return <Link ref={ref} to={to} onClick={handleClick} {...props} />;
});

TransitionLink.displayName = 'TransitionLink';

export default TransitionLink;
