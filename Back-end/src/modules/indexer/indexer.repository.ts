import { Injectable, Logger } from '@nestjs/common';
import {
  ETHERSCAN_API_KEY,
  ETHERSCAN_BASE_API_URL,
  GWEI_IN_WEI,
} from '../../constants/etherscan';
import {
  EtherscanNormalTransactionsListResponse,
  NormalTransaction,
  EtherscanTokenTransferListResponse,
  TokenTransfer,
} from './types';
import { ethers } from 'ethers';
import { INFURA_API_KEY } from '../../constants/infura';

@Injectable()
export class IndexerRepository {
  private readonly logger = new Logger(IndexerRepository.name);

  // https://docs.etherscan.io/etherscan-v2/api-endpoints/accounts#get-a-list-of-normal-transactions-by-address
  async getListOfNormalTransactionsByAddress(
    address: string,
    startblock: number,
    endblock: number,
    page = 1,
    offset = 100,
    sort: 'asc' | 'desc' = 'asc',
  ) {
    const url = `${ETHERSCAN_BASE_API_URL}&module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${ETHERSCAN_API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status} ${response.statusText}`,
        );
      }
      const {
        result,
        message,
        status,
      }: EtherscanNormalTransactionsListResponse = await response.json();
      this.logger.debug({message,status})


      return this.transformTransactions(result);
    } catch (error) {
      this.logger.error('Unexpected error:', error);
      throw error;
    }
  }

  //http://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-erc20-token-transfer-events-by-address
  async getListOfERC20TokenTransferEventsByAddress(
    contractaddress: string,
    startblock: number,
    endblock: number,
    page = 1,
    offset = 100,
    sort: 'asc' | 'desc' = 'asc',
  ) {
    const url = `${ETHERSCAN_BASE_API_URL}&module=account&action=tokentx&contractaddress=${contractaddress}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${ETHERSCAN_API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status} ${response.statusText}`,
        );
      }
      const { status, message, result }: EtherscanTokenTransferListResponse =
        await response.json();
      this.logger.debug({message,status})
      return this.transformTokenTransfers(result);
    } catch (error) {
      this.logger.error('Unexpected error:', error);
      throw error;
    }
  }

  //https://docs.etherscan.io/api-endpoints/blocks#get-block-number-by-timestamp
  async getEthBalanceByTimestamp(
    timestamp: number,
    address: string,
    closest: 'before' | 'after' = 'before',
  ) {
    const url = `${ETHERSCAN_BASE_API_URL}&module=block&action=getblocknobytime&timestamp=${timestamp}&closest=${closest}&apikey=${ETHERSCAN_API_KEY}`;

    try {
      const response = await fetch(url); //First, find the block number by timestamp.
      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      if (data.status !== '1' || data.message !== 'OK') {
        this.logger.error(
          `Etherscan API error: ${data.message}. Please check the request parameters and try again.`,
        );
        throw new Error(data.message);
      }
      const blockNumber = Number(data.result);
      const { balanceWei, balanceEth, balanceHex } =
        await this.getEthBalanceByAddressAndDate(address, blockNumber);
      return { blockNumber, balanceWei, balanceEth, balanceHex };
    } catch (error) {
      this.logger.error('Unexpected error:', error);
      throw error;
    }
  }

  //Fetches the ETH balance of an address at a specific blockNumber
  private async getEthBalanceByAddressAndDate(
    address: string,
    blockNumber: number,
  ) {
    const blockNumberHex = '0x' + blockNumber.toString(16);
    this.logger.debug('getEthBalanceByAddressAndDate()# Fetching ETH balance', {
      address,
      blockNumber,
      blockNumberHex,
    });

    const url = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;

    const payload = {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [
        address,
        blockNumberHex, // block number in hex
      ],
      id: 1,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      this.logger.debug('infura.io#eth_getBalance() response', data.result);
      const balanceEth = ethers.formatEther(data.result);
      const balanceWei = ethers.formatUnits(data.result, 'wei');

      return {
        balanceHex: data.result,
        balanceWei,
        balanceEth,
      };
    } catch (error) {
      this.logger.error('Unexpected error:', error);
      throw error;
    }
  }

  private transformTokenTransfers(transactions: TokenTransfer[]) {
    return transactions.map((tx) => ({
      blockNumber: tx.blockNumber,
      hash: tx.hash,
      nonce: tx.nonce,
      blockHash: tx.blockHash,
      transactionIndex: tx.transactionIndex,
      from: tx.from.toLowerCase(),
      to: tx.to?.toLowerCase() || null,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gasPrice,
      cumulativeGasUsed: tx.cumulativeGasUsed,
      gasUsed: tx.gasUsed,
      confirmations: tx.confirmations,
      timeStamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
      contractAddress: tx.contractAddress?.toLowerCase() || null,
      methodId: tx.methodId || null,
      functionName: tx.functionName || null,
      tokenName: tx.tokenName,
      tokenSymbol: tx.tokenSymbol,
      tokenDecimal: tx.tokenDecimal,
      ...this.calculateGasMetrics(tx.gasUsed, tx.gasPrice, tx.hash),
    }));
  }

  private transformTransactions(transactions: NormalTransaction[]) {
    return transactions.map((tx) => ({
      ...this.calculateGasMetrics(tx.gasUsed, tx.gasPrice, tx.hash),
      blockNumber: tx.blockNumber,
      hash: tx.hash,
      nonce: tx.nonce,
      blockHash: tx.blockHash,
      transactionIndex: tx.transactionIndex,
      from: tx.from.toLowerCase(),
      to: tx.to?.toLowerCase() || null,
      value: tx.value,
      valueEth: ethers.formatUnits(tx.value, 'ether'),
      gas: tx.gas,
      gasPrice: tx.gasPrice,
      cumulativeGasUsed: tx.cumulativeGasUsed,
      gasUsed: tx.gasUsed,
      confirmations: tx.confirmations,
      timeStamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
      isError: tx.isError === '1',
      txReceiptStatus: tx.txreceipt_status === '1',
      contractAddress: tx.contractAddress?.toLowerCase() || null,
      methodId: tx.methodId || null,
      functionName: tx.functionName || null,
    }));
  }

  private calculateGasMetrics(gasUsed: string, gasPrice: string, hash: string) {
    try {
      const gasCost = (BigInt(gasUsed) * BigInt(gasPrice)).toString();
      const effectiveGasPrice = (BigInt(gasPrice) / GWEI_IN_WEI).toString();
      return { gasCost, effectiveGasPrice };
    } catch (error) {
      this.logger.warn(`Failed to calculate gas metrics for tx ${hash}`);
      return { gasCost: null, effectiveGasPrice: null }; //todo maybe not a good idea
    }
  }
}
