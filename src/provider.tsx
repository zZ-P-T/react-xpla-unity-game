import {
  getChainOptions,
  WalletControllerChainOptions,
  WalletProvider,
} from '@xpla/wallet-provider';
import { CreateTxOptions } from '@xpla/xpla.js';
import BigNumber from 'bignumber.js';
import { PropsWithChildren, useEffect, useState } from 'react';
import { UnityConfig, useUnityContext } from 'react-unity-webgl';

import { XplaUnityGameContext } from './context';

BigNumber.config({ EXPONENTIAL_AT: 40 });

export interface XplaUnityGameProviderProps {
  config: UnityConfig;
  gameObjectName: string;
}

export const XplaUnityGameProvider = ({
  config,
  gameObjectName,
  children,
}: PropsWithChildren<XplaUnityGameProviderProps>) => {
  const { loaderUrl, dataUrl, frameworkUrl, codeUrl } = config;

  const [txOptions, setTxOptions] = useState<CreateTxOptions>();
  const [txhash, setTxhahs] = useState<string>('');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);

  const unityContextHook = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  });

  const handleTxOptions = (value: CreateTxOptions | undefined) => {
    setTxOptions(value);
  };

  const handleTxhash = (value: string) => {
    setTxhahs(value);
  };

  const handleIsBroadcasting = (value: boolean) => {
    setIsBroadcasting(value);
  };

  return (
    <XplaUnityGameContext.Provider
      value={{
        unityContextHook,
        gameObjectName,
        txOptions,
        txhash,
        isBroadcasting,
        handleTxOptions,
        handleTxhash,
        handleIsBroadcasting,
      }}
    >
      {children}
    </XplaUnityGameContext.Provider>
  );
};

export const XplaUnityGameWithWalletProvider = ({
  config,
  gameObjectName,
  children,
}: PropsWithChildren<XplaUnityGameProviderProps>) => {
  const { loaderUrl, dataUrl, frameworkUrl, codeUrl } = config;

  const [txOptions, setTxOptions] = useState<CreateTxOptions>();
  const [txhash, setTxhahs] = useState<string>('');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);

  const [chainOptions, setChainOptions] =
    useState<WalletControllerChainOptions>();

  const unityContextHook = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  });

  useEffect(() => {
    getChainOptions().then((chainOptions) => setChainOptions(chainOptions));
  }, []);

  const handleTxOptions = (value: CreateTxOptions | undefined) => {
    setTxOptions(value);
  };

  const handleTxhash = (value: string) => {
    setTxhahs(value);
  };

  const handleIsBroadcasting = (value: boolean) => {
    setIsBroadcasting(value);
  };

  if (!chainOptions) {
    return null;
  }

  return (
    <WalletProvider {...chainOptions}>
      <XplaUnityGameContext.Provider
        value={{
          unityContextHook,
          gameObjectName,
          txOptions,
          txhash,
          isBroadcasting,
          handleTxOptions,
          handleTxhash,
          handleIsBroadcasting,
        }}
      >
        {children}
      </XplaUnityGameContext.Provider>
    </WalletProvider>
  );
};
