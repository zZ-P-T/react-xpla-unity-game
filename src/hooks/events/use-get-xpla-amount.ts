import { useLCDClient } from '@xpla/wallet-provider';
import { useCallback, useEffect } from 'react';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResXplaAmount } from '../../response';
import { GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess, getAmount } from '../../utils';
import { useAddress } from '../use-address';

export const useGetXplaAmount = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
  } = useXplaUnityGame();

  const address = useAddress();
  const lcd = useLCDClient();

  const getXplaAmount = useCallback(() => {
    if (!address) {
      const encoded = encodeError(
        ERROR_CODE.NOT_CONNECTED,
        GAME_SEND_TYPE.SET_XPLA_AMOUNT,
      );

      sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
    } else {
      lcd.bank
        .spendableBalances(address)
        .then(([coins]) => {
          const amount = getAmount(coins, 'axpla') || '0';

          const res = ResXplaAmount.fromData({
            code: ERROR_CODE.SUCCESS,
            type: GAME_SEND_TYPE.SET_XPLA_AMOUNT,
            data: amount,
          });

          const encoded = encodeSuccess(res);

          sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
        })
        .catch((err) => {
          const encoded = encodeError(
            ERROR_CODE.UNKNOWN,
            GAME_SEND_TYPE.SET_XPLA_AMOUNT,
            err.message,
          );

          sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
        });
    }
  }, [address, lcd, gameObjectName, sendMessage]);

  useEffect(() => {
    addEventListener(WALLET_API.GET_XPLA_AMOUNT, getXplaAmount);
    return () => {
      removeEventListener(WALLET_API.GET_XPLA_AMOUNT, getXplaAmount);
    };
  }, [addEventListener, removeEventListener, getXplaAmount]);
};
