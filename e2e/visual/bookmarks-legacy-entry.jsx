import React from 'react';
import ReactDOM from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookmarksPage from '../../src/pages/BookmarksPage/BookmarksPage';
import bookmarksReducer from '../../src/store/slices/bookmarksSlice';
import userReducer from '../../src/store/slices/userSlice';
import { getFallbackPosts } from '../../src/content/fallbackPosts';
import '../../src/lib/i18n';
import '../../src/index.css';

const userId = 'bookmark-legacy-visual-account';
const posts = getFallbackPosts('tr').slice(0, 2);
const ids = posts.map((post) => post.id);
const byId = Object.fromEntries(posts.map((post) => [post.id, post]));
const store = configureStore({
  reducer: { bookmarks: bookmarksReducer, user: userReducer },
  preloadedState: {
    user: {
      user: { id: userId }, session: { user: { id: userId } },
      isAuthenticated: true, isLoading: false, error: null, role: null,
    },
    bookmarks: {
      accounts: {},
      guest: { items: [], posts: {} },
      legacyUnassigned: { items: ids, posts: byId },
    },
  },
});
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <MemoryRouter initialEntries={['/bookmarks']}>
        <BookmarksPage />
      </MemoryRouter>
    </Provider>
  </QueryClientProvider>,
);
