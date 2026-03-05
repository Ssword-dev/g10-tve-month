import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './tailwind.css';
import App from './App.tsx';
import {
  initializeContrastLevel,
  initializeFontSize,
  initializeThemeMode,
} from './domain/theme/settings.ts';

initializeThemeMode();
initializeFontSize();
initializeContrastLevel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
