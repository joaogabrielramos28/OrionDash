import { Entity, Column, OneToMany } from 'typeorm';
import { Address, OrderStatus } from '@orion/contracts';
import { BaseEntity } from '@orion/db';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column()
  customerId: string;

  @Column()
  restaurantId: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @Column({ type: 'int', name: 'total_amount' })
  totalAmount: number;

  @Column({ nullable: true, name: 'courier_id' })
  courierId?: string;

  @Column({ nullable: true, name: 'payment_id' })
  paymentId?: string;

  @Column({ type: 'jsonb', name: 'delivery_address' })
  deliveryAddress: Address;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @Column({ nullable: true, name: 'cancel_reason' })
  cancelReason?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'paid_at' })
  paidAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'assigned_at' })
  assignedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'picked_up_at' })
  pickedUpAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'delivered_at' })
  deliveredAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'cancelled_at' })
  cancelledAt?: Date;
}
