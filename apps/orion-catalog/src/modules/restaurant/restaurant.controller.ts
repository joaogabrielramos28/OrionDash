import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from '../entities';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('/')
  async findAll() {
    return await this.restaurantService.findAll();
  }
  @Post('/')
  @HttpCode(201)
  async create(@Body() data: Partial<Restaurant>) {
    return await this.restaurantService.create(data);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Restaurant>) {
    return await this.restaurantService.update(id, data);
  }
}
