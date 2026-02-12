import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Dispatch } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { EXCHANGES, RabbitMQService, ROUTING_KEYS } from '@orion/queue';
import { CourierGeoService } from '../courier-geo/courier-geo.service';

@Injectable()
export class DispatchService {
  private logger = new Logger(DispatchService.name);
  constructor(
    @InjectRepository(Dispatch)
    private readonly dispatchRepository: Repository<Dispatch>,
    private readonly rabbit: RabbitMQService,

    private readonly geoService: CourierGeoService,
  ) {}

  async handleOrderPaid(orderId: string, lat: number, lng: number) {
    const nearbyCouriers = (await this.geoService.findNearby(
      lng,
      lat,
      5,
    )) as any as string[];

    console.log('Nearby couriers:', nearbyCouriers);

    if (nearbyCouriers.length === 0) {
      this.logger.log(
        `⚠️ Nenhum entregador disponível num raio de 5km para o pedido ${orderId}`,
      );
      await this.rabbit.publish(EXCHANGES.MAIN, ROUTING_KEYS.DISPATCH_FAILED, {
        orderId,
        reason: 'NO_COURIERS_AVAILABLE',
      });
      return;
    }

    const selectedCourierId = nearbyCouriers[0];

    this.logger.log(
      `✅ Entregador encontrado: ${selectedCourierId}. Atribuindo...`,
    );

    await this.rabbit.publish(EXCHANGES.MAIN, ROUTING_KEYS.DISPATCH_ASSIGNED, {
      orderId,
      courierId: selectedCourierId,
    });

    await this.rabbit.publish(
      EXCHANGES.MAIN,
      ROUTING_KEYS.COURIER_ASSIGNMENT_REQUESTED,
      {
        courierId: selectedCourierId,
        orderId,
      },
    );
  }
}
