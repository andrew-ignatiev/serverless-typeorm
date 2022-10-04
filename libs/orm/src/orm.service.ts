import { OrmOptions } from '@app-libs/orm/interfaces';
import { ORM_OPTIONS } from '@app-libs/orm/constants';
import { OrmConfigService } from '@app-libs/orm/config/orm/config.service';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class OrmService {
  constructor(
    @Inject(ORM_OPTIONS)
    private readonly ormOptions: OrmOptions,
    private readonly ormConfigService: OrmConfigService,
  ) {}

  /**
   * Returns TypeOrm configuration settings
   */
  getTypeOrmConfiguration(node: string): TypeOrmModuleOptions {
    const options = this.ormOptions.find((v) => v.node === node)?.options ?? [];

    return {
      host: this.ormConfigService.getHost(node),
      username: this.ormConfigService.getUsername(node),
      password: this.ormConfigService.getPassword(node),
      database: this.ormConfigService.getDatabase(node),
      ...options,
    } as TypeOrmModuleOptions;
  }
}
