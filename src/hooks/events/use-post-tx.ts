import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  useConnectedWallet,
  UserDenied,
} from '@xpla/wallet-provider';
import { useCallback, useEffect } from 'react';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResPostTx } from '../../response';
import { GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess } from '../../utils';

export const usePostTx = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
    txOptions,
    handleTxOptions,
    handleTxhash,
    handleIsBroadcasting,
  } = useXplaUnityGame();

  const connectedWallet = useConnectedWallet();

  const postTx = useCallback(() => {
    if (!connectedWallet) {
      const encoded = encodeError(
        ERROR_CODE.NOT_CONNECTED,
        GAME_SEND_TYPE.POST_TX,
      );

      sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

      handleTxOptions(undefined);
    } else {
      if (!txOptions) {
        const encoded = encodeError(
          ERROR_CODE.NOT_FOUND_TX,
          GAME_SEND_TYPE.POST_TX,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

        handleTxOptions(undefined);

        return;
      }

      connectedWallet
        .post(txOptions)
        .then((txResult: TxResult) => {
          const { result } = txResult;
          const { txhash } = result;

          handleTxhash(txhash);
          handleIsBroadcasting(true);

          const res = ResPostTx.fromData({
            code: ERROR_CODE.SUCCESS,
            type: GAME_SEND_TYPE.POST_TX,
            data: txhash,
          });

          const encoded = encodeSuccess(res);

          sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

          handleTxOptions(undefined);
        })
        .catch((error: unknown) => {
          let message = '';
          if (error instanceof UserDenied) {
            message = 'User Denied';
          } else if (error instanceof CreateTxFailed) {
            message = 'Create Tx Failed: ' + error.message;
          } else if (error instanceof TxFailed) {
            message = 'Tx Failed: ' + error.message;
          } else if (error instanceof Timeout) {
            message = 'Timeout';
          } else if (error instanceof TxUnspecifiedError) {
            message = 'Unspecified Error: ' + error.message;
          } else {
            message =
              'Unknown Error: ' +
              (error instanceof Error ? error.message : String(error));
          }

          const encoded = encodeError(
            ERROR_CODE.ERROR_TX,
            GAME_SEND_TYPE.POST_TX,
            message,
          );

          sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

          handleTxOptions(undefined);
        });
    }
  }, [
    txOptions,
    handleTxOptions,
    handleTxhash,
    handleIsBroadcasting,
    connectedWallet,
    gameObjectName,
    sendMessage,
  ]);

  useEffect(() => {
    addEventListener(WALLET_API.POST_TX, postTx);
    return () => {
      removeEventListener(WALLET_API.POST_TX, postTx);
    };
  }, [addEventListener, removeEventListener, postTx]);
};
