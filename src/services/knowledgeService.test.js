import { beforeEach, describe, expect, it, vi } from 'vitest';

const chain = {};
for (const name of ['select', 'eq', 'order', 'limit', 'upsert', 'insert', 'delete', 'in']) chain[name] = vi.fn(() => chain);
chain.maybeSingle = vi.fn(async () => ({ data: null, error: null }));
chain.single = vi.fn(async () => ({ data: { result: 'worked' }, error: null }));
chain.then = (resolve) => resolve({ data: [], error: null });

const client = {
  from: vi.fn(() => chain),
  rpc: vi.fn(async () => ({ data: { id: 'g1' }, error: null })),
  auth: { getUser: vi.fn(async () => ({ data: { user: { id: 'u1' } }, error: null })) },
};

vi.mock('../lib/supabase', () => ({ requireSupabase: () => client }));
const { default: service } = await import('./knowledgeService');

describe('knowledgeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chain.maybeSingle.mockResolvedValue({ data: null, error: null });
  });

  it('returns an honest zero summary when none exists', async () => {
    expect((await service.getSummary('p1')).confirmation_count).toBe(0);
  });

  it('reads only the current user confirmation detail', async () => {
    await service.getMyConfirmation('p1');
    expect(client.from).toHaveBeenCalledWith('post_confirmations');
    expect(chain.eq).toHaveBeenCalledWith('post_id', 'p1');
    expect(chain.eq).toHaveBeenCalledWith('user_id', 'u1');
  });

  it('uses privacy-safe public failure aggregates', async () => {
    await service.getFailures('p1');
    expect(client.from).toHaveBeenCalledWith('post_failure_reports');
    expect(chain.select).toHaveBeenCalledWith('post_id,failure_count,last_failure_at');
  });

  it('loads author-only failure details through the identity-free rpc', async () => {
    await service.getAuthorFailureDetails('p1');
    expect(client.rpc).toHaveBeenCalledWith('get_post_failure_details', { target_post_id: 'p1' });
  });

  it('uses sanitized public revision history rather than raw snapshots', async () => {
    await service.getRevisions('p1');
    expect(client.from).toHaveBeenCalledWith('post_revision_history');
    expect(chain.select).toHaveBeenCalledWith('id,revision_number,reason,created_at');
  });

  it('rejects invalid confirmation results before a write', async () => {
    await expect(service.setConfirmation('p1', { result: 'maybe' })).rejects.toThrow('Invalid');
  });

  it('records an authenticated knowledge gap through the atomic rpc', async () => {
    await service.requestGap('React cache');
    expect(client.rpc).toHaveBeenCalledWith('request_knowledge_gap', { query_text: 'React cache' });
  });

  it('submits a sanitized authenticated correction without spoofing another user', async () => {
    chain.single.mockResolvedValueOnce({ data: { id: 'c1', status: 'pending' }, error: null });
    const result = await service.submitCorrection('p1', {
      kind: 'version',
      summary: ' Runtime version is stale ',
      proposedChange: ' Update the example to the maintained runtime release. ',
      environment: 'Node 22',
      sourceUrls: ['javascript:alert(1)', 'https://nodejs.org/en/about/previous-releases'],
    });
    expect(result.status).toBe('pending');
    expect(client.from).toHaveBeenCalledWith('post_correction_suggestions');
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({
      post_id: 'p1',
      user_id: 'u1',
      kind: 'version',
      source_urls: ['https://nodejs.org/en/about/previous-releases'],
    }));
  });

  it('rejects underspecified corrections before touching the database', async () => {
    await expect(service.submitCorrection('p1', { summary: 'short', proposedChange: 'also short' })).rejects.toThrow('summary');
  });

  it('resolves and withdraws corrections only through scoped RPCs', async () => {
    await service.withdrawCorrection('c1');
    expect(client.rpc).toHaveBeenCalledWith('withdraw_correction_suggestion', { target_suggestion_id: 'c1' });
    await service.resolveCorrection('c1', 'accepted', 'Will apply after review');
    expect(client.rpc).toHaveBeenCalledWith('resolve_correction_suggestion', expect.objectContaining({ target_suggestion_id: 'c1', decision: 'accepted' }));
  });

});
