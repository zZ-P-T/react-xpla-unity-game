import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { GAME_SEND_TYPE } from '../types';

export class ResBase {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
  ) {}

  public static fromData(resData: ResBase.Data, errMessage?: string) {
    const { code, type } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResBase(code, message, type);
    return res;
  }
}

export namespace ResBase {
  export interface Data {
    code: ERROR_CODE;
    type: GAME_SEND_TYPE;
  }
}
