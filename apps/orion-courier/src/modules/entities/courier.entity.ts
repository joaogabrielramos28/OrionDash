import { CourierStatus } from '@orion/contracts';
import { BaseEntity } from '@orion/db';
import { Column, Entity } from 'typeorm';

@Entity('courier')
export class Courier extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: ['BICYCLE', 'MOTORCYCLE', 'CAR'],
    default: 'MOTORCYCLE',
  })
  vehicleType: string;

  @Column({ name: 'vehicle_plate', unique: true })
  vehiclePlate: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({
    unique: true,
  })
  document: string;

  @Column({
    type: 'enum',
    enum: CourierStatus,
    default: CourierStatus.OFFLINE,
  })
  status: CourierStatus;

  @Column({
    type: 'int',
    default: 0,
  })
  balance: number;

  @Column({
    type: 'int',
    name: 'total_deliveries',
    default: 0,
  })
  totalDeliveries: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lastLat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lastLng: number;
}
