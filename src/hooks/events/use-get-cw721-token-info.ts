import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { ReactUnityEventParameter } from 'react-unity-webgl/distribution/types/react-unity-event-parameters';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResCW721TokenInfo } from '../../response';
import {
  CW721TokenInfoResponse,
  GAME_SEND_TYPE,
  WALLET_API,
} from '../../types';
import { encodeError, encodeSuccess } from '../../utils';
import { useAddress } from '../use-address';
import { useLCDClient } from '../use-lcd-client';

export const useGetCW721TokenInfo = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
  } = useXplaUnityGame();

  const address = useAddress();
  const lcd = useLCDClient();

  const getCW721TokenInfo = useCallback(
    (
      contract: ReactUnityEventParameter,
      token_id: ReactUnityEventParameter,
    ) => {
      if (!address) {
        const encoded = encodeError(
          ERROR_CODE.NOT_CONNECTED,
          GAME_SEND_TYPE.SET_CW721_TOKEN_INFO,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
      } else if (
        contract &&
        token_id &&
        typeof contract === 'string' &&
        typeof token_id === 'string'
      ) {
        lcd.wasm
          .contractQuery<CW721TokenInfoResponse>(contract, {
            nft_info: { token_id },
          })
          .then((data) => {
            const defaultRes = ResCW721TokenInfo.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SET_CW721_TOKEN_INFO,
              data,
            });

            const defaultEncoded = encodeSuccess(defaultRes);

            const { token_uri } = data;
            const uri = getIpfsGateway(token_uri);
            if (!token_uri || !uri) {
              sendMessage(
                gameObjectName,
                WALLET_EVENT_LISTENER,
                defaultEncoded,
              );
              return;
            }

            if (uri) {
              axios
                .get(uri)
                .then((extension: any) => {
                  const result = {
                    ...data,
                    extension: { ...data.extension, ...extension },
                  };

                  const res = ResCW721TokenInfo.fromData({
                    code: ERROR_CODE.SUCCESS,
                    type: GAME_SEND_TYPE.SET_CW721_TOKEN_INFO,
                    data: result,
                  });

                  const encoded = encodeSuccess(res);

                  sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
                })
                .catch(() => {
                  sendMessage(
                    gameObjectName,
                    WALLET_EVENT_LISTENER,
                    defaultEncoded,
                  );
                });
            }
          })
          .catch((err: any) => {
            const encoded = encodeError(
              ERROR_CODE.UNKNOWN,
              GAME_SEND_TYPE.SET_CW721_TOKEN_INFO,
              err.message,
            );

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          });
      } else {
        const encoded = encodeError(
          ERROR_CODE.INVALID_PARAMS,
          GAME_SEND_TYPE.SET_CW721_TOKEN_INFO,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
      }
    },
    [address, lcd, gameObjectName, sendMessage],
  );

  useEffect(() => {
    addEventListener(WALLET_API.GET_CW721_TOKEN_INFO, getCW721TokenInfo);
    return () => {
      removeEventListener(WALLET_API.GET_CW721_TOKEN_INFO, getCW721TokenInfo);
    };
  }, [addEventListener, removeEventListener, getCW721TokenInfo]);
};

/* helpers */
export const getIpfsGateway = (src: string = '') => {
  if (typeof src === 'string') {
    return src.startsWith('ipfs://')
      ? src.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
      : src.startsWith('https://') || src.startsWith('https://')
      ? src
      : undefined;
  } else {
    return;
  }
};
