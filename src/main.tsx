import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Ensure your index.html has a <div id="root"></div>.');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
