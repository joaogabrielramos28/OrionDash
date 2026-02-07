import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";
import { RabbitMQModuleOptions } from "./interfaces/rabbitmq-options.interface";
import { RABBITMQ_MODULE_OPTIONS } from "./constants/rabbitmq.constants";

@Global()
@Module({})
export class RabbitMQModule {
  static forRoot(options: RabbitMQModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: RABBITMQ_MODULE_OPTIONS,
      useValue: options,
    };

    const serviceProvider: Provider = {
      provide: RabbitMQService,
      useFactory: async (opts: RabbitMQModuleOptions) => {
        const service = new RabbitMQService(opts.url, opts.prefetchCount);
        await service.onModuleInit();
        console.log("OIII");

        if (opts.exchanges) {
          for (const exchange of opts.exchanges) {
            console.log(`DEBUG: Creating exchange ${exchange.name}`);
            await service.assertExchange(
              exchange.name,
              exchange.type,
              exchange.options,
            );
          }
        }

        if (opts.queues) {
          for (const queue of opts.queues) {
            await service.assertQueue(queue.name, queue.options);
            await service.bindQueue(
              queue.name,
              queue.exchange,
              queue.routingKey,
            );
          }
        }

        return service;
      },
      inject: [RABBITMQ_MODULE_OPTIONS],
    };

    return {
      module: RabbitMQModule,
      providers: [optionsProvider, serviceProvider],
      exports: [RabbitMQService],
    };
  }
}
