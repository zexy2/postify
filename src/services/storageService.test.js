import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storage, requireSupabase } from '../lib/supabase';
import { storageService } from './storageService';

vi.mock('../lib/supabase', () => ({
  storage: { upload: vi.fn(), getPublicUrl: vi.fn() },
  requireSupabase: vi.fn(),
}));

describe('storageService.uploadAvatar', () => {
  const image = new File(['image bytes'], 'photo.png', { type: 'image/png' });

  beforeEach(() => {
    vi.clearAllMocks();
    storage.upload.mockResolvedValue({ path: 'avatars/account-1.png' });
    storage.getPublicUrl.mockReturnValue('https://example.com/account-1.png');
  });

  it('returns the uploaded avatar URL without mutating the account profile directly', async () => {
    const publicUrl = await storageService.uploadAvatar(image, 'account-1');
    expect(publicUrl).toBe('https://example.com/account-1.png');
    expect(storage.upload).toHaveBeenCalledWith('avatars', 'avatars/account-1.png', image, {
      contentType: 'image/png',
      upsert: true,
    });
    expect(storage.getPublicUrl).toHaveBeenCalledWith('avatars', 'avatars/account-1.png');
    expect(requireSupabase).not.toHaveBeenCalled();
  });

  it('rejects unsupported avatar types before any remote operation', async () => {
    const invalid = new File(['bad'], 'bad.svg', { type: 'image/svg+xml' });
    await expect(storageService.uploadAvatar(invalid, 'account-1')).rejects.toThrow('Invalid file type');
    expect(storage.upload).not.toHaveBeenCalled();
    expect(requireSupabase).not.toHaveBeenCalled();
  });
});
