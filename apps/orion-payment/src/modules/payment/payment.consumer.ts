import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QUEUES, RabbitMQService } from '@orion/queue';
import { PaymentService } from './payment.service';

@Injectable()
export class PaymentConsumer implements OnModuleInit {
  private readonly logger = new Logger(PaymentConsumer.name);
  constructor(
    private readonly rabbit: RabbitMQService,
    private readonly paymentService: PaymentService,
  ) {}

  async onModuleInit() {
    await this.rabbit.subscribe(
      QUEUES.PAYMENT_ORDER_CREATED,
      async (data, message) => {
        this.logger.log(`📥 Recebido pedido para pagamento: ${data.orderId}`);

        console.log('data', data);
        console.log('message', message);

        try {
          await this.paymentService.processPayment({
            amount: data.amount,
            orderId: data.orderId,
            restaurantId: data.restaurantId,
            correlationId: message.metadata?.correlationId,
          });
        } catch (error) {
          this.logger.error(
            `❌ Erro ao processar pagamento do pedido ${data.orderId}`,
            error,
          );
          throw error; // O seu package fará o NACK e mandará para a DLQ
        }
      },
    );

    await this.rabbit.subscribe(
      QUEUES.ORDER_PAYMENT_REFUNDED,
      async (data, message) => {
        this.logger.log(`📥 Recebido pedido de reembolso: ${data.orderId}`);
        try {
          await this.paymentService.processRefund(data.orderId);
        } catch (error) {
          this.logger.error(
            `❌ Erro ao processar reembolso do pedido ${data.orderId}`,
            error,
          );
          throw error; // O seu package fará o NACK e mandará para a DLQ
        }
      },
    );
  }
}
