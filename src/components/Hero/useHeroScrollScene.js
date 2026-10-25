import { useEffect } from 'react';

/**
 * First scroll as one continuous story: the claim's words part, the stamp
 * lifts off the headline and lands on the full record below it.
 * The scene (and GSAP with it) is loaded only here, only when motion is allowed.
 */
export default function useHeroScrollScene(heroRef, enabled = true) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !enabled) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    let ctx;
    let cancelled = false;

    import('./heroScrollScene').then(({ default: build }) => {
      if (!cancelled) ctx = build(hero);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [heroRef, enabled]);
}
