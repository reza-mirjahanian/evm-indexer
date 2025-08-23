import {
  IsEthereumAddress,
  IsInt,
  Min,
  Max,
  IsIn,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsGreaterThan } from './IsGreaterThan';
import { IsBlockRangeValid } from './IsBlockRangeValid';

export class GetTransactionsDto {
  @IsEthereumAddress()
  address: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  startblock: number;

  @IsGreaterThan('startblock', {
    message: 'endblock must be greater than startblock',
  })
  @IsBlockRangeValid()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  endblock: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000) // Etherscan limit
  @IsOptional()
  offset?: number = 100;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort?: 'asc' | 'desc' = 'asc';
}

export class GetERC20TransfersDto {
  @IsEthereumAddress()
  contractaddress: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  startblock: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsGreaterThan('startblock', {
    message: 'endblock must be greater than startblock',
  })
  @IsBlockRangeValid()
  endblock: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000) // Etherscan limit
  @IsOptional()
  offset?: number = 100;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort?: 'asc' | 'desc' = 'asc';
}

export enum ClosestType {
  BEFORE = 'before',
  AFTER = 'after',
}

export class GetBlockNumberByTimestampDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  timestamp: number;

  @IsEthereumAddress()
  address: string;

  @IsEnum(ClosestType)
  closest: ClosestType;
}
