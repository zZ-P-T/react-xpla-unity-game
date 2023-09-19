import { useConnectedWallet } from '@xpla/wallet-provider';
import { AccAddress, MsgExecuteContract, MsgSend } from '@xpla/xpla.js';
import { useCallback, useEffect } from 'react';
import { ReactUnityEventParameter } from 'react-unity-webgl/distribution/types/react-unity-event-parameters';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResSimulationTx } from '../../response';
import { getEstimatedFee } from '../../tx';
import { GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess, isDenom } from '../../utils';
import { useAddress } from '../use-address';

export const useSendToken = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
    handleTxOptions,
  } = useXplaUnityGame();

  const connectedWallet = useConnectedWallet();
  const address = useAddress();

  const sendToken = useCallback(
    (
      token: ReactUnityEventParameter,
      recipient: ReactUnityEventParameter,
      amount: ReactUnityEventParameter,
      txmemo: ReactUnityEventParameter,
    ) => {
      if (!connectedWallet || !address) {
        const encoded = encodeError(
          ERROR_CODE.NOT_CONNECTED,
          GAME_SEND_TYPE.SEND_TOKEN,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

        handleTxOptions(undefined);
      } else if (
        token &&
        recipient &&
        amount &&
        typeof token === 'string' &&
        typeof recipient === 'string' &&
        AccAddress.validate(recipient) &&
        typeof amount === 'string'
      ) {
        const execute_msg = { transfer: { recipient, amount } };

        const msgs = isDenom(token)
          ? [new MsgSend(address, recipient, amount + token)]
          : [new MsgExecuteContract(address, token, execute_msg)];

        const memo = txmemo && typeof txmemo === 'string' ? txmemo : undefined;

        const config = {
          chainID: connectedWallet.network.chainID,
          URL: connectedWallet.network.lcd,
          address: connectedWallet.walletAddress,
          createTxOptions: { msgs, memo },
        };

        getEstimatedFee(config)
          .then((fee) => {
            if (!fee) {
              const encoded = encodeError(
                ERROR_CODE.ESTIMATED_FEE_FAIL,
                GAME_SEND_TYPE.SEND_TOKEN,
              );

              sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

              return;
            }

            handleTxOptions({ msgs, memo, fee });

            const res = ResSimulationTx.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SEND_TOKEN,
              data: fee.amount.toData()[0],
            });

            const encoded = encodeSuccess(res);

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          })
          .catch((err: any) => {
            const encoded = encodeError(
              ERROR_CODE.UNKNOWN,
              GAME_SEND_TYPE.SEND_TOKEN,
              err.message,
            );

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

            handleTxOptions(undefined);
          });
      } else {
        const encoded = encodeError(
          ERROR_CODE.INVALID_PARAMS,
          GAME_SEND_TYPE.SEND_TOKEN,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

        handleTxOptions(undefined);
      }
    },
    [handleTxOptions, address, connectedWallet, gameObjectName, sendMessage],
  );

  useEffect(() => {
    addEventListener(WALLET_API.SEND_TOKEN, sendToken);
    return () => {
      removeEventListener(WALLET_API.SEND_TOKEN, sendToken);
    };
  }, [addEventListener, removeEventListener, sendToken]);
};
