import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Dispatch } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { RabbitMQService } from '@orion/queue';

@Injectable()
export class DispatchService {
  constructor(
    @InjectRepository(Dispatch)
    private readonly dispatchRepository: Repository<Dispatch>,
    private readonly rabbit: RabbitMQService,
  ) {}
}
