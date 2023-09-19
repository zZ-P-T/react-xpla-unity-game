import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { Address, GAME_SEND_TYPE } from '../types';
import { ResBase } from './base';

export class ResDisconnectedWallet {
  constructor(
    public code: ERROR_CODE,
    public message: string,
    public type: GAME_SEND_TYPE,
    public data: { address: Address; networkName: string },
  ) {}

  public static fromData(
    resData: ResDisconnectedWallet.Data,
    errMessage?: string,
  ) {
    const { code, type, data } = resData;

    const message = errMessage
      ? errMessage
      : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

    const res = new ResDisconnectedWallet(code, message, type, data);
    return res;
  }
}

export namespace ResDisconnectedWallet {
  export interface Data extends ResBase.Data {
    data: {
      address: Address;
      networkName: string;
    };
  }
}
