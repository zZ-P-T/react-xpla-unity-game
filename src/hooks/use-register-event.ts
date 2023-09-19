import { useConnectedWallet } from '@xpla/wallet-provider';
import { useEffect } from 'react';

import { WALLET_EVENT_LISTENER } from '../config';
import { useXplaUnityGame } from '../context';
import { ERROR_CODE } from '../errors';
import { ResConnectedWallet, ResDisconnectedWallet } from '../response';
import { GAME_SEND_TYPE } from '../types';
import { encodeError, encodeSuccess } from '../utils';
import { useSetTimeout } from '../utils/hooks/use-set-timeout';
import {
  useConnectWallet,
  useDisconnectWallet,
  useExecuteContract,
  useGetContractInfo,
  useGetContractQuery,
  useGetCW20Balance,
  useGetCW20TokenInfo,
  useGetCW721TokenInfo,
  useGetCW721Tokens,
  useGetTxResult,
  useGetXplaAmount,
  usePostTx,
  useSendNFT,
  useSendToken,
} from './events';
import { useNetworkName } from './use-network';

export const useRegisterEvent = () => {
  const {
    unityContextHook: { sendMessage },
    gameObjectName,
    txOptions,
    handleTxOptions,
  } = useXplaUnityGame();

  const connectedWallet = useConnectedWallet();

  const networkName = useNetworkName();

  /* connect */
  useConnectWallet();
  useDisconnectWallet();

  /* queries */
  useGetXplaAmount();
  useGetContractInfo();
  useGetContractQuery();
  useGetCW20TokenInfo();
  useGetCW20Balance();
  useGetCW721Tokens();
  useGetCW721TokenInfo();

  /* tx */
  usePostTx();
  useGetTxResult();
  useSendToken();
  useSendNFT();
  useExecuteContract();

  // tx options check
  // 1 minute
  useSetTimeout(
    () => {
      if (txOptions) {
        const encoded = encodeError(
          ERROR_CODE.EXPIRED_TX,
          GAME_SEND_TYPE.EXIPRE_TX,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

        handleTxOptions(undefined);
      }
    },
    txOptions ? 60 * 1000 : 0,
  );

  useEffect(() => {
    if (connectedWallet) {
      const res = ResConnectedWallet.fromData({
        code: ERROR_CODE.SUCCESS,
        type: GAME_SEND_TYPE.CONNECTED_WALLET,
        data: {
          address: connectedWallet.walletAddress,
          networkName,
        },
      });

      const encoded = encodeSuccess(res);

      sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
    } else {
      const res = ResDisconnectedWallet.fromData({
        code: ERROR_CODE.SUCCESS,
        type: GAME_SEND_TYPE.DISCONNECTED_WALLET,
        data: {
          address: '',
          networkName,
        },
      });

      const encoded = encodeSuccess(res);

      sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
    }
  }, [connectedWallet, networkName, gameObjectName, sendMessage]);
};
