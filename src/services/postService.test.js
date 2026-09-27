import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireSupabase = vi.fn(() => {
  throw new Error('Supabase unavailable');
});

vi.mock('../lib/supabase', () => ({ requireSupabase }));
vi.mock('../lib/knowledgeBackendStatus', () => ({ getKnowledgeBackendStatus: vi.fn(async () => ({ ready: true })) }));

const { default: postService, normalizeCoverImageUrl, getPostFieldsForCapability, isUuidPostIdentifier, mergeBuiltInKnowledge } = await import('./postService');

describe('postService public fallback', () => {
  beforeEach(() => {
    requireSupabase.mockReset();
    requireSupabase.mockImplementation(() => { throw new Error('Supabase unavailable'); });
  });

  it('maps legacy local jpg covers to shipped webp assets', () => {
    expect(normalizeCoverImageUrl('/images/posts/ai-muhendisligi.jpg')).toBe('/images/posts/ai-muhendisligi.webp');
    expect(normalizeCoverImageUrl('/images/posts/frontend-performansi.jpeg')).toBe('/images/posts/frontend-performansi.webp');
    expect(normalizeCoverImageUrl('/remote/cover.jpg')).toBe('/remote/cover.jpg');
  });

  it('keeps the public list available when Supabase is unavailable', async () => {
    const posts = await postService.getAll({ locale: 'en' });

    expect(posts).toHaveLength(9);
    expect(posts[0].isFallback).toBe(true);
    expect(posts[0].title).toBe('An AI feature is a system, not a model call');
  });

  it('surfaces a service failure for unknown details that have no local fallback', async () => {
    await expect(postService.getById('live-only-story', 'en')).rejects.toThrow('Supabase unavailable');
  });

  it('returns built-in verified detail when healthy Supabase has no matching row', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    requireSupabase.mockReturnValueOnce({ from: vi.fn(() => ({ select })) });

    const post = await postService.getById('node-json-dogrulama', 'tr');
    expect(post.slug).toBe('node-json-dogrulama');
    expect(post.source).toBe('built-in-verified');
    expect(post.isFallback).toBe(false);
    expect(post.autoVerificationId).toBe('node-json-parse-v1');
  });

  it('keeps detail, author posts, and stats available offline', async () => {
    const post = await postService.getById('ai-muhendisligi', 'tr');
    const authorPosts = await postService.getByUserId('fallback-editor', 'tr');
    const aliasedAuthorPosts = await postService.getByUserId('postify', 'en');
    const stats = await postService.getStats();

    expect(post.isFallback).toBe(true);
    expect(authorPosts).toHaveLength(9);
    expect(aliasedAuthorPosts).toHaveLength(9);
    expect(aliasedAuthorPosts[0].author.name).toBe('Postify Editor');
    expect(stats).toEqual({ posts: 9, authors: 1, comments: 0, isFallback: true });
  });
});

describe('Verified Knowledge schema compatibility', () => {
  it('chooses legacy fields before migration so public reads do not generate avoidable 400s', () => {
    expect(getPostFieldsForCapability(false)).not.toContain('evidence_status');
    expect(getPostFieldsForCapability(false)).not.toContain('content_type');
    expect(getPostFieldsForCapability(true)).toContain('evidence_status');
    expect(getPostFieldsForCapability(true)).toContain('content_type');
    expect(getPostFieldsForCapability(true)).not.toContain('canonical_source_url');
    expect(getPostFieldsForCapability(true, true)).toContain('canonical_source_url');
  });


  it('never sends a non-UUID slug to the UUID id lookup path', () => {
    expect(isUuidPostIdentifier('node-json-dogrulama')).toBe(false);
    expect(isUuidPostIdentifier('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')).toBe(true);
  });


  it('keeps release-owned verified knowledge alongside healthy Supabase posts without duplicate slugs', () => {
    const remote = [{ id: 'remote-1', slug: 'ai-muhendisligi', title: 'Remote', publishedAt: '2026-08-07T00:00:00Z', source: 'supabase' }];
    const merged = mergeBuiltInKnowledge(remote, 'tr');
    expect(merged.some((post) => post.slug === 'node-json-dogrulama' && post.source === 'built-in-verified')).toBe(true);
    expect(merged.filter((post) => post.slug === 'ai-muhendisligi')).toHaveLength(1);
  });

  it('applies discovery search to built-in verified knowledge too', () => {
    expect(mergeBuiltInKnowledge([], 'tr', 'Node.js').map((post) => post.slug)).toEqual(['node-json-dogrulama']);
    expect(mergeBuiltInKnowledge([], 'tr', 'olmayan terim')).toEqual([]);
  });

  it('recognizes additive-schema absence without treating unrelated errors as migration state', async () => {
    const { isKnowledgeSchemaMissing } = await import('./postService');
    expect(isKnowledgeSchemaMissing({ code: '42703', message: 'column evidence_status does not exist' })).toBe(true);
    expect(isKnowledgeSchemaMissing({ code: 'PGRST205', message: 'post_evidence_summary missing' })).toBe(true);
    expect(isKnowledgeSchemaMissing({ code: 'PGRST204', message: 'canonical_source_url missing' })).toBe(true);
    expect(isKnowledgeSchemaMissing({ code: '42501', message: 'permission denied' })).toBe(false);
  });
});
