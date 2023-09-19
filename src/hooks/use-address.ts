import { useConnectedWallet } from '@xpla/wallet-provider';

export const useAddress = () => {
  const connected = useConnectedWallet();

  return connected?.xplaAddress;
};
