import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CourierService } from './courier.service';
import { Courier } from '../entities';
import { CourierStatus } from '@orion/contracts';

@Controller('courier')
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @Post('/')
  @HttpCode(201)
  async create(@Body() data: Partial<Courier>) {
    return await this.courierService.create(data);
  }

  @Put('/:id/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: CourierStatus,
  ) {
    return await this.courierService.updateStatus(id, status);
  }

  @Get()
  async findAll() {
    return await this.courierService.findAll();
  }
}
