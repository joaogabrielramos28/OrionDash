import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@orion/db';

import { ConfigModule } from '@nestjs/config';
import { Order } from './modules/entities/order.entity';
import { OrderItem } from './modules/entities/order-item.entity';
import { OrderModule } from './modules/order/order.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@orion/contracts';
import { RabbitMQModule, EXCHANGES, QUEUES, ROUTING_KEYS } from '@orion/queue';
@Module({
  imports: [
    DatabaseModule.forRoot({
      entities: [Order, OrderItem],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
          name: QUEUES.ORDER_PAYMENT_SUCCEEDED,
          exchange: EXCHANGES.MAIN,
          routingKey: ROUTING_KEYS.ORDER_PAYMENT_SUCCEEDED,
          options: {
            durable: true,
            deadLetterExchange: EXCHANGES.DLX,
            deadLetterRoutingKey: ROUTING_KEYS.ORDER_PAYMENT_SUCCEEDED_FAILED,
          },
        },
        {
          name: QUEUES.ORDER_PAYMENT_FAILED,
          exchange: EXCHANGES.MAIN,
          routingKey: ROUTING_KEYS.ORDER_PAYMENT_FAILED,
          options: { durable: true },
        },
        {
          name: QUEUES.DISPATCH_FAILED,
          exchange: EXCHANGES.MAIN,
          routingKey: ROUTING_KEYS.DISPATCH_FAILED,
          options: { durable: true },
        },
      ],
      prefetchCount: 10,
    }),
    OrderModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
