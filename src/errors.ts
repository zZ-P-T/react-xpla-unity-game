export enum ERROR_CODE {
  SUCCESS = 0,

  NOT_CONNECTED = 10001,

  /* tx */
  ESTIMATED_FEE_FAIL = 20001,
  NOT_FOUND_TX = 20002,
  EXPIRED_TX = 20003,
  WAIT_TX = 20004,
  ERROR_TX = 20005,

  INVALID_PARAMS = 90001,
  UNKNOWN = 99999,
}

export const ERROR_MESSAGE = {
  [ERROR_CODE.SUCCESS]: 'SUCCESS',

  [ERROR_CODE.NOT_CONNECTED]: 'Please connect your wallet first.',

  [ERROR_CODE.ESTIMATED_FEE_FAIL]: 'Fee estimation failed.',
  [ERROR_CODE.NOT_FOUND_TX]: 'Tx is not defined.',
  [ERROR_CODE.EXPIRED_TX]: 'Tx is expired.',
  [ERROR_CODE.WAIT_TX]: 'Tx wait.',
  [ERROR_CODE.ERROR_TX]: 'Tx error.',

  [ERROR_CODE.INVALID_PARAMS]: 'Please check the parameters',
  [ERROR_CODE.UNKNOWN]: 'Unkown error.',
};
