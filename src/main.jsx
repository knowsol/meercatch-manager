import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App';

// FOUC 방지 — 렌더링 전 테마 즉시 적용
(function () {
  const t = localStorage.getItem('mc_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
