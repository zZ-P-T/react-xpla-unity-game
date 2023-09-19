import { useLCDClient } from '@xpla/wallet-provider';
import { useCallback, useEffect } from 'react';
import { ReactUnityEventParameter } from 'react-unity-webgl/distribution/types/react-unity-event-parameters';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResCW20Balance } from '../../response';
import { GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess } from '../../utils';
import { useAddress } from '../use-address';

export const useGetCW20Balance = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
  } = useXplaUnityGame();

  const lcd = useLCDClient();
  const address = useAddress();

  const getCW20Balance = useCallback(
    (contract: ReactUnityEventParameter) => {
      if (!address) {
        const encoded = encodeError(
          ERROR_CODE.NOT_CONNECTED,
          GAME_SEND_TYPE.SET_CW20_BALANCE,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
      } else if (contract && typeof contract === 'string') {
        lcd.wasm
          .contractQuery<{ balance: string }>(contract, {
            balance: { address },
          })
          .then(({ balance }) => {
            const res = ResCW20Balance.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SET_CW20_BALANCE,
              data: balance,
            });

            const encoded = encodeSuccess(res);

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          })
          .catch((err) => {
            const encoded = encodeError(
              ERROR_CODE.UNKNOWN,
              GAME_SEND_TYPE.SET_CW20_BALANCE,
              err.message,
            );

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          });
      } else {
        const encoded = encodeError(
          ERROR_CODE.INVALID_PARAMS,
          GAME_SEND_TYPE.SET_CW20_BALANCE,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
      }
    },
    [address, lcd, gameObjectName, sendMessage],
  );

  useEffect(() => {
    addEventListener(WALLET_API.GET_CW20_BALANCE, getCW20Balance);
    return () => {
      removeEventListener(WALLET_API.GET_CW20_BALANCE, getCW20Balance);
    };
  }, [addEventListener, removeEventListener, getCW20Balance]);
};
