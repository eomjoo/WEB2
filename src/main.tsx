import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter 추가
import './index.css';
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Ensure your index.html has a <div id="root"></div>.');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* BrowserRouter로 App을 감싸고 basename을 설정 */}
    <BrowserRouter basename="/WEB2/"> {/* 'WEB2'를 본인의 GitHub 리포지토리 이름으로 변경 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
