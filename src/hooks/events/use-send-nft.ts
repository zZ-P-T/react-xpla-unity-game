import { useConnectedWallet } from '@xpla/wallet-provider';
import { AccAddress, MsgExecuteContract } from '@xpla/xpla.js';
import { useCallback, useEffect } from 'react';
import { ReactUnityEventParameter } from 'react-unity-webgl/distribution/types/react-unity-event-parameters';

import { WALLET_EVENT_LISTENER } from '../../config';
import { useXplaUnityGame } from '../../context';
import { ERROR_CODE } from '../../errors';
import { ResSimulationTx } from '../../response';
import { getEstimatedFee } from '../../tx';
import { GAME_SEND_TYPE, WALLET_API } from '../../types';
import { encodeError, encodeSuccess } from '../../utils';
import { useAddress } from '../use-address';

export const useSendNFT = () => {
  const {
    unityContextHook: { sendMessage, addEventListener, removeEventListener },
    gameObjectName,
    handleTxOptions,
  } = useXplaUnityGame();

  const connectedWallet = useConnectedWallet();
  const address = useAddress();

  const sendNFT = useCallback(
    (
      contract: ReactUnityEventParameter,
      recipient: ReactUnityEventParameter,
      token_id: ReactUnityEventParameter,
      txmemo: ReactUnityEventParameter,
    ) => {
      if (!connectedWallet || !address) {
        const encoded = encodeError(
          ERROR_CODE.NOT_CONNECTED,
          GAME_SEND_TYPE.SEND_NFT,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

        handleTxOptions(undefined);
      } else if (
        contract &&
        recipient &&
        token_id &&
        typeof contract === 'string' &&
        AccAddress.validate(contract) &&
        typeof recipient === 'string' &&
        AccAddress.validate(recipient) &&
        typeof token_id === 'string'
      ) {
        const execute_msg = {
          transfer_nft: { recipient, token_id },
        };

        const msgs = [new MsgExecuteContract(address, contract, execute_msg)];

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
                GAME_SEND_TYPE.SEND_NFT,
              );

              sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

              return;
            }

            handleTxOptions({ msgs, memo, fee });

            const res = ResSimulationTx.fromData({
              code: ERROR_CODE.SUCCESS,
              type: GAME_SEND_TYPE.SEND_NFT,
              data: fee.amount.toData()[0],
            });

            const encoded = encodeSuccess(res);

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);
          })
          .catch((err: any) => {
            const encoded = encodeError(
              ERROR_CODE.UNKNOWN,
              GAME_SEND_TYPE.SEND_NFT,
              err.message,
            );

            sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

            handleTxOptions(undefined);
          });
      } else {
        const encoded = encodeError(
          ERROR_CODE.INVALID_PARAMS,
          GAME_SEND_TYPE.SEND_NFT,
        );

        sendMessage(gameObjectName, WALLET_EVENT_LISTENER, encoded);

        handleTxOptions(undefined);
      }
    },
    [handleTxOptions, address, connectedWallet, gameObjectName, sendMessage],
  );

  useEffect(() => {
    addEventListener(WALLET_API.SEND_NFT, sendNFT);
    return () => {
      removeEventListener(WALLET_API.SEND_NFT, sendNFT);
    };
  }, [addEventListener, removeEventListener, sendNFT]);
};
