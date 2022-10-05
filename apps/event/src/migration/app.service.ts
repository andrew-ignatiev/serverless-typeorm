import { Connection } from 'typeorm';
import { Controller, Logger } from '@nestjs/common';

@Controller()
export class AppService {
  static readonly LOG_MIGRATION_START = `Database migration has been started`;
  static readonly LOG_MIGRATION_COMPLETE = `Database migration has been completed`;

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly connection: Connection) {}

  /**
   * Runs database migrations scripts
   */
  async run() {
    this.logger.log(AppService.LOG_MIGRATION_START);

    await this.connection.runMigrations();

    this.logger.log(AppService.LOG_MIGRATION_COMPLETE);
  }
}
