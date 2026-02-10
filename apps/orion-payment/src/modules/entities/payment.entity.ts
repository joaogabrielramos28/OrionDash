import { BaseEntity } from '@orion/db';
import { Address, OrderStatus } from '@orion/contracts';
import { Column, Entity } from 'typeorm';

@Entity('payment')
export class Payment extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @Column({ default: 'stripe' })
  provider: string;

  @Column({ default: 'provider_transaction_id', nullable: true })
  providerTransactionId?: string;

  @Column({ default: 'correlation_id', nullable: true })
  correlationId?: string;
}
