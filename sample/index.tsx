import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { XplaUnityGameWithWalletProvider } from '../src';
import App from './app';

const config = {
  loaderUrl: 'https://zpt.samples.app/app.loader.js',
  dataUrl: 'https://zpt.samples.app/app.data.unityweb',
  frameworkUrl: 'https://zpt.samples.app/app.framework.js.unityweb',
  codeUrl: 'https://zpt.samples.app/app.wasm.unityweb',
};

const gameObjectName = 'GameManager';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <>
    <StrictMode>
      <XplaUnityGameWithWalletProvider
        config={config}
        gameObjectName={gameObjectName}
      >
        <App />
      </XplaUnityGameWithWalletProvider>
    </StrictMode>
  </>,
);
