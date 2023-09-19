import { useLCDClient } from '@xpla/wallet-provider';
import { useCallback, useEffect } from 'react';
import { ReactUnityEventParameter } from 'react-unity-webgl/distribution/types/react-unity-event-parameters';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResContractQuery } from '../../response';
import { GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess } from '../../utils';

export const useGetContractQuery = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
  } = useXplaUnityGame();

  const lcd = useLCDClient();

  const getContractQuery = useCallback(
    (
      contract: ReactUnityEventParameter,
      queryString: ReactUnityEventParameter,
    ) => {
      if (
        contract &&
        typeof contract === 'string' &&
        typeof queryString === 'string'
      ) {
        const query = JSON.parse(queryString);

        lcd.wasm
          .contractQuery(contract, query)
          .then((result) => {
            const res = ResContractQuery.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SET_CONTRACT_QUERY,
              data: result,
            });

            const encoded = encodeSuccess(res);

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          })
          .catch((err) => {
            const encoded = encodeError(
              ERROR_CODE.UNKNOWN,
              GAME_SEND_TYPE.SET_CONTRACT_QUERY,
              err.message,
            );

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          });
      } else {
        const encoded = encodeError(
          ERROR_CODE.INVALID_PARAMS,
          GAME_SEND_TYPE.SET_CONTRACT_QUERY,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
      }
    },
    [lcd, gameObjectName, sendMessage],
  );

  useEffect(() => {
    addEventListener(WALLET_API.GET_CONTRACT_QUERY, getContractQuery);
    return () => {
      removeEventListener(WALLET_API.GET_CONTRACT_QUERY, getContractQuery);
    };
  }, [addEventListener, removeEventListener, getContractQuery]);
};
