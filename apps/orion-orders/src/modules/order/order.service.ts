import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CatalogClientService } from '../../integrations/catalog/catalog-client.service';
import { Repository } from 'typeorm';
import { GetResponse, OrderStatus } from '@orion/contracts';
import { EXCHANGES, RabbitMQService, ROUTING_KEYS } from '@orion/queue';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly catalogClient: CatalogClientService,
    private readonly queueService: RabbitMQService,
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

  public async createOrder(orderData: Partial<Order>): Promise<Order> {
    const hasAtLeastOneItemWithoutQuantity = orderData.items.some(
      (item) => !item.quantity || item.quantity <= 0,
    );

    if (hasAtLeastOneItemWithoutQuantity) {
      throw new BadRequestException(
        'All items must have a quantity greater than zero',
      );
    }

    const products = await this.catalogClient.getProductsForOrder({
      restaurantId: orderData.restaurantId,
      productIds: orderData.items.map((item) => item.productId),
    });

    const itemsWithSubtotal = orderData.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new BadRequestException(
          `Product with ID ${item.productId} not found for this restaurant`,
        );
      }

      return {
        ...item,
        unitPrice: product.price,
        subtotal: product.price * item.quantity,
        priceVersion: String(product.priceVersion),
      };
    });

    if (products.length !== orderData.items.length) {
      throw new BadRequestException(
        'Some products are invalid for this restaurant',
      );
    }

    const orderTotalAmount = this.calculateOrderTotal(itemsWithSubtotal);

    const order = this.orderRepository.create({
      ...orderData,
      items: itemsWithSubtotal,
      totalAmount: orderTotalAmount,
    });

    const createdOrder = await this.orderRepository.save(order);

    await this.queueService.publish(
      EXCHANGES.MAIN,
      ROUTING_KEYS.ORDER_CREATED,
      {
        orderId: createdOrder.id,
        restaurantId: createdOrder.restaurantId,
        amount: createdOrder.totalAmount,
      },
    );

    return createdOrder;
  }

  async findOrdersByCustomer(customerId: string): Promise<GetResponse<Order>> {
    const [orders, count] = await this.orderRepository.findAndCount({
      where: {
        customerId,
      },
    });

    return {
      data: orders,
      count,
    };
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    order.status = status;

    const updatedOrder = await this.orderRepository.save(order);

    if (status === OrderStatus.PAID) {
      await this.queueService.publish(EXCHANGES.MAIN, ROUTING_KEYS.ORDER_PAID, {
        orderId: updatedOrder.id,
        customerId: updatedOrder.customerId,
        origin: updatedOrder.deliveryAddress,
      });
    }

    return updatedOrder;
  }
}
