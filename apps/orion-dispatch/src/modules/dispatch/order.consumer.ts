import { Injectable, OnModuleInit } from '@nestjs/common';
import { QUEUES, RabbitMQService } from '@orion/queue';
import { DispatchService } from './dispatch.service';

@Injectable()
export class OrderConsumer implements OnModuleInit {
  constructor(
    private readonly rabbit: RabbitMQService,
    private readonly dispatchService: DispatchService,
  ) {}

  async onModuleInit() {
    await this.rabbit.subscribe(QUEUES.DISPATCH_ORDER_PAID, async (data) => {
      const { orderId, origin } = data;
      console.log('data', data);

      await this.dispatchService.handleOrderPaid(
        orderId,
        origin.location.lat,
        origin.location.lng,
      );
    });
  }
}
