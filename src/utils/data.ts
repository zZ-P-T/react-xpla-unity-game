import { ERROR_CODE, ERROR_MESSAGE } from '../errors';
import { Res, ResBase } from '../response';
import { GAME_SEND_TYPE } from '../types';

export const encodeError = (
  code: ERROR_CODE,
  type: GAME_SEND_TYPE,
  errMessage?: string,
) => {
  const message = errMessage
    ? errMessage
    : ERROR_MESSAGE[code] || ERROR_MESSAGE[ERROR_CODE.UNKNOWN];

  const res = ResBase.fromData({ code, type }, message);
  const encoded = JSON.stringify(res);
  return encoded;
};

export const encodeSuccess = (res: Res) => {
  const encoded = JSON.stringify(res);
  return encoded;
};
