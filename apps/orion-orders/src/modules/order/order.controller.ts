import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  async create(@Body() data: Partial<Order>) {
    return await this.orderService.createOrder(data);
  }
}
