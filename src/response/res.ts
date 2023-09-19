import { ResConnectedWallet } from './connected-wallet';
import { ResContractInfo } from './contract-info';
import { ResContractQuery } from './contract-query';
import { ResCW20Balance } from './cw20-balance';
import { ResCW20TokenInfo } from './cw20-token-info';
import { ResCW721TokenInfo } from './cw721-token-info';
import { ResCW721Tokens } from './cw721-tokens';
import { ResDisconnectedWallet } from './disconnected-wallet';
import { ResSimulationTx } from './simulation-tx';

export type Res =
  | ResConnectedWallet
  | ResDisconnectedWallet
  | ResContractInfo
  | ResContractQuery
  | ResCW20TokenInfo
  | ResCW20Balance
  | ResCW721Tokens
  | ResCW721TokenInfo
  | ResSimulationTx;
