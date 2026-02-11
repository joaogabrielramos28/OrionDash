import { Injectable, OnModuleInit } from '@nestjs/common';
import { QUEUES, RabbitMQService } from '@orion/queue';
import { CourierGeoService } from './courier-geo.service';
import { CourierStatus } from '@orion/contracts';

@Injectable()
export class CourierGeoConsumer implements OnModuleInit {
  constructor(
    private readonly geoService: CourierGeoService,
    private readonly rabbit: RabbitMQService,
  ) {}

  async onModuleInit() {
    await this.rabbit.subscribe(
      QUEUES.DISPATCH_COURIER_STATUS_UPDATED,
      async (data) => {
        const { courierId, lastLat, lastLng, status } = data;

        if (status === CourierStatus.AVAILABLE) {
          console.log('aqi');

          return await this.geoService.setAvailable(
            courierId,
            lastLat,
            lastLng,
          );
        }

        await this.geoService.remove(courierId);
      },
    );
  }
}
