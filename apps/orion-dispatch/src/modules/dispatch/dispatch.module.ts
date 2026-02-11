import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispatch } from '../entities';
import { DispatchService } from './dispatch.service';
@Module({
  imports: [TypeOrmModule.forFeature([Dispatch])],
  providers: [DispatchService],
})
export class DispatchModule {}
