import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QUEUES, RabbitMQService } from '@orion/queue';
import { CourierService } from './courier.service';
import { CourierStatus } from '@orion/contracts';

@Injectable()
export class CourierConsumer implements OnModuleInit {
  private logger = new Logger(CourierConsumer.name);
  constructor(
    private readonly rabbit: RabbitMQService,
    private readonly courierService: CourierService,
  ) {}
  async onModuleInit() {
    await this.rabbit.subscribe(
      QUEUES.COURIER_ASSIGNMENT_REQUESTED,
      async (data, message) => {
        const { courierId, orderId } = data;

        this.logger.log(
          `🚚 Entregador ${courierId} foi atribuído ao pedido ${orderId}. Mudando status para BUSY...`,
        );

        await this.courierService.updateStatus(courierId, CourierStatus.BUSY);
      },
    );
  }
}
