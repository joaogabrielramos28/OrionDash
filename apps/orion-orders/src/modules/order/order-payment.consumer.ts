import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QUEUES, RabbitMQService } from '@orion/queue';
import { OrderService } from './order.service';

import { OrderStatus } from '@orion/contracts';
@Injectable()
export class OrderPaymentConsumer implements OnModuleInit {
  private readonly logger = new Logger(OrderPaymentConsumer.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly rabbit: RabbitMQService,
  ) {}

  async onModuleInit() {
    await this.rabbit.subscribe(
      QUEUES.ORDER_PAYMENT_SUCCEEDED,
      async (data) => {
        this.logger.log(`✅ Pagamento aprovado para o pedido: ${data.orderId}`);
        await this.orderService.updateOrderStatus(
          data.orderId,
          OrderStatus.PAID,
        );
      },
    );

    await this.rabbit.subscribe('orders.payment.failed', async (data) => {
      this.logger.log(
        `❌ Pagamento negado para o pedido: ${data.orderId}. Motivo: ${data.reason}`,
      );
      await this.orderService.updateOrderStatus(
        data.orderId,
        OrderStatus.PAYMENT_FAILED,
      );
    });
  }
}
