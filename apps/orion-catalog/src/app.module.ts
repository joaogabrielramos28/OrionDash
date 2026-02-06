import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@orion/db';

import { ConfigModule } from '@nestjs/config';
import { Category, Product, Restaurant } from './database/entities';
@Module({
  imports: [
    DatabaseModule.forRoot({
      entities: [Category, Product, Restaurant],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
