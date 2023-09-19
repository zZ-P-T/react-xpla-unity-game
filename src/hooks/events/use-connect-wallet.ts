import { useWallet } from '@xpla/wallet-provider';
import { useCallback, useEffect } from 'react';

import { useXplaUnityGame } from '../../context';
import { WALLET_API } from '../../types';

export const useConnectWallet = () => {
  const {
    unityContextHook: { addEventListener, removeEventListener },
  } = useXplaUnityGame();

  const { connect } = useWallet();

  const handleConnectWallet = useCallback(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    addEventListener(WALLET_API.CONNECT_WALLET, handleConnectWallet);
    return () => {
      removeEventListener(WALLET_API.CONNECT_WALLET, handleConnectWallet);
    };
  }, [addEventListener, removeEventListener, handleConnectWallet]);
};
