import { Repository, FindOptionsWhere } from "typeorm";
import { BaseEntity } from "./base.entity";

export class BaseRepository<T extends BaseEntity> extends Repository<T> {
  async findByIdOrFail(id: string): Promise<T> {
    const entity = await this.findOne({ where: { id } as FindOptionsWhere<T> });
    if (!entity) {
      throw new Error(`${this.metadata.name} with id ${id} not found`);
    }
    return entity;
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.count({ where: { id } as FindOptionsWhere<T> });
    return count > 0;
  }
}
