import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { BaseEntity } from '@orion/db';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ type: 'text', nullable: true })
  productDescription?: string;

  @Column({ type: 'int', name: 'unit_price' })
  unitPrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  subtotal: number;

  // Imagem do produto (snapshot da URL)
  @Column({ name: 'product_image_url', nullable: true })
  productImageUrl?: string;

  // Categoria do produto (para analytics)
  @Column({ nullable: true })
  category?: string;

  // Se o item foi removido/cancelado individualmente
  @Column({ default: false, name: 'is_cancelled' })
  isCancelled: boolean;

  @Column({ name: 'cancel_reason', nullable: true })
  cancelReason?: string;
}
