import { describe, expect, it } from 'vitest';
import {
  FALLBACK_AUTHOR,
  getBuiltInKnowledgePost,
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


  it('exposes automatic checks as built-in verified knowledge, not outage fallback', () => {
    const builtIns = getBuiltInKnowledgePosts('tr');
    expect(builtIns).toHaveLength(1);
    expect(builtIns[0].slug).toBe('node-json-dogrulama');
    expect(builtIns[0].isFallback).toBe(false);
    expect(builtIns[0].isBuiltIn).toBe(true);
    expect(builtIns[0].source).toBe('built-in-verified');
    expect(getBuiltInKnowledgePost('node-json-dogrulama', 'en')?.autoVerificationId).toBe('node-json-parse-v1');
    expect(getBuiltInKnowledgePost('ai-muhendisligi', 'tr')).toBeNull();
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

