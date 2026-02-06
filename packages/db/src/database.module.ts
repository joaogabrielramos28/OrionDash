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
            host: config.getOrThrow("POSTGRES_HOST"),
            port: config.get("POSTGRES_PORT", 5432),
            username: config.getOrThrow("POSTGRES_USER"),
            password: config.getOrThrow("POSTGRES_PASSWORD"),
            database: config.getOrThrow("POSTGRES_DB"),
            schema: config.get("POSTGRES_SCHEMA", "public"),

            entities: options.entities,

            synchronize: config.get("NODE_ENV") !== "production",
            logging: config.get("DB_LOGGING", "false") === "true",

            migrations: [],
            migrationsRun: false,
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
