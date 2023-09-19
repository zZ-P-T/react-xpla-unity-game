import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { GAME_SEND_TYPE, Txhash } from '../types';
import { ResBase } from './base';

export class ResPostTx {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: Txhash,
  ) {}

  public static fromData(resData: ResPostTx.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResPostTx(code, message, type, data);
    return res;
  }
}

export namespace ResPostTx {
  export interface Data extends ResBase.Data {
    data: Txhash;
  }
}
