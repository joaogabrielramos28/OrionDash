import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

export interface DatabaseModuleOptions {
  entities: any[];
}
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: "postgres",
            host: config.getOrThrow("DB_HOST"),
            port: config.get("DB_PORT", 5432),
            username: config.getOrThrow("DB_USER"),
            password: config.getOrThrow("DB_PASSWORD"),
            database: config.getOrThrow("DB_NAME"),
            schema: "public",

            entities: options.entities,
            synchronize: config.get("NODE_ENV") !== "production",
            logging: config.get("DB_LOGGING", "false") === "true",
            migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
            migrationsRun: config.get("RUN_MIGRATIONS", "true") === "true",
            extra: {
              max: config.get("DB_POOL_MAX", 10),
              min: config.get("DB_POOL_MIN", 2),
              idleTimeoutMillis: config.get("DB_IDLE_TIMEOUT", 30000),
            },
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
