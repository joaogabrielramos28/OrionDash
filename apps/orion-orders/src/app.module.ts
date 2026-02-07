import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@orion/db';

import { ConfigModule } from '@nestjs/config';
import { Order } from './modules/entities/order.entity';
import { OrderItem } from './modules/entities/order-item.entity';
@Module({
  imports: [
    DatabaseModule.forRoot({
      entities: [Order, OrderItem],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
