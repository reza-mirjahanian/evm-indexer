import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexerService } from './indexer.service';
import {
  GetBlockNumberByTimestampDto,
  GetERC20TransfersDto,
  GetTransactionsDto,
} from './dto/get-transactions.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('indexer')
@Controller('api')
@ApiResponse({ status: 400, description: 'Bad Request.' })
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiResponse({ status: 500, description: 'Internal Server Error.' })
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @Get('/account/txlist/:address/:startblock/:endblock/:page/:offset/:sort')
  @ApiOperation({
    summary:
      'Returns the list of normal transactions performed by an address, with  pagination.',
  })
  @ApiParam({
    name: 'address',
    required: true,
    description: 'The address to check for transactions',
    example: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
    type: String,
  })
  @ApiParam({
    name: 'startblock',
    required: true,
    description: 'Start block',
    example: 22314120,
    type: Number,
  })
  @ApiParam({
    name: 'endblock',
    required: true,
    description: 'End block',
    example: 23196430,
    type: Number,
  })
  @ApiParam({
    name: 'page',
    required: true,
    description:
      'page number , Its important to set the next  startBlock to the block number of the last record - 1',
    type: Number,
    example: 1,
  })
  @ApiParam({
    name: 'offset',
    required: false,
    description: 'number of transactions displayed per page (default 100)',
    type: Number,
    example: 100,
  })
  @ApiParam({
    name: 'sort',
    required: false,
    description: 'Sort by asc or desc (default asc)',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Operation done successfully.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  async getListOfNormalTransactionsByAddress(
    @Param() params: GetTransactionsDto, // Maybe Use @Query
  ) {
    return this.indexerService.getListOfNormalTransactionsByAddress(
      params.address,
      params.startblock,
      params.endblock,
      params.page,
      params.offset,
      params.sort,
    );
  }

  @Get(
    '/account/tokentx/:contractaddress/:startblock/:endblock/:page/:offset/:sort',
  )
  @ApiOperation({
    summary:
      'Get a list of "ERC-20 - Token Transfer Events" by Address, with  pagination.',
  })
  @ApiParam({
    name: 'contractaddress',
    required: true,
    description: 'The contract address of the ERC-20 token',
    example: '0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f', // Trace token
    type: String,
  })
  @ApiParam({
    name: 'startblock',
    required: true,
    description: 'Start block',
    example: 9000000,
    type: Number,
  })
  @ApiParam({
    name: 'endblock',
    required: true,
    description: 'End block',
    example: 9001000,
    type: Number,
  })
  @ApiParam({
    name: 'page',
    required: true,
    description:
      'page number , Its important to set the next  startBlock to the block number of the last record - 1',
    type: Number,
    example: 1,
  })
  @ApiParam({
    name: 'offset',
    required: false,
    description: 'number of transactions displayed per page (default 100)',
    type: Number,
    example: 100,
  })
  @ApiParam({
    name: 'sort',
    required: false,
    description: 'Sort by asc or desc (default asc)',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Operation done successfully.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  async getListOfERC20TokenTransferEventsByAddress(
    @Param() params: GetERC20TransfersDto,
  ) {
    return this.indexerService.getListOfERC20TokenTransferEventsByAddress(
      params.contractaddress,
      params.startblock,
      params.endblock,
      params.page,
      params.offset,
      params.sort,
    );
  }

  @Get('/block/numberByTimestamp/:timestamp/:address/:closest')
  @ApiOperation({
    summary: 'Get block number by timestamp',
  })
  @ApiParam({
    name: 'timestamp',
    required: true,
    description: 'The timestamp to check for block number',
    example: 1756015576,
    type: Number,
  })
  @ApiParam({
    name: 'address',
    required: true,
    description: 'The address to check for ETH balance at the block',
    example: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
    type: String,
  })
  @ApiParam({
    name: 'closest',
    required: false,
    description: 'closest block before or after the timestamp (default before)',
    enum: ['before', 'after'],
    example: 'before',
  })
  @ApiResponse({
    status: 200,
    description: 'Operation done successfully.',
  })
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBlockNumberByTimestamp(
    @Param() params: GetBlockNumberByTimestampDto,
  ) {
    return this.indexerService.getBlockNumberByTimestamp(
      params.timestamp,
      params.address,
      params.closest,
    );
  }
}
