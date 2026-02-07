import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../entities';
import { FindAllRestaurants } from './dto/find-all.dto';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create(restaurantData);

    return await this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurantData: Partial<Restaurant>,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOneBy({
      id,
    });

    if (!restaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }

    this.restaurantRepository.merge(restaurant, restaurantData);

    const updated = await this.restaurantRepository.save(restaurant);

    return updated;
  }

  async findAll(): Promise<FindAllRestaurants> {
    const [restaurants, count] = await this.restaurantRepository.findAndCount();

    return {
      data: restaurants,
      count,
    };
  }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOneBy({
      id,
    });
    if (!restaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }

    return restaurant;
  }
}
