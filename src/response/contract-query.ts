import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResContractQuery {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: any,
  ) {}

  public static fromData(resData: ResContractQuery.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResContractQuery(code, message, type, data);
    return res;
  }
}

export namespace ResContractQuery {
  export interface Data extends ResBase.Data {
    data: any;
  }
}
