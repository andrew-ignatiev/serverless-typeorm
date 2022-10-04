import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';

export type NewEvent = Omit<EventEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type FilterParams = {
  typeIds: number[];
  storeIds: number[];
};

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  /**
   * Creates single record
   */
  save(event: NewEvent) {
    return this.eventRepository.save(event);
  }

  /**
   * Creates many records of given type within transaction
   */
  createMany(events: Array<NewEvent>) {
    return this.eventRepository.manager.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(EventEntity)
        .values(events)
        .execute();
    });
  }

  /**
   * Selects entities for given filter params
   */
  findByParams(params: FilterParams) {
    return this.eventRepository.find({
      where: {
        typeId: In(params.typeIds),
        storeId: In(params.storeIds),
      },
    });
  }

  /**
   * Selects last updated record
   */
  async findLastUpdated() {
    return (
      await this.eventRepository.find({
        order: {
          updatedAt: 'DESC',
        },
        take: 1,
      })
    ).shift();
  }

  /**
   * Deletes all records of given type
   */
  clear() {
    return this.eventRepository.manager.transaction(async (manager) => {
      await manager.delete(EventEntity, {});
    });
  }
}
