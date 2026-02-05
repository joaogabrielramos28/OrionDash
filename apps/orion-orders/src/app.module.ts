import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@orion/db';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ConfigModule } from '@nestjs/config';
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
