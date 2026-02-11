import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courier } from '../entities';
import { CourierStatus, GetResponse } from '@orion/contracts';
import { EXCHANGES, RabbitMQService, ROUTING_KEYS } from '@orion/queue';

@Injectable()
export class CourierService {
  constructor(
    @InjectRepository(Courier)
    private readonly courierRepository: Repository<Courier>,

    private queueService: RabbitMQService,
  ) {}

  async create(data: Partial<Courier>) {
    const courier = this.courierRepository.create(data);
    return this.courierRepository.save(courier);
  }

  async updateStatus(id: string, status: CourierStatus) {
    const courier = await this.courierRepository.findOneBy({
      id,
    });

    if (!courier) {
      throw new NotFoundException('Courier not found');
    }

    courier.status = status;

    const updatedCourier = await this.courierRepository.save(courier);

    await this.queueService.publish(
      EXCHANGES.MAIN,
      ROUTING_KEYS.COURIER_STATUS_UPDATED,
      {
        courierId: id,
        status: status,
        lastLat: courier.lastLat,
        lastLng: courier.lastLng,
        vehicleType: courier.vehicleType,
      },
    );

    return updatedCourier;
  }

  async findAll(): Promise<GetResponse<Courier>> {
    const [data, count] = await this.courierRepository.findAndCount();

    return {
      data,
      count,
    };
  }
}
