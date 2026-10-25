import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Builds the first-scroll scene; split out so it ships with GSAP, not the entry chunk. */
export default function buildHeroScrollScene(hero) {
  gsap.registerPlugin(ScrollTrigger);

  return gsap.context(() => {
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
}
