import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Repository } from 'typeorm';
import { FindAllCategory } from './dto/find-all.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly restaurantService: RestaurantService,
  ) {}

  async create(
    data: Partial<Category>,
    restaurantId: string,
  ): Promise<Category> {
    const restaurant = await this.restaurantService.findById(restaurantId);

    if (!restaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }
    const category = this.categoryRepository.create({
      ...data,
      restaurantId: restaurantId,
    });

    return await this.categoryRepository.save(category);
  }

  async findAllByRestaurant(restaurantId: string): Promise<FindAllCategory> {
    const restaurant = await this.restaurantService.findById(restaurantId);
    if (!restaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }

    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {
        restaurantId,
      },
    });

    return {
      data: categories,
      count,
    };
  }

  async update(id: string, data: Partial<Category>) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    this.categoryRepository.merge(category, data);

    return await this.categoryRepository.save(category);
  }

  async findById(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }
}
