import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../entities';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/category/:id')
  async findByCategoryId(@Param('id') categoryId: string) {
    return await this.productService.findByCategory(categoryId);
  }
  @Post('/category/:id')
  async create(
    @Body() data: Partial<Product>,
    @Param('id') categoryId: string,
  ) {
    return await this.productService.create(data, categoryId);
  }

  @Delete('/:id')
  async softDelete(@Param('id') id: string) {
    return await this.productService.softDelete(id);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Product>) {
    return await this.productService.update(id, data);
  }
}
