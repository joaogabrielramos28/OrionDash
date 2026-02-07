import { BaseEntity } from '@orion/db';
import { Address } from '@orion/contracts';
import { Column, Entity } from 'typeorm';

@Entity('restaurant')
export class Restaurant extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ default: false, name: 'is_open' })
  isOpen: boolean;

  @Column({ type: 'jsonb', name: 'address' })
  address: Address;
}
