import { useLCDClient } from '@xpla/wallet-provider';
import { isTxError } from '@xpla/xpla.js';
import { useCallback, useEffect } from 'react';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResTxResult } from '../../response';
import { GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess } from '../../utils';

export const useGetTxResult = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
    txhash,
    isBroadcasting,
    handleTxOptions,
    handleTxhash,
    handleIsBroadcasting,
  } = useXplaUnityGame();

  const lcd = useLCDClient();

  const getTxResult = useCallback(() => {
    if (txhash && isBroadcasting) {
      lcd.tx
        .txInfo(txhash)
        .then((txInfo) => {
          if (isTxError(txInfo)) {
            const res = ResTxResult.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SET_TX_RESULT,
              data: 'FAILED',
            });

            const encoded = encodeSuccess(res);

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          } else {
            const res = ResTxResult.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SET_TX_RESULT,
              data: 'SUCCESS',
            });

            const encoded = encodeSuccess(res);

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          }

          handleTxOptions(undefined);
          handleTxhash('');
          handleIsBroadcasting(false);
        })
        .catch(() => {
          const encoded = encodeError(
            ERROR_CODE.WAIT_TX,
            GAME_SEND_TYPE.SET_TX_RESULT,
          );

          sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
        });
    } else {
      const encoded = encodeError(
        ERROR_CODE.NOT_FOUND_TX,
        GAME_SEND_TYPE.SET_TX_RESULT,
      );

      sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
    }
  }, [
    lcd,
    txhash,
    isBroadcasting,
    gameObjectName,
    sendMessage,
    handleTxOptions,
    handleTxhash,
    handleIsBroadcasting,
  ]);

  useEffect(() => {
    addEventListener(WALLET_API.GET_TX_RESULT, getTxResult);
    return () => {
      removeEventListener(WALLET_API.GET_TX_RESULT, getTxResult);
    };
  }, [addEventListener, removeEventListener, getTxResult]);
};
