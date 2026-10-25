/**
 * Application Entry Point
 * Configured with all providers
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
import SystemStatus from './components/SystemStatus';
import { store, persistor } from './store';
import { queryClient } from './lib/queryClient';
import SmoothScrollProvider from './providers/SmoothScrollProvider';
import ReaderToaster from './components/ReaderToaster';
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/source-serif-4/opsz.css';
import '@fontsource-variable/source-serif-4/opsz-italic.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-ext-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-ext-500.css';
import './lib/i18n'; // Initialize i18n
import './index.css';

// Keep bootstrap hydration in the same editorial system-state language as route transitions.
const LoadingScreen = () => <SystemStatus eyebrow="POSTIFY / LOADING" loading fullPage />;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <SmoothScrollProvider>
                <App />
              </SmoothScrollProvider>
              <ReaderToaster />
            </BrowserRouter>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
