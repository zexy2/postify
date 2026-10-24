import { describe, expect, it } from 'vitest';
import {
  FALLBACK_AUTHOR,
  getBuiltInKnowledgePosts,
  getFallbackPost,
  getFallbackPosts,
  getFallbackStats,
  getFallbackUserPosts,
} from './fallbackPosts';

describe('fallback public catalogue', () => {
  it('contains a complete Turkish and English reading catalogue', () => {
    const turkishPosts = getFallbackPosts('tr');
    const englishPosts = getFallbackPosts('en');

    expect(turkishPosts).toHaveLength(9);
    expect(englishPosts).toHaveLength(9);
    expect(turkishPosts.every((post) => post.isFallback && post.coverImageUrl && post.slug)).toBe(true);
    expect(englishPosts[0].title).toBe('An AI feature is a system, not a model call');
    expect(turkishPosts[0].author.id).toBe(FALLBACK_AUTHOR.id);
  });


  it('keeps localized article outcomes in the reader’s chosen language', () => {
    const english = getFallbackPosts('en');
    const turkish = getFallbackPosts('tr');
    const aiEnglish = english.find((post) => post.slug === 'ai-muhendisligi');
    const aiTurkish = turkish.find((post) => post.slug === 'ai-muhendisligi');
    expect(aiEnglish.outcome).toBe('Design AI as a measurable and safe product system, not just a model call.');
    expect(aiTurkish.outcome).toContain('model çağrısı yerine');
    expect(english.find((post) => post.slug === 'node-json-dogrulama').outcome)
      .toContain('Parse incoming JSON');
    expect(english.every((post) => post.outcome)).toBe(true);
  });

  it('exposes automatic checks as built-in verified knowledge, not outage fallback', () => {
    const builtIns = getBuiltInKnowledgePosts('tr');
    expect(builtIns).toHaveLength(1);
    expect(builtIns[0].slug).toBe('node-json-dogrulama');
    expect(builtIns[0].isFallback).toBe(false);
    expect(builtIns[0].source).toBe('built-in-verified');
    const englishBuiltIns = getBuiltInKnowledgePosts('en');
    expect(englishBuiltIns.find((post) => post.slug === 'node-json-dogrulama')?.autoVerificationId).toBe('node-json-parse-v1');
    expect(builtIns.find((post) => post.slug === 'ai-muhendisligi')).toBeUndefined();
  });

  it('resolves a post by slug and keeps unknown posts absent', () => {
    expect(getFallbackPost('frontend-performansi', 'tr').title).toContain('Frontend performansı');
    expect(getFallbackPost('not-a-real-post', 'tr')).toBeNull();
  });

  it('provides honest fallback stats and author posts', () => {
    expect(getFallbackStats()).toEqual({ posts: 9, authors: 1, comments: 0, isFallback: true });
    expect(getFallbackUserPosts(FALLBACK_AUTHOR.id, 'en')).toHaveLength(9);
    expect(getFallbackUserPosts('another-user', 'en')).toEqual([]);
  });
});

