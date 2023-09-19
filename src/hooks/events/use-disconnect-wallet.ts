import { useWallet } from '@xpla/wallet-provider';
import { useCallback, useEffect } from 'react';

import { useXplaUnityGame } from '../../context';
import { WALLET_API } from '../../types';

export const useDisconnectWallet = () => {
  const {
    unityContextHook: { addEventListener, removeEventListener },
  } = useXplaUnityGame();

  const { disconnect } = useWallet();

  const handleDisconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    addEventListener(WALLET_API.DISCONNECT_WALLET, handleDisconnectWallet);
    return () => {
      removeEventListener(WALLET_API.DISCONNECT_WALLET, handleDisconnectWallet);
    };
  }, [addEventListener, removeEventListener, handleDisconnectWallet]);
};
