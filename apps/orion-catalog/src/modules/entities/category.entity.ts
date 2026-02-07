import { BaseEntity } from '@orion/db';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('category')
export class Category extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'display_order', type: 'int' })
  displayOrder: number;

  @ManyToOne(() => Restaurant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;
}
