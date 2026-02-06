import { BaseEntity } from '@orion/db';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Category } from './category.entity';

@Entity('product')
export class Product extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ type: 'text' })
  description: boolean;

  @Column({ type: 'int' })
  price: number;

  @Column({ default: false, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'image_key' })
  imageKey: string;

  @ManyToOne(() => Restaurant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @ManyToOne(() => Category, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: string;
}
