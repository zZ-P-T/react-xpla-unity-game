# react-xpla-unity-game

This is a library that allows web games made with Unity3d to be easily connected to the XPLA Vault wallet through React.

This library makes it easy to connect with XPLA Vault, and also you can connect it without using this library.

We are using the following 3 libraries for easy integration.
- [@xpla/xpla.js](https://www.npmjs.com/package/@xpla/xpla.js)
- [@xpla/wallet-provider](https://www.npmjs.com/package/@xpla/wallet-provider)
- [react-unity-webgl](https://www.npmjs.com/package/react-unity-webgl)

<br />

Through this library users can perform the following:
- Connect to your wallet.
- Check the balance of tokens stored in the wallet.
- Tokens stored in the wallet can be transferred to another wallet.
- Sign messages on the connected wallet.

## Table of Contents
- [Installation](#installation)
- [Demo](#demo)
- [How to use](#how-to-use)
- [API](#api)
- [Hook](#hook)

## Installation

```bash
npm i --save @zpteam/react-xpla-unity-game
```

## Demo
```bash
npm i
npx parcel sample/index.html 
```

## How to use

First, to communicate from Unity3D to react, save the default WalletAPI.jslib in the ***Assets > Plugins > WebGL*** folder of the Unity3D project.

```jsx
// react
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  XplaUnityGameWithWalletProvider,
  XplaUnityGameContainer,
  useRegisterEvent 
} from 'react-xpla-unity-game';

const App = () => {
  // ---------------------------------------------
  // register event
  // ---------------------------------------------
  useRegisterEvent();

  return <XplaUnityGameContainer />;
};

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
```

Declare and use functions declared in WalletAPI.jslib in your unity3d script.


```csharp
// GameManager.cs
public class GameManager : MonoBehaviour
{
  [DllImport("__Internal")]
  private static extern void ConnectWallet();

  [DllImport("__Internal")]
  private static extern void DisconnectWallet();

  [DllImport("__Internal")]
  private static extern void GetXplaAmount();

  [DllImport("__Internal")]
  private static extern void GetContractInfo(string contract);

  [DllImport("__Internal")]
  private static extern void GetContractQuery(string contract, string query);

  [DllImport("__Internal")]
  private static extern void GetCW20TokenInfo(string contract);

  [DllImport("__Internal")]
  private static extern void GetCW20Balance(string contract);

  [DllImport("__Internal")]
  private static extern void GetCW721Tokens(string contract);

  [DllImport("__Internal")]
  private static extern void GetCW721TokenInfo(string contract, string token_id);

  [DllImport("__Internal")]
  private static extern void PostTx();
  [DllImport("__Internal")]
  private static extern void GetTxResult();

  [DllImport("__Internal")]
  private static extern void SendToken(string token, string recipient, string amount, string txmemo);

  [DllImport("__Internal")]
  private static extern void SendNFT(string contract, string recipient, string token_id, string txmemo);

  [DllImport("__Internal")]
  private static extern void ExecuteContract(string contract, string execute_msg, string txmemo);

  ...
  ...
}
```

A function to communicate from react to Unity3D must also be declared. 
In this library, the function name is used as WalletEventListener.

```csharp
// GameManager.cs
public class GameManager : MonoBehaviour
{
  ...
  ...

  public void WalletEventListener(string result) {
    Debug.Log(result);
  }

  ...
  ...
}
```

```jsx
// react
import { WALLET_EVENT_LISTENER } from '../../config';

...
...

const {
  unityContextHook: { sendMessage },
  gameObjectName,
} = useXplaUnityGame();

sendMessage(gameObjectName, WALLET_EVENT_LISTENER, 'test message');

...
...

```

## API

<details>

<summary><code>&lt;XplaUnityGameWithWalletProvider&gt;</code></summary>

XplaUnityGameWithWalletProvider is composed of XPLA Vault's wallet-provider and XplaUnityGameProvider.

XplaUnityGameWithWalletProvider includes XPLA Vault wallet by default.

The default settings are:

```jsx
// Game build files
const config = {
  loaderUrl: 'https://zpt.samples.app/app.loader.js',
  dataUrl: 'https://zpt.samples.app/app.data.unityweb',
  frameworkUrl: 'https://zpt.samples.app/app.framework.js.unityweb',
  codeUrl: 'https://zpt.samples.app/app.wasm.unityweb',
};

// Game object name to call from React to Unity3D 
const gameObjectName = 'GameManager';
```

</details>

<br />

<details>

<summary><code>&lt;XplaUnityGameProvider&gt;</code></summary>

It can be used if there is a wallet-provider of XPLA Vault that is already linked.

The default setting is the same as XplaUnityGameWithWalletProvider.

</details>

<br />

<details>

<summary><code>&lt;XplaUnityGameContainer&gt;</code></summary>

XplaUnityGameContainer is a wrapper component of react-unity-webgl's Unity component.

```jsx
// loading image or icon
const loading = <img src="IMAGE_LINK" alt="" />;

// Update Unity component style
// Changed the default width of 60% to 70%
const style: React.CSSProperties = {
  width: '70%'
}

return (
  <XplaUnityGameContainer loading={loading} style={style} />
)

```

</details>

## Hook