import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@orion/db';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: BaseRepository<Order>,
  ) {}

  public async getOrder(id: string): Promise<Order> {
    return await this.orderRepository.findOneBy({ id });
  }

  public async getOrdersByRestaurant(restaurantId: string): Promise<Order[]> {
    return await this.orderRepository.findBy({ restaurantId });
  }

  private calculateOrderTotal(items: Partial<OrderItem>[]) {
    return items.reduce((acc, current) => acc + current.subtotal, 0);
  }

  private calculateOrderItemsSubtotal(items: OrderItem[]) {
    const orderItemCalculated = items.map((item) => ({
      ...item,
      subtotal: item.quantity * item.unitPrice,
    }));
    return orderItemCalculated;
  }

  public async createOrder(orderData: Partial<Order>): Promise<Order> {
    const itemsWithSubtotal = this.calculateOrderItemsSubtotal(orderData.items);
    const orderTotalAmount = this.calculateOrderTotal(itemsWithSubtotal);

    const order = this.orderRepository.create({
      ...orderData,
      items: itemsWithSubtotal,
      totalAmount: orderTotalAmount,
    });

    return await this.orderRepository.save(order);
  }
}
