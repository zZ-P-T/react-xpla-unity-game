import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { CW20TokenInfoResponse, GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResCW20TokenInfo {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: CW20TokenInfoResponse,
  ) {}

  public static fromData(resData: ResCW20TokenInfo.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResCW20TokenInfo(code, message, type, data);
    return res;
  }
}

export namespace ResCW20TokenInfo {
  export interface Data extends ResBase.Data {
    data: CW20TokenInfoResponse;
  }
}
