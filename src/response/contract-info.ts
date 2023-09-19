import { ContractInfo } from '@xpla/xpla.js';

import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResContractInfo {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: ContractInfo,
  ) {}

  public static fromData(resData: ResContractInfo.Data, errMessage?: string) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResContractInfo(code, message, type, data);
    return res;
  }
}

export namespace ResContractInfo {
  export interface Data extends ResBase.Data {
    data: ContractInfo;
  }
}
