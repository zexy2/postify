import { useEffect } from 'react';

/**
 * First scroll as one continuous story: the claim's words part, the stamp
 * lifts off the headline and lands on the full record below it.
 * GSAP is loaded only here, only when motion is allowed.
 */
export default function useHeroScrollScene(heroRef, enabled = true) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !enabled) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    let ctx;
    let cancelled = false;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const frame = hero.querySelector('[data-hero-frame]');
        const anchor = hero.querySelector('[data-stamp-anchor]');
        const target = hero.querySelector('[data-stamp-target]');
        const words = frame ? gsap.utils.toArray(frame.querySelectorAll('[data-word]')) : [];

        const scrub = { trigger: hero, start: 'top top', end: 'bottom 35%', scrub: 0.6, invalidateOnRefresh: true };

        // Words part away from the centre of the claim, farther the farther out they sit.
        if (words.length) {
          const offset = (word) => {
            const box = frame.getBoundingClientRect();
            const rect = word.getBoundingClientRect();
            return (rect.left + rect.width / 2 - (box.left + box.width / 2)) / (box.width / 2);
          };
          gsap.to(words, {
            x: (index) => offset(words[index]) * window.innerWidth * 0.22,
            yPercent: -14,
            opacity: 0.1,
            ease: 'none',
            scrollTrigger: scrub,
          });
        }

        // The stamp travels to the record it vouches for and lands as that
        // record reaches the upper third of the screen, beside the code it ran.
        // Phones have no free space beside the code, so the stamp stays with the headline there.
        if (anchor && target && window.matchMedia('(min-width: 641px)').matches) {
          // Untransformed, scroll-independent geometry (document coordinates).
          const measure = () => {
            const previous = anchor.style.transform;
            anchor.style.transform = 'none';
            const from = (anchor.firstElementChild || anchor).getBoundingClientRect();
            // Land in the empty right side of the executed code, never on the claim text.
            const to = (target.querySelector('[data-stamp-landing]') || target).getBoundingClientRect();
            anchor.style.transform = previous;
            return { from, to };
          };
          const delta = () => {
            const { from, to } = measure();
            return {
              x: to.right - from.width * 0.92 - from.left,
              y: to.top + to.height / 2 - from.height / 2 - from.top,
            };
          };
          gsap.set(anchor, { transformOrigin: () => `${measure().from.width * 0.44}px 50%` });
          gsap.timeline({
            scrollTrigger: { trigger: target, start: 'top bottom', end: 'top 30%', scrub: 0.6, invalidateOnRefresh: true },
          })
            .to(anchor, { y: () => delta().y * 0.25, rotate: -22, scale: 1.15, ease: 'power1.out', duration: 0.3 })
            .to(anchor, { x: () => delta().x, y: () => delta().y, rotate: 4, scale: 0.8, ease: 'power2.inOut', duration: 0.7 });
        }
      }, hero);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [heroRef, enabled]);
}
