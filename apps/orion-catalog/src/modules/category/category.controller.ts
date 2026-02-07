import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../entities';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/restaurant/:id')
  async findByRestaurant(@Param('id') restaurantId: string) {
    return await this.categoryService.findAllByRestaurant(restaurantId);
  }
  @Post('/restaurant/:id')
  @HttpCode(201)
  async create(
    @Body() data: Partial<Category>,
    @Param('id') restaurantId: string,
  ) {
    return await this.categoryService.create(data, restaurantId);
  }
  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Category>) {
    return await this.categoryService.update(id, data);
  }
}
