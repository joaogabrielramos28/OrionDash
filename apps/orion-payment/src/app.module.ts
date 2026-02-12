import { Module } from '@nestjs/common';
import { DatabaseModule } from '@orion/db';

import { ConfigModule } from '@nestjs/config';
import { Payment } from './modules/entities';
import { PaymentModule } from './modules/payment/payment.module';

import { EXCHANGES, QUEUES, RabbitMQModule, ROUTING_KEYS } from '@orion/queue';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule.forRoot({
      entities: [Payment],
    }),
    RabbitMQModule.forRoot({
      url: process.env.RABBITMQ_URL,
      exchanges: [
        {
          name: EXCHANGES.MAIN,
          type: 'topic',
          options: { durable: true },
        },
        {
          name: EXCHANGES.DLX,
          type: 'topic',
          options: { durable: true },
        },
      ],
      queues: [
        {
          name: QUEUES.PAYMENT_ORDER_CREATED,
          exchange: EXCHANGES.MAIN,
          routingKey: ROUTING_KEYS.ORDER_CREATED,
          options: {
            durable: true,
            deadLetterExchange: EXCHANGES.DLX,
            deadLetterRoutingKey: ROUTING_KEYS.ORDER_CREATED_FAILED,
          },
        },
        {
          name: QUEUES.ORDER_PAYMENT_REFUNDED,
          exchange: EXCHANGES.MAIN,
          routingKey: ROUTING_KEYS.ORDER_PAYMENT_REFUNDED,
          options: {
            durable: true,
            deadLetterExchange: EXCHANGES.DLX,
            deadLetterRoutingKey: ROUTING_KEYS.ORDER_PAYMENT_REFUNDED_FAILED,
          },
        },
      ],
    }),

    PaymentModule,
  ],
})
export class AppModule {}
