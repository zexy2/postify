import { describe, expect, it } from 'vitest';
import { formatPostDate, getPostPresentation, getPostReadingMinutes, getPostType } from './postPresentation';

describe('postPresentation', () => {
  it('uses an explicit supported content type', () => {
    expect(getPostType({ contentType: 'decision' })).toBe('decision');
  });

  it('derives a guide from practical frontend content', () => {
    expect(getPostType({ category: 'Frontend', title: 'Performans rehberi' })).toBe('guide');
  });

  it('falls back safely for unknown content', () => {
    expect(getPostType({ category: 'Diğer', title: 'Bir not' })).toBe('fieldNote');
  });

  it('prefers a meaningful update over publication date', () => {
    const result = getPostPresentation({
      publishedAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-03T10:00:00.000Z',
      excerpt: 'Outcome',
    }, 'tr');
    expect(result.dateLabel).toBe('Son güncelleme');
    expect(result.dateValue).toBe('2026-08-03T10:00:00.000Z');
    expect(result.outcome).toBe('Outcome');
  });

  it('prefers review metadata when present', () => {
    const result = getPostPresentation({
      publishedAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-03T10:00:00.000Z',
      lastReviewedAt: '2026-08-04T10:00:00.000Z',
    }, 'en');
    expect(result.dateLabel).toBe('Last editor review');
    expect(result.dateValue).toBe('2026-08-04T10:00:00.000Z');
  });

  it('derives reading minutes when API metadata is missing', () => {
    expect(getPostReadingMinutes({ body: 'word '.repeat(440) })).toBe(2);
    expect(getPostReadingMinutes({ readingTime: 4, body: 'word '.repeat(2000) })).toBe(4);
    expect(getPostReadingMinutes({})).toBeNull();
  });

  it('returns an empty string for invalid dates', () => {
    expect(formatPostDate('not-a-date', 'tr')).toBe('');
  });

  it('preserves locale-specific date output across repeated metadata renders', () => {
    const timestamp = '2026-08-28T12:00:00.000Z';
    const tr = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(timestamp));
    const en = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(timestamp));
    for (let index = 0; index < 12; index += 1) {
      expect(formatPostDate(timestamp, 'tr')).toBe(tr);
      expect(formatPostDate(timestamp, 'en')).toBe(en);
    }
  });
});
