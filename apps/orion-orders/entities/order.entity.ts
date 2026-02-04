import { Entity, Column, OneToMany } from 'typeorm';
import {} from '@orion/contracts';
@Entity('orders')
export class Order extends BaseEntity {
  @Column()
  customerId: string;

  @Column()
  restaurantId: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  courierId?: string;

  @Column({ nullable: true })
  paymentId?: string;

  @Column({ type: 'jsonb', nullable: true })
  deliveryAddress: {
    street: string;
    number: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column({ nullable: true })
  cancelReason?: string;
}
