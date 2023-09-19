import { CreateTxOptions } from '@xpla/xpla.js';
import { UnityContextHook } from 'react-unity-webgl/distribution/types/unity-context-hook';

export type Address = string;
export type Amount = string;
export type Denom = string;
export type Txhash = string;

export interface XplaUnityGame {
  unityContextHook: UnityContextHook;
  gameObjectName: string;
  contract?: {
    cw20?: string;
    cw721?: string;
  };
  txOptions?: CreateTxOptions;
  txhash: string;
  isBroadcasting: boolean;
  handleTxOptions: (value: CreateTxOptions | undefined) => void;
  handleTxhash: (value: string) => void;
  handleIsBroadcasting: (value: boolean) => void;
}

export interface XplaNetwork {
  name: string;
  chainID: string;
  lcd: string;
  ecd: string;
  api?: string;
}

export enum WALLET_API {
  /* connect */
  CONNECT_WALLET = 'ConnectWallet',
  DISCONNECT_WALLET = 'DisconnectWallet',

  /* queries */
  GET_ADDRESS = 'GetAddress',
  GET_XPLA_AMOUNT = 'GetXplaAmount',
  GET_CONTRACT_INFO = 'GetContractInfo',
  GET_CONTRACT_QUERY = 'GetContractQuery',
  GET_CW20_TOKEN_INFO = 'GetCW20TokenInfo',
  GET_CW20_BALANCE = 'GetCW20Balance',
  GET_CW721_TOKENS = 'GetCW721Tokens',
  GET_CW721_TOKEN_INFO = 'GetCW721TokenInfo',

  /* tx */
  POST_TX = 'PostTx',
  GET_TX_RESULT = 'GetTxResult',
  SEND_TOKEN = 'SendToken',
  SEND_NFT = 'SendNFT',
  EXECUTE_CONTRACT = 'ExecuteContract',
}

export enum GAME_SEND_TYPE {
  /* connect */
  CONNECTED_WALLET = 'CONNECTED_WALLET',
  DISCONNECTED_WALLET = 'DISCONNECTED_WALLET',

  /* queries */
  SET_ADDRESS = 'SET_ADDRESS',
  SET_XPLA_AMOUNT = 'SET_XPLA_AMOUNT',
  SET_CONTRACT_INFO = 'SET_CONTRACT_INFO',
  SET_CONTRACT_QUERY = 'SET_CONTRACT_QUERY',
  SET_CW20_TOKEN_INFO = 'SET_CW20_TOKEN_INFO',
  SET_CW20_BALANCE = 'SET_CW20_BALANCE',
  SET_CW721_TOKENS = 'SET_CW721_TOKENS',
  SET_CW721_TOKEN_INFO = 'SET_CW721_TOKEN_INFO',

  /* tx */
  POST_TX = 'POST_TX',
  SET_TX_RESULT = 'SET_TX_RESULT',
  EXIPRE_TX = 'EXPIRE_TX',
  SEND_TOKEN = 'SEND_TOKEN',
  SEND_NFT = 'SEND_NFT',
  EXECUTE_CONTRACT = 'EXECUTE_CONTRACT',
}

export interface CW20TokenInfoResponse {
  symbol: string;
  name: string;
  decimals: number;
  total_supply: Amount;
}

export interface CW721TokenInfoResponse {
  token_uri: string;
  extension: any;
}
