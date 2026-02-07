import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  async create(@Body() data: Partial<Order>) {
    return await this.orderService.createOrder(data);
  }

  @Get('/customer/:id')
  async findOrdersByCustomer(@Param('id') customerId: string) {
    return await this.orderService.findOrdersByCustomer(customerId);
  }
}
