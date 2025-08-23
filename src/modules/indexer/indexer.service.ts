import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { IndexerRepository } from './indexer.repository';

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  constructor(private readonly indexerRepository: IndexerRepository) {}

  //todo should return failed transactions too or not?
  async getListOfNormalTransactionsByAddress(
    address: string,
    startblock: number,
    endblock: number,
    page = 1,
    offset = 100,
    sort: 'asc' | 'desc' = 'asc',
  ) {
    try {
      const transactions =
        await this.indexerRepository.getListOfNormalTransactionsByAddress(
          address,
          startblock,
          endblock,
          page,
          offset,
          sort,
        );

      return {
        success: true,
        data: {
          transactions,
          metadata: {
            address,
            blockRange: { start: startblock, end: endblock },
            pagination: { page, offset },
            sort,
            count: transactions.length,
          },
        },
      };
    } catch (error) {
      this.logger.error('Error fetching transactions:', {
        address,
        startblock,
        endblock,
        error: error.message,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error while fetching transactions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBlockNumberByTimestamp(
    timestamp: number,
    address: string,
    closest: 'before' | 'after' = 'before',
  ) {
    try {
      const { blockNumber, balanceWei, balanceEth, balanceHex } =
        await this.indexerRepository.getBlockNumberByTimestamp(
          timestamp,
          address,
          closest,
        );

      return {
        success: true,
        data: { blockNumber, balanceWei, balanceEth, balanceHex },
      };
    } catch (error) {
      this.logger.error('Error fetching block number by timestamp:', {
        timestamp,
        error: error.message,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error while fetching block number',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListOfERC20TokenTransferEventsByAddress(
    contractaddress: string,
    startblock: number,
    endblock: number,
    page = 1,
    offset = 100,
    sort: 'asc' | 'desc' = 'asc',
  ) {
    try {
      const events =
        await this.indexerRepository.getListOfERC20TokenTransferEventsByAddress(
          contractaddress,
          startblock,
          endblock,
          page,
          offset,
          sort,
        );

      return {
        success: true,
        data: {
          events,
          metadata: {
            contractaddress,
            blockRange: { start: startblock, end: endblock },
            pagination: { page, offset },
            sort,
            count: events.length,
          },
        },
      };
    } catch (error) {
      this.logger.error('Error fetching ERC20 token transfer events:', {
        contractaddress,
        startblock,
        endblock,
        error: error.message,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error while fetching ERC20 token transfer events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
