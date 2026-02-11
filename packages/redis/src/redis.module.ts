import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";

export const REDIS = Symbol("REDIS");
@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: () => {
        const url = process.env.REDIS_URL;
        if (!url) throw new Error("REDIS_URL is not set");

        return new Redis(url, {
          maxRetriesPerRequest: null, // recomendado para workers/consumers
          enableReadyCheck: true,
        });
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
