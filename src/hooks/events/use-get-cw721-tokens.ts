import { useLCDClient } from '@xpla/wallet-provider';
import { useCallback, useEffect } from 'react';
import { ReactUnityEventParameter } from 'react-unity-webgl/distribution/types/react-unity-event-parameters';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResCW721Tokens } from '../../response';
import { GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess } from '../../utils';
import { useAddress } from '../use-address';

export const useGetCW721Tokens = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
  } = useXplaUnityGame();

  const lcd = useLCDClient();
  const address = useAddress();

  const getCW721Tokens = useCallback(
    (contract: ReactUnityEventParameter) => {
      if (!address) {
        const encoded = encodeError(
          ERROR_CODE.NOT_CONNECTED,
          GAME_SEND_TYPE.SET_CW721_TOKENS,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
      } else if (address && contract && typeof contract === 'string') {
        lcd.wasm
          .contractQuery<{ tokens: string[] }>(contract, {
            tokens: { owner: address },
          })
          .then(({ tokens }) => {
            const res = ResCW721Tokens.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SET_CW721_TOKENS,
              data: tokens,
            });

            const encoded = encodeSuccess(res);

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          })
          .catch((err) => {
            const encoded = encodeError(
              ERROR_CODE.UNKNOWN,
              GAME_SEND_TYPE.SET_CW721_TOKENS,
              err.message,
            );

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          });
      } else {
        const encoded = encodeError(
          ERROR_CODE.INVALID_PARAMS,
          GAME_SEND_TYPE.SET_CW721_TOKENS,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
      }
    },
    [address, lcd, gameObjectName, sendMessage],
  );

  useEffect(() => {
    addEventListener(WALLET_API.GET_CW721_TOKENS, getCW721Tokens);
    return () => {
      removeEventListener(WALLET_API.GET_CW721_TOKENS, getCW721Tokens);
    };
  }, [addEventListener, removeEventListener, getCW721Tokens]);
};
