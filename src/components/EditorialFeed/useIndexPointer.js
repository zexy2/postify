import { useEffect } from 'react';

/**
 * Drives the evidence index on fine pointers: marks the row under the cursor
 * and eases a shared --px/--py/--rot onto the index so the hovered record's
 * cover trails the pointer and leans into its motion. Idle frames stop the loop.
 */
export default function useIndexPointer(ref, count) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !count) return undefined;
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let hot = null;
    let frame = 0;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0, rot: 0 };

    const paint = () => {
      const dx = target.x - pos.x;
      pos.x += dx * 0.14;
      pos.y += (target.y - pos.y) * 0.14;
      pos.rot += (Math.max(-9, Math.min(9, dx * 0.06)) - pos.rot) * 0.18;
      root.style.setProperty('--px', `${pos.x.toFixed(1)}px`);
      root.style.setProperty('--py', `${pos.y.toFixed(1)}px`);
      root.style.setProperty('--rot', `${pos.rot.toFixed(2)}deg`);
      const settled = Math.abs(dx) < 0.3 && Math.abs(target.y - pos.y) < 0.3 && Math.abs(pos.rot) < 0.05;
      frame = settled ? 0 : requestAnimationFrame(paint);
    };

    const setHot = (row) => {
      if (row === hot) return;
      hot?.removeAttribute('data-hot');
      hot = row;
      if (row) {
        row.setAttribute('data-hot', '');
        root.setAttribute('data-live', '');
      } else {
        root.removeAttribute('data-live');
      }
    };

    const move = (event) => {
      const box = root.getBoundingClientRect();
      target.x = event.clientX - box.left;
      target.y = event.clientY - box.top;
      if (!root.hasAttribute('data-live')) {
        // Appear where the pointer is instead of sliding in from the last exit.
        pos.x = target.x;
        pos.y = target.y;
      }
      setHot(event.target.closest?.('article') || null);
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const leave = () => setHot(null);

    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      setHot(null);
    };
  }, [ref, count]);
}
