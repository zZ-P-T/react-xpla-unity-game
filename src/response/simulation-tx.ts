import { Coin } from '@xpla/xpla.js';

import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResSimulationTx {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: Coin.Data,
  ) {}

  public static fromData(resData: ResSimulationTx.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResSimulationTx(code, message, type, data);
    return res;
  }
}

export namespace ResSimulationTx {
  export interface Data extends ResBase.Data {
    data: Coin.Data;
  }
}
