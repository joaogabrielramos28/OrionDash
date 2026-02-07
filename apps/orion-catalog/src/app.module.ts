import { Module } from '@nestjs/common';
import { DatabaseModule } from '@orion/db';

import { ConfigModule } from '@nestjs/config';
import { Category, Product, Restaurant } from './modules/entities';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
@Module({
  imports: [
    DatabaseModule.forRoot({
      entities: [Category, Product, Restaurant],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RestaurantModule,
    CategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
