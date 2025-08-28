export interface NormalTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId?: string; //todo maybe not (?)optional
  functionName?: string;
}

export interface EtherscanNormalTransactionsListResponse {
  status: string; // Expect "1" for success
  message: string; // Expect "OK" for success
  result: NormalTransaction[];
}

export interface EtherscanTokenTransferListResponse {
  status: string;
  message: string; // "OK" for success
  result: TokenTransfer[]; // Array of transfers or error string
}

export interface TokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  methodId: string;
  functionName?: string;
  confirmations: string;
}
