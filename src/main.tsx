import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Ensure your index.html has a <div id="root"></div>.');
}

const basename = import.meta.env.MODE === 'production' ? '/WEB2' : '/'; // 환경에 따라 basename 설정

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
