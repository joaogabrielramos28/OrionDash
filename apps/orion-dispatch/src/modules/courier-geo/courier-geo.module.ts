import { Module } from '@nestjs/common';
import { CourierGeoConsumer } from './courier-geo.consumer';
import { CourierGeoService } from './courier-geo.service';

@Module({
  providers: [CourierGeoConsumer, CourierGeoService],
})
export class CourierGeoModule {}
