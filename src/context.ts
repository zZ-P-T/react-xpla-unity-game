import { createContext, useContext } from 'react';

import { XplaUnityGame } from './types';

// @ts-ignore
export const XplaUnityGameContext = createContext<XplaUnityGame>();

export function useXplaUnityGame(): XplaUnityGame {
  return useContext(XplaUnityGameContext);
}
