import { Module } from '@nestjs/common';
import { DatabaseModule } from '@orion/db';

import { ConfigModule } from '@nestjs/config';

import { EXCHANGES, QUEUES, RabbitMQModule, ROUTING_KEYS } from '@orion/queue';
import { Dispatch } from './modules/entities';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { RedisModule } from '@orion/redis';
import { CourierGeoModule } from './modules/courier-geo/courier-geo.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule.forRoot({
      entities: [Dispatch],
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
          name: QUEUES.DISPATCH_ORDER_PAID,
          exchange: EXCHANGES.MAIN,
          routingKey: ROUTING_KEYS.ORDER_PAID,
          options: {
            durable: true,
            deadLetterExchange: EXCHANGES.DLX,
            deadLetterRoutingKey: ROUTING_KEYS.ORDER_PAID_FAILED,
          },
        },
        {
          name: QUEUES.DISPATCH_COURIER_STATUS_UPDATED,
          exchange: EXCHANGES.MAIN,
          routingKey: ROUTING_KEYS.COURIER_STATUS_UPDATED,
          options: {
            durable: true,
            deadLetterExchange: EXCHANGES.DLX,
            deadLetterRoutingKey: ROUTING_KEYS.COURIER_STATUS_UPDATED_FAILED,
          },
        },
      ],
    }),

    RedisModule,
    CourierGeoModule,
    DispatchModule,
  ],
})
export class AppModule {}
