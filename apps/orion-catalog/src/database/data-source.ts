import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Category, Product, Restaurant } from './entities';
dotenv.config();

export const OrdersDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'orders_use33r',
  password: process.env.POSTGRES_PASSWORD || 'orders_secret',
  database: process.env.POSTGRES_DB || 'orders_db',
  schema: 'public',

  entities: [Category, Product, Restaurant],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,
  logging: true,
});
