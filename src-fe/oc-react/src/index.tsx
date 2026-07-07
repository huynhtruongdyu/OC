import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { config } from '@/config';
import { logger } from '@/lib/logger';

logger.info({
  name: `${config.app.name} (${config.app.version})`,
  env: config.env.environment,
  debug: config.env.enableDebug,
});

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

