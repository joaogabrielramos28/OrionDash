import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseRepository } from '@orion/db';
import { Product } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { FindAllProduct } from './dto/find-all.dto';
import { In } from 'typeorm';
import { GetProductsRequest, GetProductsResponse } from '@orion/contracts';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: BaseRepository<Product>,

    private readonly categoryService: CategoryService,
  ) {}

  async create(
    productData: Partial<Product>,
    categoryId: string,
  ): Promise<Product> {
    const category = await this.categoryService.findById(categoryId);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const product = this.productRepository.create({
      ...productData,
      categoryId,
      restaurantId: category.restaurantId,
    });

    return await this.productRepository.save(product);
  }

  async findByCategory(categoryId: string): Promise<FindAllProduct> {
    await this.categoryService.findById(categoryId);

    const [products, count] = await this.productRepository.findAndCount({
      where: {
        categoryId,
      },
    });

    return {
      data: products,
      count,
    };
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    this.productRepository.merge(product, data);

    return await this.productRepository.save(product);
  }

  async softDelete(productId: string) {
    const product = await this.productRepository.findByIdOrFail(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }

  async findProductsByIds({
    productIds,
    restaurantId,
  }: GetProductsRequest): Promise<GetProductsResponse> {
    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
        restaurantId,
        isActive: true,
      },
    });

    return {
      products: products.map((item) => ({
        ...item,
        priceVersion: item.updatedAt.getTime(),
      })),
    };
  }
}
