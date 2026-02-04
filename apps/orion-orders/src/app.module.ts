import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@orion/db';
@Module({
  imports: [
    DatabaseModule.forRoot({
      serviceName: 'orders', // Usa o schema "orders"
      entities: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
