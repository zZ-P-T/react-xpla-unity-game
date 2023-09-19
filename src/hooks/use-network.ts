import { useWallet } from '@xpla/wallet-provider';

import { XplaNetwork } from '../types';

export const useNetwork = (): XplaNetwork => {
  const wallet = useWallet();
  return wallet.network;
};

export const useNetworkName = () => {
  const { name } = useNetwork();
  return name;
};

export const useChainID = () => {
  const { chainID } = useNetwork();
  return chainID;
};
