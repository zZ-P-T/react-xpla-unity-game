import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResCW721Tokens {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: string[],
  ) {}

  public static fromData(resData: ResCW721Tokens.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResCW721Tokens(code, message, type, data);
    return res;
  }
}

export namespace ResCW721Tokens {
  export interface Data extends ResBase.Data {
    data: string[];
  }
}
