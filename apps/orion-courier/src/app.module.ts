import { Module } from '@nestjs/common';
import { DatabaseModule } from '@orion/db';
import { ConfigModule } from '@nestjs/config';
import { EXCHANGES, QUEUES, RabbitMQModule, ROUTING_KEYS } from '@orion/queue';
import { CourierModule } from './modules/courier/courier.module';
import { Courier } from './modules/entities';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule.forRoot({
      entities: [Courier],
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
          name: QUEUES.COURIER_ASSIGNMENT_REQUESTED,
          exchange: EXCHANGES.MAIN,
          routingKey: ROUTING_KEYS.COURIER_ASSIGNMENT_REQUESTED,
          options: {
            durable: true,
            deadLetterExchange: EXCHANGES.DLX,
            deadLetterRoutingKey:
              ROUTING_KEYS.COURIER_ASSIGNMENT_REQUESTED_FAILED,
          },
        },
      ],
    }),
    CourierModule,
  ],
})
export class AppModule {}
