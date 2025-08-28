import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { IndexerRepository } from './indexer.repository';
import { IndexerController } from './indexer.controller';

@Module({
  providers: [IndexerService, IndexerRepository],
  controllers: [IndexerController],
  exports: [IndexerService],
})
export class IndexerModule {}
