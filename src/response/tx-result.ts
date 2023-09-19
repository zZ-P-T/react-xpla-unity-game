import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResTxResult {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: 'SUCCESS' | 'FAILED',
  ) {}

  public static fromData(resData: ResTxResult.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResTxResult(code, message, type, data);
    return res;
  }
}

export namespace ResTxResult {
  export interface Data extends ResBase.Data {
    data: 'SUCCESS' | 'FAILED';
  }
}
