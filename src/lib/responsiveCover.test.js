import { describe, expect, it } from 'vitest';
import { getResponsiveCoverSrcSet } from './responsiveCover';

describe('editorial responsive cover mapping', () => {
  it('maps the known local cover to 480/800/original descriptors', () => {
    expect(getResponsiveCoverSrcSet('/images/posts/ai-muhendisligi.webp')).toBe(
      '/images/posts/responsive/ai-muhendisligi-480.webp 480w, '
      + '/images/posts/responsive/ai-muhendisligi-800.webp 800w, '
      + '/images/posts/ai-muhendisligi.webp 1200w',
    );
  });

  it('preserves remote uploads and ungenerated local covers', () => {
    expect(getResponsiveCoverSrcSet('https://cdn.example.com/cover.webp')).toBeUndefined();
    expect(getResponsiveCoverSrcSet('/images/posts/new-story.webp')).toBeUndefined();
    expect(getResponsiveCoverSrcSet(undefined)).toBeUndefined();
    expect(getResponsiveCoverSrcSet('/images/posts/../secrets.webp')).toBeUndefined();
  });
});
