import { useLCDClient } from '@xpla/wallet-provider';
import { useCallback, useEffect } from 'react';
import { ReactUnityEventParameter } from 'react-unity-webgl/distribution/types/react-unity-event-parameters';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResCW20TokenInfo } from '../../response';
import { CW20TokenInfoResponse, GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess } from '../../utils';

export const useGetCW20TokenInfo = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
  } = useXplaUnityGame();

  const lcd = useLCDClient();

  const getCW20TokenInfo = useCallback(
    (contract: ReactUnityEventParameter) => {
      if (contract && typeof contract === 'string') {
        lcd.wasm
          .contractQuery<CW20TokenInfoResponse>(contract, { token_info: {} })
          .then((data) => {
            const res = ResCW20TokenInfo.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SET_CW20_TOKEN_INFO,
              data,
            });

            const encoded = encodeSuccess(res);

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          })
          .catch((err) => {
            const encoded = encodeError(
              ERROR_CODE.UNKNOWN,
              GAME_SEND_TYPE.SET_CW20_TOKEN_INFO,
              err.message,
            );

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          });
      } else {
        const encoded = encodeError(
          ERROR_CODE.INVALID_PARAMS,
          GAME_SEND_TYPE.SET_CW20_TOKEN_INFO,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
      }
    },
    [lcd, gameObjectName, sendMessage],
  );

  useEffect(() => {
    addEventListener(WALLET_API.GET_CW20_TOKEN_INFO, getCW20TokenInfo);
    return () => {
      removeEventListener(WALLET_API.GET_CW20_TOKEN_INFO, getCW20TokenInfo);
    };
  }, [addEventListener, removeEventListener, getCW20TokenInfo]);
};
