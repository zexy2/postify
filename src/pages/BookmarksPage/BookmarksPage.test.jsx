import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BookmarksPage from './BookmarksPage';

const useBookmarksMock = vi.fn();
const importLegacy = vi.fn();
vi.mock('../../hooks/useBookmarks', () => ({ useBookmarks: () => useBookmarksMock() }));

describe('legacy device bookmarks import', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBookmarksMock.mockReturnValue({
      bookmarkedPosts: [], bookmarksCount: 0, legacyCount: 2, importLegacy,
      remove: vi.fn(), clearAll: vi.fn(),
    });
  });

  it('hides archived posts and requires explicit acknowledgment before import', () => {
    render(<MemoryRouter><BookmarksPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: '2 eski kayıt korunuyor' })).toBeVisible();
    expect(screen.getByText(/kime ait olduklarını belirleyemiyoruz/i)).toBeVisible();
    const button = screen.getByRole('button', { name: 'Bu hesaba aktar' });
    expect(button).toBeDisabled();
    expect(importLegacy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('checkbox', { name: /bana ait olduğunu doğruluyorum/i }));
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(importLegacy).toHaveBeenCalledTimes(1);
  });

  it('does not offer import when there are no ownerless records', () => {
    useBookmarksMock.mockReturnValue({
      bookmarkedPosts: [], bookmarksCount: 0, legacyCount: 0, importLegacy,
      remove: vi.fn(), clearAll: vi.fn(),
    });
    render(<MemoryRouter><BookmarksPage /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: 'Bu hesaba aktar' })).not.toBeInTheDocument();
  });
});
