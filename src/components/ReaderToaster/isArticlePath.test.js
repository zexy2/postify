import { describe, expect, it } from 'vitest';
import { isArticlePath } from './index.jsx';

describe('isArticlePath', () => {
  it('matches article routes with and without a trailing slash', () => {
    expect(isArticlePath('/posts/node-json-dogrulama')).toBe(true);
    expect(isArticlePath('/posts/node-json-dogrulama/')).toBe(true);
  });

  it('ignores the editor and non-article routes', () => {
    expect(isArticlePath('/posts/create')).toBe(false);
    expect(isArticlePath('/posts/create/')).toBe(false);
    expect(isArticlePath('/posts/')).toBe(false);
    expect(isArticlePath('/about/')).toBe(false);
  });
});
