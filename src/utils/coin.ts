import { Coins } from '@xpla/xpla.js';

export const getAmount = (
  coins: Coins | undefined,
  denom: string,
  fallback = '0',
) => {
  return coins ? coins.get(denom)?.amount.toString() ?? fallback : fallback;
};
