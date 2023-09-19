import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { CW721TokenInfoResponse, GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResCW721TokenInfo {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: CW721TokenInfoResponse,
  ) {}

  public static fromData(resData: ResCW721TokenInfo.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResCW721TokenInfo(code, message, type, data);
    return res;
  }
}

export namespace ResCW721TokenInfo {
  export interface Data extends ResBase.Data {
    data: CW721TokenInfoResponse;
  }
}
