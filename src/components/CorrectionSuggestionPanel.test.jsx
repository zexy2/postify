import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from '../test/utils';
import CorrectionSuggestionPanel from './CorrectionSuggestionPanel';
import { useAuth } from '../hooks/useAuth';
import { useCorrections, useKnowledgeBackendStatus, useSubmitCorrection, useWithdrawCorrection } from '../hooks/useKnowledge';

vi.mock('../hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('../hooks/useKnowledge', () => ({
  useCorrections: vi.fn(),
  useKnowledgeBackendStatus: vi.fn(),
  useSubmitCorrection: vi.fn(),
  useWithdrawCorrection: vi.fn(),
}));

const post = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  authorId: 'author-1',
  isFallback: false,
};

const submitMutation = { mutateAsync: vi.fn(), isPending: false };
const withdrawMutation = { mutate: vi.fn(), isPending: false };

function setReady(value = true) {
  useKnowledgeBackendStatus.mockReturnValue({ data: { ready: value, features: { corrections: value } } });
}

function setReader({ authenticated = true, corrections = [] } = {}) {
  useAuth.mockReturnValue({ user: authenticated ? { id: 'reader-1' } : null, isAuthenticated: authenticated });
  useCorrections.mockReturnValue({ data: corrections });
  useSubmitCorrection.mockReturnValue(submitMutation);
  useWithdrawCorrection.mockReturnValue(withdrawMutation);
}

describe('CorrectionSuggestionPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    submitMutation.mutateAsync.mockResolvedValue({ id: 'c1', status: 'pending' });
    setReady(true);
    setReader();
  });

  it('stays hidden until the durable backend capability is ready', () => {
    setReady(false);
    const { container } = render(<CorrectionSuggestionPanel post={post} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('offers a sign-in path instead of pretending an anonymous proposal was sent', () => {
    setReader({ authenticated: false });
    render(<CorrectionSuggestionPanel post={post} />);
    expect(screen.getByRole('link', { name: /düzeltme önermek için giriş yap/i })).toHaveAttribute('href', '/auth/login');
  });

  it('submits a structured private correction for an authenticated reader', async () => {
    const user = userEvent.setup();
    render(<CorrectionSuggestionPanel post={post} />);
    await user.click(screen.getByRole('button', { name: /düzeltme öner/i }));
    await user.selectOptions(screen.getByLabelText(/tür/i), 'version');
    await user.type(screen.getByLabelText(/sorun ne/i), 'Node sürüm bilgisi artık eski');
    await user.type(screen.getByLabelText(/önerilen değişiklik/i), 'Örneği güncel LTS sürümünde yeniden çalıştır ve sürüm bilgisini güncelle.');
    await user.type(screen.getByLabelText(/ortam \/ sürüm/i), 'Node 22');
    await user.type(screen.getByLabelText(/kaynaklar/i), 'https://nodejs.org/en/about/previous-releases');
    await user.click(screen.getByRole('button', { name: /özel öneriyi gönder/i }));

    expect(submitMutation.mutateAsync).toHaveBeenCalledWith({
      kind: 'version',
      summary: 'Node sürüm bilgisi artık eski',
      proposedChange: 'Örneği güncel LTS sürümünde yeniden çalıştır ve sürüm bilgisini güncelle.',
      environment: 'Node 22',
      sourceUrls: ['https://nodejs.org/en/about/previous-releases'],
    });
    expect(await screen.findByRole('status')).toHaveTextContent(/yazara özel olarak gönderildi/i);
  });

  it('shows one pending proposal and withdraws it instead of allowing duplicate open proposals', async () => {
    const user = userEvent.setup();
    setReader({ corrections: [{ id: 'c1', user_id: 'reader-1', status: 'pending', summary: 'Bekleyen sürüm düzeltmesi' }] });
    render(<CorrectionSuggestionPanel post={post} />);
    expect(screen.queryByRole('button', { name: /^düzeltme öner$/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /geri çek/i }));
    expect(withdrawMutation.mutate).toHaveBeenCalledWith('c1');
  });
});
