import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { Amount, GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResXplaAmount {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: Amount,
  ) {}

  public static fromData(resData: ResXplaAmount.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResXplaAmount(code, message, type, data);
    return res;
  }
}

export namespace ResXplaAmount {
  export interface Data extends ResBase.Data {
    data: Amount;
  }
}
