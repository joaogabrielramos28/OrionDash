import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispatch } from '../entities';
import { DispatchService } from './dispatch.service';
import { OrderConsumer } from './order.consumer';
import { CourierGeoModule } from '../courier-geo/courier-geo.module';
@Module({
  imports: [TypeOrmModule.forFeature([Dispatch]), CourierGeoModule],
  providers: [DispatchService, OrderConsumer],
})
export class DispatchModule {}
