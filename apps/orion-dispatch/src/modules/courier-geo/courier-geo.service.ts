import { Inject, Injectable } from '@nestjs/common';
import { CACHE_KEY, Redis, REDIS } from '@orion/redis';

Injectable();
export class CourierGeoService {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async setAvailable(courierId: string, lat: number, long: number) {
    await this.redis.geoadd(
      CACHE_KEY.COURIER_GEO_AVAILABLE,
      lat,
      long,
      courierId,
    );
  }

  async remove(courierId: string) {
    await this.redis.zrem(CACHE_KEY.COURIER_GEO_AVAILABLE, courierId);
  }

  async findNearby(lng: number, lat: number, radiusKm = 5, count = 10) {
    const couriers = await this.redis.geosearch(
      CACHE_KEY.COURIER_GEO_AVAILABLE,
      'FROMLONLAT',
      lat,
      lng,
      'BYRADIUS',
      radiusKm,
      'KM',
      'ASC',
      'COUNT',
      count,
    );

    return couriers as string[];
  }
}
