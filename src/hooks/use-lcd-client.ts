import { LCDClient } from '@xpla/xpla.js';
import { useMemo } from 'react';

import { useNetwork } from './use-network';

export const useLCDClient = () => {
  const network = useNetwork();

  const lcdClient = useMemo(
    () => new LCDClient({ ...network, URL: network.lcd }),
    [network],
  );

  return lcdClient;
};
