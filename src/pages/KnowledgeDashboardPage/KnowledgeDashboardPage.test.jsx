import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import KnowledgeDashboardPage from './KnowledgeDashboardPage';

vi.mock('../../hooks/useKnowledge', () => ({
  useKnowledgeBackendStatus: () => ({ isLoading: true, data: undefined }),
  useAuthorDashboard: () => ({ isLoading: false, data: undefined }),
  useReverifyPost: () => ({ isPending: false, mutate: vi.fn() }),
}));

vi.mock('../../lib/domainCredibility', () => ({ getDomainCredibility: () => [] }));

describe('KnowledgeDashboardPage loading', () => {
  it('uses the shared busy status surface while account knowledge is loading', () => {
    render(<MemoryRouter><KnowledgeDashboardPage /></MemoryRouter>);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('heading', { name: /Bilgi sağlığı yükleniyor|Loading knowledge health/i })).toBeVisible();
  });

  it('shows actionable navigation without claiming unavailable backend access', () => {
    render(<MemoryRouter><KnowledgeDashboardPage dataOverride={{ posts: [], gaps: [] }} backendReadyOverride={false} /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Hesap senkronu henüz aktif değil|Account sync is not active/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /Profiline dön|Return to your profile/i })).toHaveAttribute('href', '/profile');
    expect(screen.getByRole('link', { name: /Bilgi arşivini keşfet|Explore the knowledge library/i })).toHaveAttribute('href', '/');
  });
});
