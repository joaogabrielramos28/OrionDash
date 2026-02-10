import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CatalogIntegrationModule } from '../../integrations/catalog/catalog-integration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderPaymentConsumer } from './order-payment.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), CatalogIntegrationModule],
  controllers: [OrderController],
  providers: [OrderService, OrderPaymentConsumer],
})
export class OrderModule {}
